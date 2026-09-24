import Fastify from 'fastify';
import type { Config } from './config.ts';
import type { IntentoLoginRepository, SesionRepository, UsuarioRepository } from './domain/ports.ts';
import type { Db } from './infra/db/cliente.ts';
import { registrarErrores } from './infra/http/plugins/errores.ts';
import { registrarOrigen } from './infra/http/plugins/origen.ts';
import { registrarSesion } from './infra/http/plugins/sesion.ts';
import { rutasAuth } from './infra/http/rutas/auth.ts';

export interface Dependencias {
  config: Config;
  db: Db;
  repos: { usuarios: UsuarioRepository; sesiones: SesionRepository; intentos: IntentoLoginRepository };
  ahora: () => Date;
}

export async function crearApp(deps: Dependencias) {
  const app = Fastify({ logger: process.env.NODE_ENV !== 'test' });
  registrarErrores(app);
  registrarOrigen(app, deps.config.appOrigin);
  await registrarSesion(app, deps);
  app.get('/api/healthz', async () => ({ ok: true }));
  rutasAuth(app, deps);
  return app;
}
