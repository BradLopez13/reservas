import { ReservaSchema, type CrearReserva } from '@reservas/contracts';
import { z } from 'zod';
import { cliente } from '../../shared/api/cliente.ts';

export const crearReserva = async (d: CrearReserva, idempotencyKey: string) =>
  ReservaSchema.parse((await cliente.post('/reservas', d, { idempotencyKey })).data);

export const misReservas = async () => z.array(ReservaSchema).parse((await cliente.get('/reservas/mias')).data);

export const cancelarReserva = async (id: string) => { await cliente.delete(`/reservas/${id}`); };
