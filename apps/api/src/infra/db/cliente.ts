import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema.ts';

export function crearDb(url: string, max = 10) {
  // prepare:false porque el pooler de Supabase en modo transacción (Supavisor)
  // no admite sentencias preparadas con nombre.
  const sql = postgres(url, { max, prepare: false });
  const db = drizzle(sql, { schema });
  return { db, sql };
}
export type Db = ReturnType<typeof crearDb>['db'];
export type Tx = Parameters<Parameters<Db['transaction']>[0]>[0];
