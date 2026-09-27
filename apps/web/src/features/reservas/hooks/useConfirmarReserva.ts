import { useNavigate } from 'react-router';
import type { ApiError } from '../../../shared/api/errores.ts';
import { diaCorto } from '../../../shared/fechas.ts';
import type { FranjaVista } from '../../pistas/mappers/franja.mapper.ts';
import { useReservar } from '../mutations/useReservasMutations.ts';

// Estado que la vista necesita mostrar, derivado de la mutación. Puro: se prueba sin React.
export type EstadoConfirmacion = 'pendiente' | 'reservando' | 'ocupada' | 'error' | 'confirmada';

export function estadoConfirmacion(m: { isPending: boolean; isSuccess: boolean; error: ApiError | null }): EstadoConfirmacion {
  if (m.isSuccess) return 'confirmada';
  if (m.isPending) return 'reservando';
  if (m.error?.code === 'PISTA_OCUPADA') return 'ocupada';
  if (m.error) return 'error';
  return 'pendiente';
}

export function useConfirmarReserva(pistaId: string, franja: FranjaVista) {
  const { mutation } = useReservar();
  const navigate = useNavigate();
  return {
    etiqueta: franja.etiqueta,
    dia: diaCorto(franja.inicio),
    estado: estadoConfirmacion(mutation),
    onConfirmar: () => mutation.mutate({ pistaId, inicio: franja.inicio.toISOString() }),
    onVerReservas: () => navigate('/mis-reservas'),
  };
}
