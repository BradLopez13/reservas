import type { Reserva } from '@reservas/contracts';
import { diaCorto, rangoHoras } from '../../shared/fechas.ts';

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
    etiquetaDia: diaCorto(inicio),
    etiquetaHora: rangoHoras(inicio, fin),
    estado: r.estado,
    cancelable: r.estado === 'confirmada' && inicio.getTime() - ahora.getTime() >= ANTELACION_MS,
  };
}
