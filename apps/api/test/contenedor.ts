import { PostgreSqlContainer } from '@testcontainers/postgresql';
import type postgres from 'postgres';
import { aplicarMigraciones } from '../src/infra/db/migrar.ts';

export async function arrancarPostgres() {
  const c = await new PostgreSqlContainer('postgres:17-alpine').start();
  const url = c.getConnectionUri();
  await aplicarMigraciones(url);
  return { url, parar: () => c.stop() };
}

// Las estrategias pesimista y optimista se prueban SIN la restricción, para que no les tape los fallos.
export async function quitarExclude(sql: postgres.Sql) {
  await sql`ALTER TABLE reservas DROP CONSTRAINT IF EXISTS reservas_sin_solape`;
}
