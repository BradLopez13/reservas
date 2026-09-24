import { leerConfig } from '../src/config.ts';
import { crearDb } from '../src/infra/db/cliente.ts';
import { pistas } from '../src/infra/db/schema.ts';

const { db, sql } = crearDb(leerConfig().databaseUrl, 1);
const existentes = await db.select().from(pistas);
if (existentes.length === 0) {
  await db.insert(pistas).values([
    { nombre: 'Pádel 1', deporte: 'padel', duracionMin: 90, apertura: '09:00', cierre: '22:00' },
    { nombre: 'Pádel 2', deporte: 'padel', duracionMin: 90, apertura: '09:00', cierre: '22:00' },
    { nombre: 'Tenis 1', deporte: 'tenis', duracionMin: 60, apertura: '09:00', cierre: '22:00' },
    { nombre: 'Tenis 2', deporte: 'tenis', duracionMin: 60, apertura: '09:00', cierre: '22:00' },
    { nombre: 'Fútbol 7', deporte: 'futbol', duracionMin: 60, apertura: '10:00', cierre: '22:00' },
  ]);
  console.log('5 pistas creadas');
} else {
  console.log(`Ya hay ${existentes.length} pistas`);
}
await sql.end();
