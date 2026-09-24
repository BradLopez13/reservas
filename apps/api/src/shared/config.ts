import { z } from 'zod';

const Schema = z.object({
  DATABASE_URL: z.string().min(1),
  APP_ORIGIN: z.url(),
  COOKIE_SECURE: z.enum(['true', 'false']).default('true'),
  RESERVAS_ESTRATEGIA: z.enum(['pesimista', 'optimista', 'exclude']).default('exclude'),
});

export type Config = ReturnType<typeof leerConfig>;

export function leerConfig(env: Record<string, string | undefined> = process.env) {
  const v = Schema.parse(env);
  const cookieSecure = v.COOKIE_SECURE === 'true';
  return {
    databaseUrl: v.DATABASE_URL,
    appOrigin: v.APP_ORIGIN,
    // El prefijo __Host- exige Secure; en local sin TLS la cookie se llama `sesion`.
    cookieName: cookieSecure ? '__Host-sesion' : 'sesion',
    cookieSecure,
    estrategiaReservas: v.RESERVAS_ESTRATEGIA,
  };
}
