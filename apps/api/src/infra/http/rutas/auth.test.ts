import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest';
import { arrancarPostgres } from '../../../../test/contenedor.ts';
import { cookieDe, crearAppTest, ORIGEN } from '../../../../test/appTest.ts';

let pg: Awaited<ReturnType<typeof arrancarPostgres>>;
let t: Awaited<ReturnType<typeof crearAppTest>>;
const H = { origin: ORIGEN };
const ana = { email: 'ana@example.com', password: 'contraseña-larga', nombre: 'Ana' };

beforeAll(async () => { pg = await arrancarPostgres(); t = await crearAppTest(pg); });
afterAll(async () => { await t.cerrar(); await pg.parar(); });
beforeEach(async () => { await t.sql`TRUNCATE usuarios, sesiones, intentos_login CASCADE`; t.reloj.set(new Date('2026-10-24T06:00:00Z')); });

const registrar = () => t.app.inject({ method: 'POST', url: '/api/auth/registro', headers: H, payload: ana });
const login = (password = ana.password) => t.app.inject({ method: 'POST', url: '/api/auth/login', headers: H, payload: { email: ana.email, password } });

describe('registro', () => {
  it('crea la cuenta, devuelve el usuario y pone la cookie __Host-sesion', async () => {
    const res = await registrar();
    expect(res.statusCode).toBe(201);
    expect(res.json()).toMatchObject({ email: ana.email, nombre: 'Ana' });
    const c = String(res.headers['set-cookie']);
    expect(c).toMatch(/^__Host-sesion=/);
    expect(c).toContain('HttpOnly'); expect(c).toContain('Secure'); expect(c).toContain('SameSite=Lax'); expect(c).toContain('Path=/');
    expect(c).not.toContain('Domain=');
  });
  it('rechaza un email repetido', async () => { await registrar(); expect((await registrar()).statusCode).toBe(409); });
  it('rechaza contraseñas de menos de 10 caracteres', async () => {
    const res = await t.app.inject({ method: 'POST', url: '/api/auth/registro', headers: H, payload: { ...ana, password: 'corta' } });
    expect(res.statusCode).toBe(422);
  });
});

describe('login', () => {
  beforeEach(registrar);
  it('emite un token distinto en cada login', async () => {
    const a = cookieDe(await login()); const b = cookieDe(await login());
    expect(a).not.toBe(b);
  });
  it('mismo error si el email no existe o la contraseña falla', async () => {
    const r1 = await login('otra-contraseña-x');
    const r2 = await t.app.inject({ method: 'POST', url: '/api/auth/login', headers: H, payload: { email: 'nadie@example.com', password: 'lo-que-sea-xx' } });
    expect(r1.statusCode).toBe(401); expect(r2.statusCode).toBe(401);
    expect(r1.json()).toEqual(r2.json());
  });
  it('bloquea el sexto intento fallido durante 15 minutos', async () => {
    for (let i = 0; i < 5; i++) await login('mal-mal-mal-mal');
    const res = await login();
    expect(res.statusCode).toBe(429);
    expect(Number(res.headers['retry-after'])).toBeGreaterThan(0);
    t.reloj.set(new Date('2026-10-24T06:16:00Z'));
    expect((await login()).statusCode).toBe(204);
  });
});

describe('sesión', () => {
  it('/yo devuelve el usuario con cookie válida y 401 sin ella', async () => {
    const cookie = cookieDe(await registrar());
    expect((await t.app.inject({ method: 'GET', url: '/api/auth/yo', headers: { cookie } })).json().email).toBe(ana.email);
    expect((await t.app.inject({ method: 'GET', url: '/api/auth/yo' })).statusCode).toBe(401);
  });
  it('tras el logout la cookie deja de valer', async () => {
    const cookie = cookieDe(await registrar());
    await t.app.inject({ method: 'POST', url: '/api/auth/logout', headers: { ...H, cookie } });
    expect((await t.app.inject({ method: 'GET', url: '/api/auth/yo', headers: { cookie } })).statusCode).toBe(401);
  });
  it('caduca a los 7 días sin uso', async () => {
    const cookie = cookieDe(await registrar());
    t.reloj.set(new Date('2026-10-31T06:00:01Z'));
    expect((await t.app.inject({ method: 'GET', url: '/api/auth/yo', headers: { cookie } })).statusCode).toBe(401);
  });
  it('cambiar la contraseña expulsa a las demás sesiones pero no a la actual', async () => {
    await registrar();
    const c1 = cookieDe(await login()); const c2 = cookieDe(await login());
    const res = await t.app.inject({ method: 'PUT', url: '/api/auth/password', headers: { ...H, cookie: c1 }, payload: { actual: ana.password, nueva: 'nueva-contraseña-larga' } });
    expect(res.statusCode).toBe(204);
    expect((await t.app.inject({ method: 'GET', url: '/api/auth/yo', headers: { cookie: c1 } })).statusCode).toBe(200);
    expect((await t.app.inject({ method: 'GET', url: '/api/auth/yo', headers: { cookie: c2 } })).statusCode).toBe(401);
  });
  it('cerrar-sesiones invalida todas', async () => {
    const c1 = cookieDe(await registrar()); const c2 = cookieDe(await login());
    await t.app.inject({ method: 'POST', url: '/api/auth/cerrar-sesiones', headers: { ...H, cookie: c1 } });
    expect((await t.app.inject({ method: 'GET', url: '/api/auth/yo', headers: { cookie: c2 } })).statusCode).toBe(401);
  });
});
