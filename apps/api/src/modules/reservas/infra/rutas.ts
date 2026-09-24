import type { FastifyInstance } from 'fastify';
import { CrearReservaBodySchema, type Reserva as ReservaDto } from '@reservas/contracts';
import type { Contexto } from '../../../contexto.ts';
import { entrada, idDeRuta } from '../../../shared/http/validar.ts';
import { exigirSesion } from '../../auth/infra/sesion.plugin.ts';
import { cancelarReserva } from '../application/cancelarReserva.ts';
import { misReservas } from '../application/misReservas.ts';
import { reservarPista } from '../application/reservarPista.ts';
import type { Reserva } from '../domain/reserva.ts';
import { conIdempotencia } from './idempotencia.ts';

// Entidad → contrato.
export const aDto = (r: Reserva): ReservaDto => ({
  id: r.id, pistaId: r.pistaId, pistaNombre: r.pistaNombre, deporte: r.deporte,
  inicio: r.periodo.inicio.toISOString(), fin: r.periodo.fin.toISOString(), estado: r.estado,
});

export function rutasReservas(app: FastifyInstance, ctx: Contexto) {
  app.post('/api/reservas', { preHandler: exigirSesion }, conIdempotencia(ctx, async (req) => {
    const body = entrada.body(req, CrearReservaBodySchema);
    const reserva = await reservarPista(ctx, { usuarioId: req.sesion!.usuario.id, pistaId: body.pistaId, inicio: new Date(body.inicio) });
    return { status: 201, body: aDto(reserva) };
  }));

  app.get('/api/reservas/mias', { preHandler: exigirSesion }, async (req) => (await misReservas(ctx, req.sesion!.usuario.id)).map(aDto));

  app.delete('/api/reservas/:id', { preHandler: exigirSesion }, async (req, reply) => {
    await cancelarReserva(ctx, { usuarioId: req.sesion!.usuario.id, reservaId: idDeRuta(req) });
    return reply.status(204).send();
  });
}
