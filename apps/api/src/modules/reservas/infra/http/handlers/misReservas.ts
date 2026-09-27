import type { RouteHandlerMethod } from 'fastify';
import type { Contexto } from '../../../../../contexto.ts';
import { misReservas as consultar } from '../../../application/queries/misReservas.ts';
import { aDto } from '../dto.ts';

export const misReservas = (ctx: Contexto): RouteHandlerMethod => async (req) => (await consultar(ctx, req.sesion!.usuario.id)).map(aDto);
