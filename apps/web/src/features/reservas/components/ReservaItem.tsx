import { Boton } from '../../../shared/components/Boton.tsx';
import type { ReservaVista } from '../mappers/reserva.mapper.ts';

export function ReservaItem({ reserva, onCancelar }: { reserva: ReservaVista; onCancelar: (id: string) => void }) {
  const cancelada = reserva.estado === 'cancelada';
  return (
    <li className={`flex items-center gap-4 rounded-lg border bg-white px-4 py-3 ${cancelada ? 'opacity-50' : ''}`}>
      <div className="flex-1">
        <span className="font-semibold">{reserva.pistaNombre}</span> · {reserva.etiquetaDia} · {reserva.etiquetaHora}
        {cancelada && <span className="ml-2 text-xs uppercase">cancelada</span>}
      </div>
      {reserva.cancelable && <Boton variante="peligro" onClick={() => onCancelar(reserva.id)}>Cancelar</Boton>}
    </li>
  );
}
