import Fastify from 'fastify';
import type { Contexto } from './contexto.ts';
import { rutasAuth } from './modules/auth/infra/rutas.ts';
import { registrarSesion } from './modules/auth/infra/sesion.plugin.ts';
import { rutasPistas } from './modules/pistas/infra/rutas.ts';
import { rutasReservas } from './modules/reservas/infra/rutas.ts';
import { registrarErrores } from './shared/http/errores.plugin.ts';
import { registrarOrigen } from './shared/http/origen.plugin.ts';

export async function crearApp(ctx: Contexto) {
  const app = Fastify({ logger: process.env.NODE_ENV !== 'test' });

  // Transversal: formato de errores, defensa CSRF y sesión.
  registrarErrores(app);
  registrarOrigen(app, ctx.config.appOrigin);
  await registrarSesion(app, ctx);

  app.get('/api/healthz', async () => ({ ok: true }));

  // Un módulo por funcionalidad; cada uno registra sus rutas.
  rutasAuth(app, ctx);
  rutasPistas(app, ctx);
  rutasReservas(app, ctx);

  return app;
}
