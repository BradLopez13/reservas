import { defineConfig } from 'drizzle-kit';

// drizzle-kit se conecta por el pooler en modo sesión si existe, como las
// migraciones; sin URL en el entorno no hay valor por defecto: se exporta .env antes.
const url = process.env.DATABASE_URL_DIRECT ?? process.env.DATABASE_URL;
if (!url) throw new Error('Falta DATABASE_URL (o DATABASE_URL_DIRECT): exporta apps/api/.env antes de usar drizzle-kit');

export default defineConfig({
  dialect: 'postgresql',
  schema: './src/shared/db/schema.ts',
  out: './drizzle',
  dbCredentials: { url },
});
