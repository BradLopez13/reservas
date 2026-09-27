import { useState } from 'react';
import type { Deporte } from '@reservas/contracts';
import { usePistasQuery } from '../queries/usePistasQueries.ts';

export const FILTROS_DEPORTE: { valor: Deporte | undefined; texto: string }[] = [
  { valor: undefined, texto: 'Todas' }, { valor: 'padel', texto: 'Pádel' }, { valor: 'tenis', texto: 'Tenis' }, { valor: 'futbol', texto: 'Fútbol' },
];

export function usePistas() {
  const [deporte, setDeporte] = useState<Deporte | undefined>();
  const pistas = usePistasQuery(deporte);
  return { deporte, filtros: FILTROS_DEPORTE, pistas: pistas.data ?? [], cargando: pistas.isPending, onFiltrar: setDeporte };
}
