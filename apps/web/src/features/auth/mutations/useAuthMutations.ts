import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { CambiarPassword, Login, Registro } from '@reservas/contracts';
import type { ApiError } from '../../shared/api/errores.ts';
import { cambiarPassword, cerrarSesiones, login, registro } from './api.ts';

// Cada mutación conoce sus efectos: qué caché invalidar y qué sesión refrescar.

export const useLogin = (alEntrar: () => Promise<void>) =>
  useMutation<void, ApiError, Login>({ mutationFn: login, onSuccess: alEntrar });

export const useRegistro = (alEntrar: () => Promise<void>) =>
  useMutation<unknown, ApiError, Registro>({ mutationFn: registro, onSuccess: alEntrar });

export const useCambiarPassword = () => useMutation<void, ApiError, CambiarPassword>({ mutationFn: cambiarPassword });

export function useCerrarSesiones(alSalir: () => Promise<void>) {
  const qc = useQueryClient();
  return useMutation<void, ApiError, void>({ mutationFn: cerrarSesiones, onSuccess: async () => { qc.clear(); await alSalir(); } });
}
