import type { Reserva } from '@reservas/contracts';
import { hora } from './franjas.ts';

export interface ReservaVista {
  id: string; pistaNombre: string; deporte: Reserva['deporte']; inicio: Date; fin: Date;
  etiquetaDia: string; etiquetaHora: string; estado: Reserva['estado']; cancelable: boolean;
}

const ANTELACION_MS = 2 * 60 * 60 * 1000;

export function aReservaVista(r: Reserva, ahora: Date): ReservaVista {
  const inicio = new Date(r.inicio);
  const fin = new Date(r.fin);
  return {
    id: r.id, pistaNombre: r.pistaNombre, deporte: r.deporte, inicio, fin,
    etiquetaDia: inicio.toLocaleDateString('es-ES', { timeZone: 'Europe/Madrid', weekday: 'short', day: 'numeric', month: 'short' }),
    etiquetaHora: `${hora(inicio)}–${hora(fin)}`,
    estado: r.estado,
    cancelable: r.estado === 'confirmada' && inicio.getTime() - ahora.getTime() >= ANTELACION_MS,
  };
}
