import type { RouteHandlerMethod } from 'fastify';
import { FranjasQuerySchema } from '@reservas/contracts';
import type { Contexto } from '../../../../../contexto.ts';
import { entrada, idDeRuta } from '../../../../../shared/http/validar.ts';
import { consultarFranjas } from '../../../application/queries/consultarFranjas.ts';

export const franjasDeUnDia = (ctx: Contexto): RouteHandlerMethod => async (req) => {
  const { fecha } = entrada.query(req, FranjasQuerySchema);
  return consultarFranjas(ctx, idDeRuta(req), fecha);
};
