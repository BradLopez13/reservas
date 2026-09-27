import type { RouteHandlerMethod } from 'fastify';
import { LoginBodySchema } from '@reservas/contracts';
import type { Contexto } from '../../../../../contexto.ts';
import { entrada } from '../../../../../shared/http/validar.ts';
import { iniciarSesion } from '../../../application/commands/iniciarSesion.ts';
import { ponerCookie } from '../sesion.plugin.ts';

export const login = (ctx: Contexto): RouteHandlerMethod => async (req, reply) => {
  const { token } = await iniciarSesion(ctx, { ...entrada.body(req, LoginBodySchema), ip: req.ip });
  ponerCookie(reply, ctx, token);
  return reply.status(204).send();
};
