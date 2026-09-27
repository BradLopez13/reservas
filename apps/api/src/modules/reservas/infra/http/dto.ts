import type { Reserva as ReservaDto } from '@reservas/contracts';
import type { Reserva } from '../../domain/reserva.ts';

// Entidad → contrato. Es la única forma en que una reserva sale por HTTP.
export const aDto = (r: Reserva): ReservaDto => ({
  id: r.id, pistaId: r.pistaId, pistaNombre: r.pistaNombre, deporte: r.deporte,
  inicio: r.periodo.inicio.toISOString(), fin: r.periodo.fin.toISOString(), estado: r.estado,
});
