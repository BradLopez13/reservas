import type { RouteHandlerMethod } from 'fastify';
import { LoginBodySchema } from '@reservas/contracts';
import type { Contexto } from '../../../../../contexto.ts';
import { entrada } from '../../../../../shared/http/validar.ts';
import { iniciarSesion } from '../../../application/commands/iniciarSesion.ts';
import { ponerCookie } from '../sesion.plugin.ts';

export const login = (ctx: Contexto): RouteHandlerMethod => async (req, reply) => {
  const { email, password } = entrada.body(req, LoginBodySchema);
  const { token } = await iniciarSesion(ctx, { email, password, ip: req.ip });
  ponerCookie(reply, ctx, token);
  return reply.status(204).send();
};
