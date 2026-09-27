import { mensajeErrorCancelar } from '../handlers.ts';
import { useCancelarReserva } from '../mutations.ts';
import { useMisReservas } from '../queries.ts';

export function useMisReservasPage() {
  const reservas = useMisReservas();
  const cancelar = useCancelarReserva();
  return {
    reservas: reservas.data ?? [],
    cargando: reservas.isPending,
    error: cancelar.isError ? mensajeErrorCancelar() : null,
    onCancelar: (id: string) => cancelar.mutate(id),
  };
}
