import { crearApp } from '../src/app.ts';
import { leerConfig } from '../src/config.ts';
import { crearDb } from '../src/infra/db/cliente.ts';
import { intentoLoginRepository } from '../src/infra/repositories/intentosLogin.ts';
import { sesionRepository } from '../src/infra/repositories/sesiones.ts';
import { usuarioRepository } from '../src/infra/repositories/usuarios.ts';

export const ORIGEN = 'http://localhost:8080';

export async function crearAppTest(pg: { url: string }) {
  const config = leerConfig({ DATABASE_URL: pg.url, APP_ORIGIN: ORIGEN, COOKIE_SECURE: 'true' });
  const { db, sql } = crearDb(pg.url);
  const reloj = { valor: new Date('2026-10-24T06:00:00Z'), set(d: Date) { this.valor = d; } };
  const deps = {
    config, db, ahora: () => reloj.valor,
    repos: { usuarios: usuarioRepository, sesiones: sesionRepository, intentos: intentoLoginRepository },
  };
  const app = await crearApp(deps);
  return { app, deps, reloj, sql, cerrar: async () => { await app.close(); await sql.end(); } };
}

export const cookieDe = (res: { headers: Record<string, unknown> }) => String(res.headers['set-cookie']).split(';')[0]!;
