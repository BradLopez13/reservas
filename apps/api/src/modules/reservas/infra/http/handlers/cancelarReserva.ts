import type { RouteHandlerMethod } from 'fastify';
import type { Contexto } from '../../../../../contexto.ts';
import { idDeRuta } from '../../../../../shared/http/validar.ts';
import { cancelarReserva as cancelar } from '../../../application/commands/cancelarReserva.ts';

export const cancelarReserva = (ctx: Contexto): RouteHandlerMethod => async (req, reply) => {
  await cancelar(ctx, { usuarioId: req.sesion!.usuario.id, reservaId: idDeRuta(req) });
  return reply.status(204).send();
};
