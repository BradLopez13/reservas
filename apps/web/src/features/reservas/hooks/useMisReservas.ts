import { t, useT } from '../../../i18n/i18n.ts';
import { useTitulo } from '../../../shared/hooks/useTitulo.ts';
import { useCancelarReserva } from '../mutations/useReservasMutations.ts';
import { useMisReservasQuery } from '../queries/useMisReservasQuery.ts';

export const mensajeErrorCancelar = () => t('misReservas.errorCancelar');

export function useMisReservas() {
  useT();
  useTitulo(t('misReservas.pestana'));
  const reservas = useMisReservasQuery();
  const cancelar = useCancelarReserva();
  return {
    reservas: reservas.data ?? [],
    cargando: reservas.isPending,
    error: cancelar.isError ? mensajeErrorCancelar() : null,
    onCancelar: (id: string) => cancelar.mutate(id),
  };
}
