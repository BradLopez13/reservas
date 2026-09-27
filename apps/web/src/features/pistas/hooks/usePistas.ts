import { useState } from 'react';
import type { Deporte, Pista } from '@reservas/contracts';
import { plural, t, useT } from '../../../i18n/i18n.ts';
import { fechaLocal, hora, hoy } from '../../../shared/fechas.ts';
import { useTitulo } from '../../../shared/hooks/useTitulo.ts';
import { useSesion } from '../../auth/providers/SesionProvider.tsx';
import type { FranjaVista } from '../mappers/franja.mapper.ts';
import { useFranjasDeVariasQuery, usePistasQuery } from '../queries/usePistasQueries.ts';

export const filtrosDeporte = (): { valor: Deporte | undefined; texto: string }[] => [
  { valor: undefined, texto: t('deportes.todas') }, { valor: 'padel', texto: t('deportes.padel') }, { valor: 'tenis', texto: t('deportes.tenis') }, { valor: 'futbol', texto: t('deportes.futbol') },
];

// Lo que la lista dice de cada pista sin entrar en ella: la hora libre más
// cercana de hoy o, si hoy está completa, cuántas quedan mañana.
export interface Disponibilidad { texto: string; orden: string; hayHueco: boolean }

export interface PistaVista extends Pista { disponibilidad: Disponibilidad | null }

const DIA_MS = 86_400_000;

export function disponibilidadDe(hoyFranjas: FranjaVista[] | undefined, mananaFranjas: FranjaVista[] | undefined, ahora: Date): Disponibilidad | null {
  if (!hoyFranjas || !mananaFranjas) return null;
  const proximaHoy = hoyFranjas.find((f) => f.libre && f.inicio > ahora);
  if (proximaHoy) return { texto: t('pista.hoyA', { hora: hora(proximaHoy.inicio) }), orden: `0${hora(proximaHoy.inicio)}`, hayHueco: true };
  const libresManana = mananaFranjas.filter((f) => f.libre).length;
  if (libresManana > 0) return { texto: plural('pista.mananaLibres', libresManana), orden: `1${String(99 - libresManana).padStart(2, '0')}`, hayHueco: true };
  return { texto: t('pista.completa'), orden: '2', hayHueco: false };
}

// La pista con hueco más cercano va primero y ocupa la baldosa grande.
export function ordenarPorDisponibilidad(pistas: PistaVista[]) {
  return [...pistas].sort((a, b) => (a.disponibilidad?.orden ?? '3').localeCompare(b.disponibilidad?.orden ?? '3'));
}

export function usePistas() {
  const [deporte, setDeporte] = useState<Deporte | undefined>();
  const { usuario } = useSesion();
  useT();
  useTitulo(undefined);
  const pistas = usePistasQuery(deporte);
  const lista = pistas.data ?? [];
  const ahora = new Date();
  const franjasHoy = useFranjasDeVariasQuery(lista, hoy());
  const franjasManana = useFranjasDeVariasQuery(lista, fechaLocal(new Date(ahora.getTime() + DIA_MS)));
  const conDisponibilidad = lista.map((p, i) => ({ ...p, disponibilidad: disponibilidadDe(franjasHoy[i]?.data, franjasManana[i]?.data, ahora) }));
  return {
    deporte,
    filtros: filtrosDeporte(),
    pistas: ordenarPorDisponibilidad(conDisponibilidad),
    cargando: pistas.isPending,
    conSesion: usuario !== null,
    onFiltrar: setDeporte,
  };
}
