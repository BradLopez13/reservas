import type { IncomingMessage, ServerResponse } from 'node:http';
import { crearApp } from '../src/app.ts';
import { leerConfig } from '../src/config.ts';
import { crearDb } from '../src/infra/db/cliente.ts';
import { crearRepos } from '../src/infra/repositories/index.ts';

// Adaptador para Vercel Functions: la misma app Fastify que en src/index.ts,
// pero atendiendo las peticiones que Vercel le pasa en lugar de escuchar un puerto.
const config = leerConfig();
const { db } = crearDb(config.databaseUrl, 5);
const app = await crearApp({ config, db, repos: crearRepos(config), ahora: () => new Date() });

export default async function handler(req: IncomingMessage, res: ServerResponse) {
  await app.ready();
  app.server.emit('request', req, res);
}
