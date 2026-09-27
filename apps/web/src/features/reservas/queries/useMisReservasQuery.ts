import { useQuery } from '@tanstack/react-query';
import { misReservas } from '../api/reservas.api.ts';
import { aReservaVista } from '../mappers/reserva.mapper.ts';

export const clavesReservas = { mias: ['reservas', 'mias'] as const };

export const useMisReservasQuery = () =>
  useQuery({ queryKey: clavesReservas.mias, queryFn: async () => (await misReservas()).map((r) => aReservaVista(r, new Date())) });
