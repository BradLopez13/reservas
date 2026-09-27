import { ConfirmarReservaScreen } from '../../reservas/screens/ConfirmarReservaScreen.tsx';
import { FranjasDiaView } from '../components/FranjasDiaView.tsx';
import { useFranjasDia } from '../hooks/useFranjasDia.ts';

export function FranjasDiaScreen() {
  const { pistaId, seleccion, onCerrarConfirmacion, ...vista } = useFranjasDia();
  return (
    <FranjasDiaView
      {...vista}
      confirmacion={seleccion && <ConfirmarReservaScreen pistaId={pistaId} franja={seleccion} onCerrar={onCerrarConfirmacion} />}
    />
  );
}
