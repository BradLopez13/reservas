import { describe, expect, it } from 'vitest';
import { crearApp } from './app.ts';
import { leerConfig } from './shared/config.ts';

// Estos tests no tocan la base de datos: db y repos son de mentira.
const config = leerConfig({ DATABASE_URL: 'postgres://x', APP_ORIGIN: 'http://localhost:8080' });
const ctx = { config, db: { transaction: async () => null } as never, repos: {} as never, ahora: () => new Date() };

describe('config', () => {
  it('sin COOKIE_SECURE la cookie no lleva el prefijo __Host-', () => {
    expect(leerConfig({ DATABASE_URL: 'postgres://x', APP_ORIGIN: 'http://localhost:8080', COOKIE_SECURE: 'false' }).cookieName).toBe('sesion');
  });
});

describe('app', () => {
  it('responde en /api/healthz', async () => {
    const app = await crearApp(ctx);
    const res = await app.inject({ method: 'GET', url: '/api/healthz' });
    expect(res.statusCode).toBe(200);
    expect(res.json()).toEqual({ ok: true });
  });

  it('rechaza un POST sin cabecera Origin', async () => {
    const app = await crearApp(ctx);
    const res = await app.inject({ method: 'POST', url: '/api/cualquiera', payload: {} });
    expect(res.statusCode).toBe(403);
    expect(res.json().error.code).toBe('ORIGEN_NO_PERMITIDO');
  });

  it('rechaza un POST con Origin ajeno', async () => {
    const app = await crearApp(ctx);
    const res = await app.inject({ method: 'POST', url: '/api/cualquiera', headers: { origin: 'https://malo.example' }, payload: {} });
    expect(res.statusCode).toBe(403);
  });

  it('devuelve 404 con el formato de error común', async () => {
    const app = await crearApp(ctx);
    const res = await app.inject({ method: 'GET', url: '/api/no-existe' });
    expect(res.statusCode).toBe(404);
    expect(res.json().error.message).toBeTypeOf('string');
  });
});
