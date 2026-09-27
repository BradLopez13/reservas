import { useQuery } from '@tanstack/react-query';
import { misReservas } from './api.ts';
import { aReservaVista } from './mappers.ts';

export const clavesReservas = { mias: ['reservas', 'mias'] as const };

export const useMisReservas = () =>
  useQuery({ queryKey: clavesReservas.mias, queryFn: async () => (await misReservas()).map((r) => aReservaVista(r, new Date())) });
