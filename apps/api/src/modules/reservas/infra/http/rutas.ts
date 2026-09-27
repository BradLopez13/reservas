import type { FastifyInstance } from 'fastify';
import type { Contexto } from '../../../../contexto.ts';
import { exigirSesion } from '../../../auth/infra/http/sesion.plugin.ts';
import { cancelarReserva } from './handlers/cancelarReserva.ts';
import { crearReserva } from './handlers/crearReserva.ts';
import { misReservas } from './handlers/misReservas.ts';

// Controlador: todas las rutas de reservas exigen sesión.
export function rutasReservas(app: FastifyInstance, ctx: Contexto) {
  const privada = { preHandler: exigirSesion };
  app.post('/api/reservas', privada, crearReserva(ctx));
  app.get('/api/reservas/mias', privada, misReservas(ctx));
  app.delete('/api/reservas/:id', privada, cancelarReserva(ctx));
}
