import { ConfirmarReserva } from '../reservas/ConfirmarReserva.tsx';
import { useFranjasDia } from './hooks/useFranjasDia.ts';
import { FranjasDiaView } from './views/FranjasDiaView.tsx';

export function FranjasDia() {
  const { pistaId, seleccion, onCerrarConfirmacion, ...vista } = useFranjasDia();
  return (
    <FranjasDiaView
      {...vista}
      confirmacion={seleccion && <ConfirmarReserva pistaId={pistaId} franja={seleccion} onCerrar={onCerrarConfirmacion} />}
    />
  );
}
