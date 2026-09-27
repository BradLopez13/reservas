import type { RouteHandlerMethod } from 'fastify';
import type { Contexto } from '../../../../../contexto.ts';
import { cerrarSesion } from '../../../application/commands/cerrarSesion.ts';
import { borrarCookie } from '../sesion.plugin.ts';

export const logout = (ctx: Contexto): RouteHandlerMethod => async (req, reply) => {
  if (req.sesion) await cerrarSesion(ctx, req.sesion.sesionId);
  borrarCookie(reply, ctx);
  return reply.status(204).send();
};
