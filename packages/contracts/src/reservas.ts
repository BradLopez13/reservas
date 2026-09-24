import { z } from 'zod';
import { DeporteSchema } from './pistas.ts';

export const FranjasQuerySchema = z.object({ fecha: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'YYYY-MM-DD') });
export const FranjaSchema = z.object({ inicio: z.iso.datetime(), fin: z.iso.datetime(), libre: z.boolean() });
export const CrearReservaBodySchema = z.object({ pistaId: z.uuid(), inicio: z.iso.datetime() });
export const EstadoReservaSchema = z.enum(['confirmada', 'cancelada']);
export const ReservaSchema = z.object({
  id: z.uuid(),
  pistaId: z.uuid(),
  pistaNombre: z.string(),
  deporte: DeporteSchema,
  inicio: z.iso.datetime(),
  fin: z.iso.datetime(),
  estado: EstadoReservaSchema,
});

export type Franja = z.infer<typeof FranjaSchema>;
export type CrearReserva = z.infer<typeof CrearReservaBodySchema>;
export type Reserva = z.infer<typeof ReservaSchema>;
