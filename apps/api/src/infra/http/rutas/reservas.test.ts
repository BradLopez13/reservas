import { randomUUID } from 'node:crypto';
import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest';
import { arrancarPostgres } from '../../../../test/contenedor.ts';
import { cookieDe, crearAppTest, ORIGEN } from '../../../../test/appTest.ts';
import { pistas } from '../../db/schema.ts';

let pg: Awaited<ReturnType<typeof arrancarPostgres>>;
let t: Awaited<ReturnType<typeof crearAppTest>>;
let pistaId: string;
let cookie: string;
let cookie2: string;
const inicio = '2026-10-25T08:00:00.000Z';

beforeAll(async () => {
  pg = await arrancarPostgres(); t = await crearAppTest(pg);
  const [p] = await t.deps.db.insert(pistas).values({ nombre: 'Pádel 1', deporte: 'padel', duracionMin: 90, apertura: '09:00', cierre: '22:00' }).returning();
  pistaId = p!.id;
  cookie = cookieDe(await t.app.inject({ method: 'POST', url: '/api/auth/registro', headers: { origin: ORIGEN }, payload: { email: 'ana@example.com', password: 'contraseña-larga', nombre: 'Ana' } }));
  cookie2 = cookieDe(await t.app.inject({ method: 'POST', url: '/api/auth/registro', headers: { origin: ORIGEN }, payload: { email: 'luis@example.com', password: 'contraseña-larga', nombre: 'Luis' } }));
});
afterAll(async () => { await t.cerrar(); await pg.parar(); });
beforeEach(async () => { await t.sql`TRUNCATE reservas, idempotencia`; t.reloj.set(new Date('2026-10-24T06:00:00Z')); });

const reservar = (clave: string, c = cookie, body: object = { pistaId, inicio }) =>
  t.app.inject({ method: 'POST', url: '/api/reservas', headers: { origin: ORIGEN, cookie: c, 'idempotency-key': clave }, payload: body });

describe('POST /api/reservas', () => {
  it('crea la reserva y la franja pasa a ocupada', async () => {
    const res = await reservar(randomUUID());
    expect(res.statusCode).toBe(201);
    expect(res.json()).toMatchObject({ pistaNombre: 'Pádel 1', deporte: 'padel', inicio, fin: '2026-10-25T09:30:00.000Z', estado: 'confirmada' });
    const franjas = (await t.app.inject({ method: 'GET', url: `/api/pistas/${pistaId}/franjas?fecha=2026-10-25` })).json();
    expect(franjas[0].libre).toBe(false);
  });
  it('exige sesión y una Idempotency-Key uuid', async () => {
    expect((await t.app.inject({ method: 'POST', url: '/api/reservas', headers: { origin: ORIGEN, 'idempotency-key': randomUUID() }, payload: { pistaId, inicio } })).statusCode).toBe(401);
    expect((await reservar('no-es-uuid')).statusCode).toBe(422);
  });
  it('misma clave y mismo cuerpo: devuelve la misma reserva sin crear otra', async () => {
    const clave = randomUUID();
    const a = await reservar(clave);
    const b = await reservar(clave);
    expect(b.statusCode).toBe(201);
    expect(b.json().id).toBe(a.json().id);
    expect((await t.app.inject({ method: 'GET', url: '/api/reservas/mias', headers: { cookie } })).json()).toHaveLength(1);
  });
  it('misma clave con otro cuerpo: 422', async () => {
    const clave = randomUUID();
    await reservar(clave);
    expect((await reservar(clave, cookie, { pistaId, inicio: '2026-10-25T09:30:00.000Z' })).json().error.code).toBe('IDEMPOTENCIA_CONFLICTO');
  });
  it('otra persona en la misma franja: 409 PISTA_OCUPADA', async () => {
    await reservar(randomUUID());
    const res = await reservar(randomUUID(), cookie2);
    expect(res.statusCode).toBe(409);
    expect(res.json().error.code).toBe('PISTA_OCUPADA');
  });
  it('franja no alineada: 422 FRANJA_INVALIDA', async () => {
    expect((await reservar(randomUUID(), cookie, { pistaId, inicio: '2026-10-25T08:15:00.000Z' })).json().error.code).toBe('FRANJA_INVALIDA');
  });
});

describe('DELETE /api/reservas/:id', () => {
  it('cancela la propia con antelación y devuelve 404 para la ajena', async () => {
    const id = (await reservar(randomUUID())).json().id;
    expect((await t.app.inject({ method: 'DELETE', url: `/api/reservas/${id}`, headers: { origin: ORIGEN, cookie: cookie2 } })).statusCode).toBe(404);
    expect((await t.app.inject({ method: 'DELETE', url: `/api/reservas/${id}`, headers: { origin: ORIGEN, cookie } })).statusCode).toBe(204);
    expect((await t.app.inject({ method: 'GET', url: '/api/reservas/mias', headers: { cookie } })).json()[0].estado).toBe('cancelada');
  });
  it('con menos de 2 horas: 409 FUERA_DE_PLAZO', async () => {
    const id = (await reservar(randomUUID())).json().id;
    t.reloj.set(new Date('2026-10-25T06:30:00Z'));
    expect((await t.app.inject({ method: 'DELETE', url: `/api/reservas/${id}`, headers: { origin: ORIGEN, cookie } })).json().error.code).toBe('FUERA_DE_PLAZO');
  });
});
