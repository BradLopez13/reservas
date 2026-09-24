import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useCallback, useState } from 'react';
import type { CrearReserva, Reserva } from '@reservas/contracts';
import type { ApiError } from '../../shared/api/errores.ts';
import { clavesPistas } from '../pistas/queries.ts';
import { cancelarReserva, crearReserva } from './api.ts';
import { clavesReservas } from './queries.ts';

// La clave de idempotencia vive con el intento: un reintento la reutiliza (y la
// API devuelve la misma reserva), y una nueva confirmación la renueva.
export function useReservar() {
  const [clave, setClave] = useState(() => crypto.randomUUID());
  const qc = useQueryClient();
  const nuevaClave = useCallback(() => setClave(crypto.randomUUID()), []);
  const mutation = useMutation<Reserva, ApiError, CrearReserva>({
    mutationFn: (d) => crearReserva(d, clave),
    onSettled: (_r, _e, d) => {
      void qc.invalidateQueries({ queryKey: clavesPistas.franjas(d.pistaId) });
      void qc.invalidateQueries({ queryKey: clavesReservas.mias });
    },
  });
  return { clave, nuevaClave, mutation };
}

export function useCancelarReserva() {
  const qc = useQueryClient();
  return useMutation<void, ApiError, string>({
    mutationFn: cancelarReserva,
    onSettled: () => { void qc.invalidateQueries({ queryKey: clavesReservas.mias }); void qc.invalidateQueries({ queryKey: clavesPistas.todas }); },
  });
}
