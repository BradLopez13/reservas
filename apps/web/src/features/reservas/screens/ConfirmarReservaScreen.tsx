import type { FranjaVista } from '../../pistas/mappers/franja.mapper.ts';
import { ConfirmarReservaDialog } from '../components/ConfirmarReservaDialog.tsx';
import { useConfirmarReserva } from '../hooks/useConfirmarReserva.ts';

interface Props { pistaId: string; pistaNombre: string | undefined; franja: FranjaVista; onCerrar: () => void }

// Se monta al elegir una franja y se desmonta al cerrar: cada confirmación
// estrena su propia clave de idempotencia.
export function ConfirmarReservaScreen({ pistaId, pistaNombre, franja, onCerrar }: Props) {
  return <ConfirmarReservaDialog {...useConfirmarReserva(pistaId, franja)} pistaNombre={pistaNombre} onCerrar={onCerrar} />;
}
