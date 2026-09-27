import { and, eq, sql } from 'drizzle-orm';
import { hashPassword } from '../src/modules/auth/infra/security/password.ts';
import { generarFranjas } from '../src/modules/pistas/domain/franjas.ts';
import { leerConfig } from '../src/shared/config.ts';
import { crearDb } from '../src/shared/db/cliente.ts';
import { pistas, reservas, usuarios } from '../src/shared/db/schema.ts';
import { fechaLocal } from '../src/shared/tiempo.ts';

// Datos de demostración: más pistas, doce cuentas de prueba y reservas
// repartidas entre la semana pasada y las dos próximas. Se puede ejecutar
// varias veces: no duplica pistas ni cuentas, y no toca los días que ya
// tienen reservas.

const PASSWORD_DEMO = 'demo-reservas-2026';

const PISTAS = [
  { nombre: 'Pádel 1', deporte: 'padel', duracionMin: 90, apertura: '09:00', cierre: '22:00' },
  { nombre: 'Pádel 2', deporte: 'padel', duracionMin: 90, apertura: '09:00', cierre: '22:00' },
  { nombre: 'Pádel 3', deporte: 'padel', duracionMin: 90, apertura: '08:00', cierre: '23:00' },
  { nombre: 'Pádel 4 cubierta', deporte: 'padel', duracionMin: 90, apertura: '08:00', cierre: '23:00' },
  { nombre: 'Tenis 1', deporte: 'tenis', duracionMin: 60, apertura: '09:00', cierre: '22:00' },
  { nombre: 'Tenis 2', deporte: 'tenis', duracionMin: 60, apertura: '09:00', cierre: '22:00' },
  { nombre: 'Tenis 3', deporte: 'tenis', duracionMin: 60, apertura: '08:00', cierre: '22:00' },
  { nombre: 'Fútbol 7', deporte: 'futbol', duracionMin: 60, apertura: '10:00', cierre: '22:00' },
  { nombre: 'Fútbol 5', deporte: 'futbol', duracionMin: 60, apertura: '10:00', cierre: '23:00' },
] as const;

const USUARIOS = [
  'Lucía Ferrer', 'Marcos Iglesias', 'Aitana Roig', 'Hugo Sánchez', 'Nerea Castaño', 'Iker Mendizábal',
  'Paula Domínguez', 'Adrián Cortés', 'Claudia Vilanova', 'Sergio Aranda', 'Martina Ochoa', 'Pablo Esteve',
];

const DIAS_ATRAS = 7;
const DIAS_ADELANTE = 14;
const DIA_MS = 86_400_000;

// Generador determinista: ejecutar el script dos veces reparte las mismas reservas.
function rng(semilla: number) {
  let s = semilla >>> 0;
  return () => { s = (s + 0x6d2b79f5) >>> 0; let t = s; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
}

// Probabilidad de que una franja esté reservada según la hora de Madrid y el día de la semana.
function probabilidad(inicio: Date) {
  const hora = Number(inicio.toLocaleTimeString('es-ES', { timeZone: 'Europe/Madrid', hour: '2-digit', hour12: false }));
  const finDeSemana = [0, 6].includes(new Date(inicio.toLocaleString('en-US', { timeZone: 'Europe/Madrid' })).getDay());
  const base = hora >= 18 ? 0.8 : hora >= 13 ? 0.35 : 0.3;
  return finDeSemana ? Math.min(base + 0.2, 0.95) : base;
}

const email = (nombre: string) =>
  `${nombre.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(' ', '.')}@example.com`;

const { db, sql: cliente } = crearDb(leerConfig().databaseUrl, 1);
const azar = rng(20260927);

// Pistas: se crean las que falten, por nombre.
const existentes = await db.select().from(pistas);
const nuevasPistas = PISTAS.filter((p) => !existentes.some((e) => e.nombre === p.nombre));
if (nuevasPistas.length > 0) await db.insert(pistas).values(nuevasPistas);
const todasLasPistas = await db.select().from(pistas);
console.log(`Pistas: ${todasLasPistas.length} (${nuevasPistas.length} nuevas)`);

// Cuentas: mismas credenciales para todas, hash calculado una sola vez.
const passwordHash = await hashPassword(PASSWORD_DEMO);
const cuentas = await db.select().from(usuarios);
const nuevasCuentas = USUARIOS.filter((n) => !cuentas.some((c) => c.email === email(n))).map((nombre) => ({ nombre, email: email(nombre), passwordHash }));
if (nuevasCuentas.length > 0) await db.insert(usuarios).values(nuevasCuentas);
const todasLasCuentas = (await db.select().from(usuarios)).filter((u) => USUARIOS.some((n) => email(n) === u.email));
console.log(`Cuentas de prueba: ${todasLasCuentas.length} (${nuevasCuentas.length} nuevas), contraseña «${PASSWORD_DEMO}»`);

// Reservas: por pista y día, una por franja según la probabilidad de esa hora.
let creadas = 0;
let canceladas = 0;
let diasSaltados = 0;
const hoy = Date.now();
for (const pista of todasLasPistas) {
  for (let d = -DIAS_ATRAS; d <= DIAS_ADELANTE; d++) {
    const fecha = fechaLocal(new Date(hoy + d * DIA_MS));
    const franjas = generarFranjas(pista, fecha);
    if (franjas.length === 0) continue;
    const dia = { inicio: franjas[0]!.inicio, fin: franjas[franjas.length - 1]!.fin };
    const [ocupado] = await db
      .select({ n: sql<number>`count(*)::int` })
      .from(reservas)
      .where(and(eq(reservas.pistaId, pista.id), sql`${reservas.periodo} && tstzrange(${dia.inicio.toISOString()}, ${dia.fin.toISOString()}, '[)')`));
    if ((ocupado?.n ?? 0) > 0) { diasSaltados++; continue; }

    const filas = franjas
      .filter((f) => azar() < probabilidad(f.inicio))
      .map((periodo) => {
        const cancelada = azar() < 0.1;
        if (cancelada) canceladas++; else creadas++;
        return { pistaId: pista.id, usuarioId: todasLasCuentas[Math.floor(azar() * todasLasCuentas.length)]!.id, periodo, estado: cancelada ? 'cancelada' as const : 'confirmada' as const };
      });
    if (filas.length > 0) await db.insert(reservas).values(filas);
  }
}
console.log(`Reservas: ${creadas} confirmadas y ${canceladas} canceladas, entre ${fechaLocal(new Date(hoy - DIAS_ATRAS * DIA_MS))} y ${fechaLocal(new Date(hoy + DIAS_ADELANTE * DIA_MS))}` + (diasSaltados ? ` (${diasSaltados} días ya tenían reservas y se han dejado como estaban)` : ''));

await cliente.end();
