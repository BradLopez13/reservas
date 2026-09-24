import { crearApp } from '../src/app.ts';
import { crearContexto } from '../src/contexto.ts';
import { leerConfig } from '../src/shared/config.ts';
import { crearDb } from '../src/shared/db/cliente.ts';

export const ORIGEN = 'http://localhost:8080';

// La app real contra un PostgreSQL de Testcontainers, con un reloj que los tests pueden mover.
export async function crearAppTest(pg: { url: string }) {
  const config = leerConfig({ DATABASE_URL: pg.url, APP_ORIGIN: ORIGEN, COOKIE_SECURE: 'true', RESERVAS_ESTRATEGIA: 'exclude' });
  const { db, sql } = crearDb(pg.url);
  const reloj = { valor: new Date('2026-10-24T06:00:00Z'), set(d: Date) { this.valor = d; } };
  const ctx = crearContexto(config, db, () => reloj.valor);
  const app = await crearApp(ctx);
  return { app, ctx, reloj, sql, cerrar: async () => { await app.close(); await sql.end(); } };
}

export const cookieDe = (res: { headers: Record<string, unknown> }) => String(res.headers['set-cookie']).split(';')[0]!;
