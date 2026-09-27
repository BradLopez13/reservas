import type { Franja } from '@reservas/contracts';
import { rangoHoras } from '../../shared/fechas.ts';

export interface FranjaVista { inicio: Date; fin: Date; libre: boolean; etiqueta: string }

// Contrato → vista: fechas reales y una etiqueta en hora de Madrid.
export function aFranjaVista(f: Franja): FranjaVista {
  const inicio = new Date(f.inicio);
  const fin = new Date(f.fin);
  return { inicio, fin, libre: f.libre, etiqueta: rangoHoras(inicio, fin) };
}
