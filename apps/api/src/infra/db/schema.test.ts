import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { arrancarPostgres } from '../../../test/contenedor.ts';
import { crearDb } from './cliente.ts';
import { codigoPg } from './errores.ts';
import { pistas, reservas, usuarios } from './schema.ts';

let pg: Awaited<ReturnType<typeof arrancarPostgres>>;
let conn: ReturnType<typeof crearDb>;

beforeAll(async () => { pg = await arrancarPostgres(); conn = crearDb(pg.url); });
afterAll(async () => { await conn.sql.end(); await pg.parar(); });

describe('esquema', () => {
  it('guarda y lee un tstzrange', async () => {
    const [u] = await conn.db.insert(usuarios).values({ email: 'a@example.com', passwordHash: 'x', nombre: 'Ana' }).returning();
    const [p] = await conn.db.insert(pistas).values({ nombre: 'Pádel 1', deporte: 'padel', duracionMin: 90, apertura: '09:00', cierre: '22:00' }).returning();
    const periodo = { inicio: new Date('2026-10-25T08:00:00Z'), fin: new Date('2026-10-25T09:30:00Z') };
    const [r] = await conn.db.insert(reservas).values({ pistaId: p!.id, usuarioId: u!.id, periodo }).returning();
    expect(r!.periodo).toEqual(periodo);
  });

  it('la restricción EXCLUDE impide dos reservas solapadas', async () => {
    const [u] = await conn.db.select().from(usuarios);
    const [p] = await conn.db.select().from(pistas);
    const periodo = { inicio: new Date('2026-10-25T09:00:00Z'), fin: new Date('2026-10-25T10:30:00Z') };
    await expect(conn.db.insert(reservas).values({ pistaId: p!.id, usuarioId: u!.id, periodo })).rejects.toSatisfy((e) => codigoPg(e) === '23P01');
  });
});
