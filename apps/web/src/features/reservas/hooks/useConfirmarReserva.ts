import { useNavigate } from 'react-router';
import type { FranjaVista } from '../../pistas/mappers.ts';
import { estadoConfirmacion } from '../handlers.ts';
import { useReservar } from '../mutations.ts';

export function useConfirmarReserva(pistaId: string, franja: FranjaVista) {
  const { mutation } = useReservar();
  const navigate = useNavigate();
  return {
    etiqueta: franja.etiqueta,
    estado: estadoConfirmacion(mutation),
    onConfirmar: () => mutation.mutate({ pistaId, inicio: franja.inicio.toISOString() }),
    onVerReservas: () => navigate('/mis-reservas'),
  };
}
