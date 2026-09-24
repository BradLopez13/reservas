import { useQuery } from '@tanstack/react-query';
import type { Deporte } from '@reservas/contracts';
import { franjasDe, listarPistas } from './api.ts';
import { aFranjaVista } from './mappers.ts';

// Las claves de caché viven aquí: quien invalide franjas lo hace con `clavesPistas.franjas(id)`.
export const clavesPistas = {
  todas: ['pistas'] as const,
  lista: (deporte?: Deporte) => ['pistas', 'lista', deporte ?? 'todas'] as const,
  franjas: (pistaId: string) => ['pistas', 'franjas', pistaId] as const,
  franjasDia: (pistaId: string, fecha: string) => ['pistas', 'franjas', pistaId, fecha] as const,
};

export const usePistas = (deporte?: Deporte) =>
  useQuery({ queryKey: clavesPistas.lista(deporte), queryFn: () => listarPistas(deporte) });

export const useFranjas = (pistaId: string, fecha: string) =>
  useQuery({ queryKey: clavesPistas.franjasDia(pistaId, fecha), queryFn: async () => (await franjasDe(pistaId, fecha)).map(aFranjaVista), enabled: pistaId !== '' });
