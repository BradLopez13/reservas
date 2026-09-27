import type { RouteHandlerMethod } from 'fastify';
import type { Contexto } from '../../../../../contexto.ts';
import { cerrarTodasLasSesiones } from '../../../application/commands/cerrarSesion.ts';
import { borrarCookie } from '../sesion.plugin.ts';

export const cerrarSesiones = (ctx: Contexto): RouteHandlerMethod => async (req, reply) => {
  await cerrarTodasLasSesiones(ctx, req.sesion!.usuario.id);
  borrarCookie(reply, ctx);
  return reply.status(204).send();
};
