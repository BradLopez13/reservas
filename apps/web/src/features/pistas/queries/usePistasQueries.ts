import { useQuery } from '@tanstack/react-query';
import type { Deporte } from '@reservas/contracts';
import { franjasDe, listarPistas } from '../api/pistas.api.ts';
import { aFranjaVista } from '../mappers/franja.mapper.ts';

// Capa de datos: las claves de caché viven aquí, y quien invalide franjas lo hace
// con `clavesPistas.franjas(id)`. Las pantallas no vuelven a pedir lo que ya está fresco.
export const clavesPistas = {
  todas: ['pistas'] as const,
  lista: (deporte?: Deporte) => ['pistas', 'lista', deporte ?? 'todas'] as const,
  franjas: (pistaId: string) => ['pistas', 'franjas', pistaId] as const,
  franjasDia: (pistaId: string, fecha: string) => ['pistas', 'franjas', pistaId, fecha] as const,
};

export const usePistasQuery = (deporte?: Deporte) =>
  useQuery({ queryKey: clavesPistas.lista(deporte), queryFn: () => listarPistas(deporte) });

export const useFranjasQuery = (pistaId: string, fecha: string) =>
  useQuery({ queryKey: clavesPistas.franjasDia(pistaId, fecha), queryFn: async () => (await franjasDe(pistaId, fecha)).map(aFranjaVista), enabled: pistaId !== '' });
