import type { FranjaVista } from '../pistas/mappers.ts';
import { useConfirmarReserva } from './hooks/useConfirmarReserva.ts';
import { ConfirmarReservaView } from './views/ConfirmarReservaView.tsx';

// Se monta al elegir una franja y se desmonta al cerrar: cada confirmación
// estrena su propia clave de idempotencia.
export function ConfirmarReserva({ pistaId, franja, onCerrar }: { pistaId: string; franja: FranjaVista; onCerrar: () => void }) {
  return <ConfirmarReservaView {...useConfirmarReserva(pistaId, franja)} onCerrar={onCerrar} />;
}
