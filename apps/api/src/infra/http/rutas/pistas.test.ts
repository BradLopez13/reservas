import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { arrancarPostgres } from '../../../../test/contenedor.ts';
import { crearAppTest } from '../../../../test/appTest.ts';
import { pistas } from '../../db/schema.ts';

let pg: Awaited<ReturnType<typeof arrancarPostgres>>;
let t: Awaited<ReturnType<typeof crearAppTest>>;
let pistaId: string;

beforeAll(async () => {
  pg = await arrancarPostgres(); t = await crearAppTest(pg);
  const [p] = await t.deps.db.insert(pistas).values({ nombre: 'Pádel 1', deporte: 'padel', duracionMin: 90, apertura: '09:00', cierre: '22:00' }).returning();
  pistaId = p!.id;
});
afterAll(async () => { await t.cerrar(); await pg.parar(); });

describe('pistas', () => {
  it('lista las pistas y filtra por deporte', async () => {
    const todas = await t.app.inject({ method: 'GET', url: '/api/pistas' });
    expect(todas.json()).toHaveLength(1);
    expect(todas.json()[0]).toMatchObject({ nombre: 'Pádel 1', deporte: 'padel', duracionMin: 90, apertura: '09:00', cierre: '22:00' });
    expect((await t.app.inject({ method: 'GET', url: '/api/pistas?deporte=tenis' })).json()).toHaveLength(0);
  });
  it('devuelve las 8 franjas del día, todas libres', async () => {
    const res = await t.app.inject({ method: 'GET', url: `/api/pistas/${pistaId}/franjas?fecha=2026-10-25` });
    expect(res.statusCode).toBe(200);
    expect(res.json()).toHaveLength(8);
    expect(res.json()[0]).toEqual({ inicio: '2026-10-25T08:00:00.000Z', fin: '2026-10-25T09:30:00.000Z', libre: true });
  });
  it('404 si la pista no existe', async () => {
    expect((await t.app.inject({ method: 'GET', url: '/api/pistas/00000000-0000-0000-0000-000000000000/franjas?fecha=2026-10-25' })).statusCode).toBe(404);
  });
});
