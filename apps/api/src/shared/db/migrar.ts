import { migrate } from 'drizzle-orm/postgres-js/migrator';
import { dirname, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { crearDb } from './cliente.ts';

export async function aplicarMigraciones(url: string) {
  const { db, sql } = crearDb(url, 1);
  const migrationsFolder = resolve(dirname(fileURLToPath(import.meta.url)), '../../../drizzle');
  await migrate(db, { migrationsFolder });
  await sql.end();
}

// Como script (`pnpm db:migrate`): usa la conexión directa si existe, porque las
// migraciones no funcionan a través del pool.
if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const url = process.env.DATABASE_URL_DIRECT ?? process.env.DATABASE_URL;
  if (!url) throw new Error('Falta DATABASE_URL');
  aplicarMigraciones(url).then(() => console.log('Migraciones aplicadas'));
}
