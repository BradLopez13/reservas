import type { IncomingMessage, ServerResponse } from 'node:http';
import { crearApp } from './app.ts';
import { crearContexto } from './contexto.ts';
import { leerConfig } from './shared/config.ts';
import { crearDb } from './shared/db/cliente.ts';

// Adaptador para Vercel Functions: la misma app Fastify que en src/index.ts,
// atendiendo las peticiones que Vercel le pasa en lugar de escuchar un puerto.
// Se empaqueta con esbuild en api/index.js (ver package.json → build:vercel).

const PARAM_RUTA = '__ruta';

// vercel.json reescribe /api/(.*) → /api?__ruta=$1. Vercel entrega la URL reescrita,
// así que aquí se reconstruye la original para que Fastify enrute con ella.
export function urlOriginal(url: string): string {
  const u = new URL(url, 'http://local');
  const ruta = u.searchParams.get(PARAM_RUTA);
  if (ruta === null) return url;
  u.searchParams.delete(PARAM_RUTA);
  return `/api/${ruta}${u.search}`;
}

// Delante solo está el proxy de Vercel, que reescribe X-Forwarded-For con la IP del cliente.
const config = leerConfig({ TRUST_PROXY_HOPS: '1', ...process.env });
const { db } = crearDb(config.databaseUrl, 5);
const app = await crearApp(crearContexto(config, db));

export default async function handler(req: IncomingMessage, res: ServerResponse) {
  await app.ready();
  req.url = urlOriginal(req.url ?? '/');
  app.server.emit('request', req, res);
}
