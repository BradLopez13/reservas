import type { RouteHandlerMethod } from 'fastify';
import { PistasQuerySchema } from '@reservas/contracts';
import type { Contexto } from '../../../../../contexto.ts';
import { entrada } from '../../../../../shared/http/validar.ts';
import { listarPistas as listar } from '../../../application/queries/listarPistas.ts';

export const listarPistas = (ctx: Contexto): RouteHandlerMethod => async (req) => {
  const { deporte } = entrada.query(req, PistasQuerySchema);
  return listar(ctx, deporte);
};
