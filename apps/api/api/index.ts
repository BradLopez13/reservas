import type { IncomingMessage, ServerResponse } from 'node:http';
import { crearApp } from '../src/app.ts';
import { crearContexto } from '../src/contexto.ts';
import { leerConfig } from '../src/shared/config.ts';
import { crearDb } from '../src/shared/db/cliente.ts';

// Adaptador para Vercel Functions: la misma app Fastify que en src/index.ts,
// pero atendiendo las peticiones que Vercel le pasa en lugar de escuchar un puerto.
const config = leerConfig();
const { db } = crearDb(config.databaseUrl, 5);
const app = await crearApp(crearContexto(config, db));

export default async function handler(req: IncomingMessage, res: ServerResponse) {
  await app.ready();
  app.server.emit('request', req, res);
}
