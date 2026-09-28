import Fastify from 'fastify';
import { sql } from 'drizzle-orm';
import type { Contexto } from './contexto.ts';
import { rutasAuth } from './modules/auth/infra/http/rutas.ts';
import { registrarSesion } from './modules/auth/infra/http/sesion.plugin.ts';
import { rutasPistas } from './modules/pistas/infra/http/rutas.ts';
import { rutasReservas } from './modules/reservas/infra/http/rutas.ts';
import { registrarErrores } from './shared/http/errores.plugin.ts';
import { registrarOrigen } from './shared/http/origen.plugin.ts';

export async function crearApp(ctx: Contexto) {
  // Sin trustProxy, detrás de nginx o de Vercel req.ip sería la IP del proxy
  // para todo el mundo, y el límite de intentos por IP no distinguiría a nadie.
  // Fastify ignora un número de saltos a secas (no puede saber quién hay delante),
  // así que va como función: vale porque la API solo es accesible a través de ese
  // proxy (en Docker no publica puerto; en Vercel solo se entra por su red).
  const saltos = ctx.config.saltosProxy;
  const app = Fastify({ logger: process.env.NODE_ENV !== 'test', trustProxy: (_dir: string, salto: number) => salto < saltos });

  // Transversal: formato de errores, defensa CSRF y sesión.
  registrarErrores(app);
  registrarOrigen(app, ctx.config.appOrigin);
  await registrarSesion(app, ctx);

  // Toca la base de datos: si PostgreSQL no responde (o Supabase está pausado), no está sana.
  app.get('/api/healthz', async (_req, reply) => {
    try {
      await ctx.db.execute(sql`select 1`);
      return { ok: true };
    } catch (e) {
      app.log.error(e);
      return reply.status(503).send({ ok: false });
    }
  });

  // Un módulo por funcionalidad; cada uno registra sus rutas.
  rutasAuth(app, ctx);
  rutasPistas(app, ctx);
  rutasReservas(app, ctx);

  return app;
}
