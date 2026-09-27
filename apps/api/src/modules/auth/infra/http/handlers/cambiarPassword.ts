import type { RouteHandlerMethod } from 'fastify';
import { CambiarPasswordBodySchema } from '@reservas/contracts';
import type { Contexto } from '../../../../../contexto.ts';
import { entrada } from '../../../../../shared/http/validar.ts';
import { cambiarPassword as cambiar } from '../../../application/commands/cambiarPassword.ts';

export const cambiarPassword = (ctx: Contexto): RouteHandlerMethod => async (req, reply) => {
  const b = entrada.body(req, CambiarPasswordBodySchema);
  await cambiar(ctx, { usuarioId: req.sesion!.usuario.id, sesionId: req.sesion!.sesionId, actual: b.actual, nueva: b.nueva });
  return reply.status(204).send();
};
