import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest';
import { arrancarPostgres, quitarExclude } from '../../../../../../test/contenedor.ts';
import { reservarPista } from '../../../application/commands/reservarPista.ts';
import { Contencion, PistaOcupadaError } from '../../../../../shared/errores.ts';
import { generarFranjas } from '../../../../pistas/domain/franjas.ts';
import { crearDb } from '../../../../../shared/db/cliente.ts';
import { pistas, reservas, usuarios } from '../../../../../shared/db/schema.ts';
import { crearRepos } from '../../../../../contexto.ts';

const ESTRATEGIAS = ['pesimista', 'optimista', 'exclude'] as const;

// La misma batería para las tres estrategias. Las dos primeras corren SIN la
// restricción EXCLUDE, para que la base de datos no les tape los fallos.
describe.each(ESTRATEGIAS)('estrategia %s', (nombre) => {
  let pg: Awaited<ReturnType<typeof arrancarPostgres>>;
  let conn: ReturnType<typeof crearDb>;
  let usuarioId: string;
  let pistaId: string;
  let pistaCortaId: string;
  const corta = { nombre: 'Pádel exprés', deporte: 'padel' as const, duracionMin: 15, apertura: '08:00', cierre: '21:00' };
  const inicio = new Date('2026-10-25T08:00:00Z');
  const deps = () => ({ db: conn.db, repos: crearRepos({ estrategiaReservas: nombre }), ahora: () => new Date('2026-10-24T06:00:00Z') });

  beforeAll(async () => {
    pg = await arrancarPostgres();
    conn = crearDb(pg.url, 20);
    if (nombre !== 'exclude') await quitarExclude(conn.sql);
    const [u] = await conn.db.insert(usuarios).values({ email: `${nombre}@example.com`, passwordHash: 'x', nombre: 'Ana' }).returning();
    const [p] = await conn.db.insert(pistas).values({ nombre: 'Pádel 1', deporte: 'padel', duracionMin: 90, apertura: '09:00', cierre: '22:00' }).returning();
    const [c] = await conn.db.insert(pistas).values(corta).returning();
    usuarioId = u!.id; pistaId = p!.id; pistaCortaId = c!.id;
  });
  afterAll(async () => { await conn.sql.end(); await pg.parar(); });
  beforeEach(async () => { await conn.sql`TRUNCATE reservas, pista_dias, idempotencia`; });

  it('crea una reserva confirmada', async () => {
    const r = await reservarPista(deps(), { usuarioId, pistaId, inicio });
    expect(r.estado).toBe('confirmada');
    expect(r.periodo.fin.toISOString()).toBe('2026-10-25T09:30:00.000Z');
  });

  it('rechaza una segunda reserva de la misma franja', async () => {
    await reservarPista(deps(), { usuarioId, pistaId, inicio });
    await expect(reservarPista(deps(), { usuarioId, pistaId, inicio })).rejects.toBeInstanceOf(PistaOcupadaError);
  });

  it('deja libre la franja cuando la reserva está cancelada', async () => {
    await reservarPista(deps(), { usuarioId, pistaId, inicio });
    await conn.db.update(reservas).set({ estado: 'cancelada' });
    await expect(reservarPista(deps(), { usuarioId, pistaId, inicio })).resolves.toMatchObject({ estado: 'confirmada' });
  });

  it('50 peticiones simultáneas por la última franja: exactamente una gana', async () => {
    const resultados = await Promise.allSettled(Array.from({ length: 50 }, () => reservarPista(deps(), { usuarioId, pistaId, inicio })));
    const ok = resultados.filter((r) => r.status === 'fulfilled');
    const ocupadas = resultados.filter((r) => r.status === 'rejected' && r.reason instanceof PistaOcupadaError);
    expect(ok).toHaveLength(1);
    expect(ocupadas).toHaveLength(49);
    expect(await conn.db.select().from(reservas)).toHaveLength(1);
  });

  // Todas las franjas están libres, así que PISTA_OCUPADA sería mentira. La
  // optimista comparte una versión por pista y día y puede agotar sus reintentos:
  // eso es CONTENCION. Las otras dos no compiten entre franjas distintas.
  it('50 peticiones simultáneas a 50 franjas libres del mismo día: ninguna recibe PISTA_OCUPADA', async () => {
    const franjas = generarFranjas(corta, '2026-10-25').slice(0, 50);
    expect(franjas).toHaveLength(50);
    const resultados = await Promise.allSettled(franjas.map((f) => reservarPista(deps(), { usuarioId, pistaId: pistaCortaId, inicio: f.inicio })));
    const ok = resultados.filter((r) => r.status === 'fulfilled');
    const otros = resultados.filter((r) => r.status === 'rejected' && !(r.reason instanceof Contencion));
    expect(otros).toEqual([]);
    expect(await conn.db.select().from(reservas)).toHaveLength(ok.length);
    if (nombre === 'optimista') expect(ok.length).toBeGreaterThan(0);
    else expect(ok).toHaveLength(50);
  });
});
