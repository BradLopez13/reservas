import type { FranjaVista } from '../../pistas/mappers/franja.mapper.ts';
import { ConfirmarReservaDialog } from '../components/ConfirmarReservaDialog.tsx';
import { useConfirmarReserva } from '../hooks/useConfirmarReserva.ts';

// Se monta al elegir una franja y se desmonta al cerrar: cada confirmación
// estrena su propia clave de idempotencia.
export function ConfirmarReservaScreen({ pistaId, franja, onCerrar }: { pistaId: string; franja: FranjaVista; onCerrar: () => void }) {
  return <ConfirmarReservaDialog {...useConfirmarReserva(pistaId, franja)} onCerrar={onCerrar} />;
}
