import { Aviso } from '../../../shared/components/Aviso.tsx';
import { Boton } from '../../../shared/components/Boton.tsx';
import { ClickSpark } from '../../../shared/react-bits/ClickSpark.tsx';
import type { EstadoConfirmacion } from '../hooks/useConfirmarReserva.ts';

export interface ConfirmarReservaDialogProps {
  etiqueta: string; estado: EstadoConfirmacion;
  onConfirmar: () => void; onVerReservas: () => void; onCerrar: () => void;
}

export function ConfirmarReservaDialog({ etiqueta, estado, onConfirmar, onVerReservas, onCerrar }: ConfirmarReservaDialogProps) {
  const terminado = estado === 'confirmada' || estado === 'ocupada';
  return (
    <div role="dialog" aria-modal="true" className="fixed inset-0 flex items-center justify-center bg-black/40 p-4">
      <div className="flex w-full max-w-sm flex-col gap-4 rounded-lg bg-white p-6">
        <h2 className="text-xl font-bold">Reservar {etiqueta}</h2>
        {estado === 'ocupada' && <Aviso tipo="error">Alguien se te ha adelantado: esa franja ya está ocupada. Elige otra.</Aviso>}
        {estado === 'error' && <Aviso tipo="error">No se ha podido reservar. Vuelve a intentarlo.</Aviso>}
        {estado === 'confirmada' && <Aviso tipo="ok">Reserva confirmada.</Aviso>}
        <div className="flex justify-end gap-2">
          <Boton variante="secundario" onClick={onCerrar}>{terminado ? 'Cerrar' : 'Cancelar'}</Boton>
          {estado === 'confirmada' && <Boton onClick={onVerReservas}>Ver mis reservas</Boton>}
          {!terminado && (
            <ClickSpark>
              <Boton disabled={estado === 'reservando'} onClick={onConfirmar}>{estado === 'reservando' ? 'Reservando…' : 'Confirmar'}</Boton>
            </ClickSpark>
          )}
        </div>
      </div>
    </div>
  );
}
