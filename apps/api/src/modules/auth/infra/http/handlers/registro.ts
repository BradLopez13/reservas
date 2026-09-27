import type { RouteHandlerMethod } from 'fastify';
import { RegistroBodySchema } from '@reservas/contracts';
import type { Contexto } from '../../../../../contexto.ts';
import { entrada } from '../../../../../shared/http/validar.ts';
import { registrar } from '../../../application/commands/registrar.ts';
import { ponerCookie } from '../sesion.plugin.ts';

export const registro = (ctx: Contexto): RouteHandlerMethod => async (req, reply) => {
  const { usuario, token } = await registrar(ctx, entrada.body(req, RegistroBodySchema));
  ponerCookie(reply, ctx, token);
  return reply.status(201).send(usuario);
};
