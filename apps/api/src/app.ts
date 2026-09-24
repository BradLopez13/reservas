import Fastify from 'fastify';
import type { Config } from './config.ts';
import { registrarErrores } from './infra/http/plugins/errores.ts';
import { registrarOrigen } from './infra/http/plugins/origen.ts';

export interface Dependencias { config: Config }

export function crearApp(deps: Dependencias) {
  const app = Fastify({ logger: process.env.NODE_ENV !== 'test' });
  registrarErrores(app);
  registrarOrigen(app, deps.config.appOrigin);
  app.get('/api/healthz', async () => ({ ok: true }));
  return app;
}
