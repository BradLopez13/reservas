import type { Ctx } from '../../../../contexto.ts';
import { CredencialesInvalidas, DemasiadosIntentos } from '../../../../shared/errores.ts';
import { expiracion } from '../../domain/sesion.ts';
import { HASH_RELLENO, verificarPassword } from '../../infra/security/password.ts';
import { generarToken } from '../../infra/security/token.ts';

export const VENTANA_MS = 15 * 60 * 1000;

// Tres límites a la vez, cada uno con su contador. Por email e IP, fuerza bruta
// contra una cuenta desde una máquina. Por IP, una máquina probando muchas
// cuentas. Por email, muchas máquinas contra una cuenta: su umbral es alto para
// que bloquear la cuenta de otro exija al menos diez IP y no cinco contraseñas.
export function limitesDe(email: string, ip: string) {
  return {
    emailIp: { clave: `email-ip|${email}|${ip}`, max: 5 },
    ip: { clave: `ip|${ip}`, max: 20 },
    email: { clave: `email|${email}`, max: 50 },
  };
}

export async function iniciarSesion(ctx: Ctx, datos: { email: string; password: string; ip: string }) {
  const ahora = ctx.ahora();
  const limites = limitesDe(datos.email, datos.ip);
  const todos = Object.values(limites);

  // El intento se apunta ANTES de contar, en su propia transacción ya confirmada:
  // cada petición cuenta el suyo y los de todas las que contaron antes, así que
  // de N simultáneas pasan como mucho `max`. Contar primero y apuntar después
  // dejaba pasar a todas las que contaban a la vez.
  const ids = await ctx.db.transaction((tx) => ctx.repos.intentos.registrar(tx, todos.map((l) => l.clave), ahora));
  const desde = new Date(ahora.getTime() - VENTANA_MS);
  const esperaSeg = await ctx.db.transaction(async (tx) => {
    let espera = 0;
    for (const l of todos) {
      const { n, masAntiguo } = await ctx.repos.intentos.contar(tx, l.clave, desde);
      if (n > l.max && masAntiguo) espera = Math.max(espera, 1, Math.ceil((masAntiguo.getTime() + VENTANA_MS - ahora.getTime()) / 1000));
    }
    return espera;
  });
  if (esperaSeg > 0) {
    // Una petición rechazada no cuenta como intento: insistir no alarga el bloqueo.
    await ctx.db.transaction((tx) => ctx.repos.intentos.borrar(tx, ids));
    throw new DemasiadosIntentos(esperaSeg);
  }

  const usuario = await ctx.db.transaction((tx) => ctx.repos.usuarios.buscarPorEmail(tx, datos.email));
  // Mismo coste y mismo error exista o no el email. El intento fallido ya está apuntado.
  const ok = await verificarPassword(usuario?.passwordHash ?? HASH_RELLENO, datos.password);
  if (!usuario || !ok) throw new CredencialesInvalidas();

  // Token nuevo en cada login: nunca se reutiliza el que traiga la petición.
  const { token, hash } = generarToken();
  await ctx.db.transaction(async (tx) => {
    // Entrar borra los fallos de esta cuenta, pero no los de la IP: si no, una
    // cuenta propia serviría para reiniciar el contador entre prueba y prueba.
    await ctx.repos.intentos.borrar(tx, ids);
    await ctx.repos.intentos.limpiar(tx, [limites.emailIp.clave, limites.email.clave]);
    await ctx.repos.sesiones.crear(tx, { usuarioId: usuario.id, tokenHash: hash, creadaEn: ahora, expiraEn: expiracion(ahora, ahora) });
  });
  return { usuario: { id: usuario.id, email: usuario.email, nombre: usuario.nombre }, token };
}
