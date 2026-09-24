import type { Franja } from '@reservas/contracts';

export interface FranjaVista { inicio: Date; fin: Date; libre: boolean; etiqueta: string }

export const hora = (d: Date) => d.toLocaleTimeString('es-ES', { timeZone: 'Europe/Madrid', hour: '2-digit', minute: '2-digit', hour12: false });

// Contrato → vista: fechas reales y una etiqueta en hora de Madrid.
export function aFranjaVista(f: Franja): FranjaVista {
  const inicio = new Date(f.inicio);
  const fin = new Date(f.fin);
  return { inicio, fin, libre: f.libre, etiqueta: `${hora(inicio)}–${hora(fin)}` };
}
