import type { Deporte } from '@reservas/contracts';
import type { Periodo } from '../../../shared/db/schema.ts';

export interface Reserva { id: string; pistaId: string; pistaNombre: string; deporte: Deporte; usuarioId: string; periodo: Periodo; estado: 'confirmada' | 'cancelada' }
