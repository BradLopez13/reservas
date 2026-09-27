import { useCancelarReserva } from '../mutations/useReservasMutations.ts';
import { useMisReservasQuery } from '../queries/useMisReservasQuery.ts';

export const mensajeErrorCancelar = () => 'No se ha podido cancelar: solo se puede hasta 2 horas antes.';

export function useMisReservas() {
  const reservas = useMisReservasQuery();
  const cancelar = useCancelarReserva();
  return {
    reservas: reservas.data ?? [],
    cargando: reservas.isPending,
    error: cancelar.isError ? mensajeErrorCancelar() : null,
    onCancelar: (id: string) => cancelar.mutate(id),
  };
}
