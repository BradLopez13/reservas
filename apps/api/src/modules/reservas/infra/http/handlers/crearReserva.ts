import type { RouteHandlerMethod } from 'fastify';
import { CrearReservaBodySchema } from '@reservas/contracts';
import type { Contexto } from '../../../../../contexto.ts';
import { entrada } from '../../../../../shared/http/validar.ts';
import { reservarPista } from '../../../application/commands/reservarPista.ts';
import { aDto } from '../dto.ts';
import { conIdempotencia } from '../idempotencia.ts';

export const crearReserva = (ctx: Contexto): RouteHandlerMethod => conIdempotencia(ctx, async (req) => {
  const body = entrada.body(req, CrearReservaBodySchema);
  const reserva = await reservarPista(ctx, { usuarioId: req.sesion!.usuario.id, pistaId: body.pistaId, inicio: new Date(body.inicio) });
  return { status: 201, body: aDto(reserva) };
});
