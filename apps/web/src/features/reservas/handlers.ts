import type { ApiError } from '../../shared/api/errores.ts';

// Estado que la vista de confirmación necesita mostrar, derivado de la mutación.
export type EstadoConfirmacion = 'pendiente' | 'reservando' | 'ocupada' | 'error' | 'confirmada';

export function estadoConfirmacion(m: { isPending: boolean; isSuccess: boolean; error: ApiError | null }): EstadoConfirmacion {
  if (m.isSuccess) return 'confirmada';
  if (m.isPending) return 'reservando';
  if (m.error?.code === 'PISTA_OCUPADA') return 'ocupada';
  if (m.error) return 'error';
  return 'pendiente';
}

export const mensajeErrorCancelar = () => 'No se ha podido cancelar: solo se puede hasta 2 horas antes.';
