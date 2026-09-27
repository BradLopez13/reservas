import { useState } from 'react';
import type { Deporte } from '@reservas/contracts';
import { usePistas } from '../queries.ts';

export const FILTROS_DEPORTE: { valor: Deporte | undefined; texto: string }[] = [
  { valor: undefined, texto: 'Todas' }, { valor: 'padel', texto: 'Pádel' }, { valor: 'tenis', texto: 'Tenis' }, { valor: 'futbol', texto: 'Fútbol' },
];

export function usePistasPage() {
  const [deporte, setDeporte] = useState<Deporte | undefined>();
  const pistas = usePistas(deporte);
  return { deporte, filtros: FILTROS_DEPORTE, pistas: pistas.data ?? [], cargando: pistas.isPending, onFiltrar: setDeporte };
}
