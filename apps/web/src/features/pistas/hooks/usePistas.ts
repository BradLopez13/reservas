import { useState } from 'react';
import type { Deporte, Pista } from '@reservas/contracts';
import { hora, hoy } from '../../../shared/fechas.ts';
import { useTitulo } from '../../../shared/hooks/useTitulo.ts';
import { useSesion } from '../../auth/providers/SesionProvider.tsx';
import type { FranjaVista } from '../mappers/franja.mapper.ts';
import { useFranjasDeVariasQuery, usePistasQuery } from '../queries/usePistasQueries.ts';

export const FILTROS_DEPORTE: { valor: Deporte | undefined; texto: string }[] = [
  { valor: undefined, texto: 'Todas' }, { valor: 'padel', texto: 'Pádel' }, { valor: 'tenis', texto: 'Tenis' }, { valor: 'futbol', texto: 'Fútbol' },
];

export interface PistaVista extends Pista { proximaLibre: string | null }

// La próxima hora libre de hoy, o null si no queda ninguna.
export const proximaLibre = (franjas: FranjaVista[] | undefined, ahora: Date) => {
  const f = franjas?.find((x) => x.libre && x.inicio > ahora);
  return f ? hora(f.inicio) : null;
};

// La pista con hora libre más cercana va primero y ocupa la baldosa grande;
// las que ya no tienen hueco hoy van al final.
export function ordenarPorDisponibilidad(pistas: PistaVista[]) {
  return [...pistas].sort((a, b) => (a.proximaLibre ?? '~').localeCompare(b.proximaLibre ?? '~'));
}

export function usePistas() {
  const [deporte, setDeporte] = useState<Deporte | undefined>();
  const { usuario } = useSesion();
  useTitulo(undefined);
  const pistas = usePistasQuery(deporte);
  const franjasHoy = useFranjasDeVariasQuery(pistas.data ?? [], hoy());
  const ahora = new Date();
  const conDisponibilidad = (pistas.data ?? []).map((p, i) => ({ ...p, proximaLibre: proximaLibre(franjasHoy[i]?.data, ahora) }));
  return {
    deporte,
    filtros: FILTROS_DEPORTE,
    pistas: ordenarPorDisponibilidad(conDisponibilidad),
    cargando: pistas.isPending,
    conSesion: usuario !== null,
    onFiltrar: setDeporte,
  };
}
