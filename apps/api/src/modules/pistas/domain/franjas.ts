import type { Periodo } from '../../../shared/db/schema.ts';
import { aUtc, fechaLocal } from '../../../shared/tiempo.ts';

export interface HorarioPista { apertura: string; cierre: string; duracionMin: number }

export function generarFranjas(pista: HorarioPista, fecha: string): Periodo[] {
  const cierre = aUtc(fecha, pista.cierre.slice(0, 5));
  const franjas: Periodo[] = [];
  let inicio = aUtc(fecha, pista.apertura.slice(0, 5));
  for (;;) {
    const fin = new Date(inicio.getTime() + pista.duracionMin * 60_000);
    if (fin > cierre) break;
    franjas.push({ inicio, fin });
    inicio = fin;
  }
  return franjas;
}

export function esFranjaValida(pista: HorarioPista, inicio: Date, ahora: Date): { ok: true; periodo: Periodo } | { ok: false; motivo: string } {
  if (inicio <= ahora) return { ok: false, motivo: 'La franja ya ha empezado' };
  const periodo = generarFranjas(pista, fechaLocal(inicio)).find((f) => f.inicio.getTime() === inicio.getTime());
  if (!periodo) return { ok: false, motivo: 'La franja no coincide con el horario de la pista' };
  return { ok: true, periodo };
}
