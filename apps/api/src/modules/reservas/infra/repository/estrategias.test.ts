import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest';
import { arrancarPostgres, quitarExclude } from '../../../test/contenedor.ts';
import { reservarPista } from '../../application/reservarPista.ts';
import { PistaOcupadaError } from '../../domain/errores.ts';
import { crearDb } from '../db/cliente.ts';
import { pistas, reservas, usuarios } from '../db/schema.ts';
import { crearReservaRepository } from './estrategia.ts';
import { idempotenciaRepository } from './idempotencia.ts';
import { pistaRepository } from './pistas.ts';

const ESTRATEGIAS = ['pesimista', 'optimista', 'exclude'] as const;

// La misma batería para las tres estrategias. Las dos primeras corren SIN la
// restricción EXCLUDE, para que la base de datos no les tape los fallos.
describe.each(ESTRATEGIAS)('estrategia %s', (nombre) => {
  let pg: Awaited<ReturnType<typeof arrancarPostgres>>;
  let conn: ReturnType<typeof crearDb>;
  let usuarioId: string;
  let pistaId: string;
  const inicio = new Date('2026-10-25T08:00:00Z');
  const deps = () => ({ db: conn.db, pistas: pistaRepository, reservas: crearReservaRepository(nombre), idempotencia: idempotenciaRepository, ahora: () => new Date('2026-10-24T06:00:00Z') });

  beforeAll(async () => {
    pg = await arrancarPostgres();
    conn = crearDb(pg.url, 20);
    if (nombre !== 'exclude') await quitarExclude(conn.sql);
    const [u] = await conn.db.insert(usuarios).values({ email: `${nombre}@example.com`, passwordHash: 'x', nombre: 'Ana' }).returning();
    const [p] = await conn.db.insert(pistas).values({ nombre: 'Pádel 1', deporte: 'padel', duracionMin: 90, apertura: '09:00', cierre: '22:00' }).returning();
    usuarioId = u!.id; pistaId = p!.id;
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
});
