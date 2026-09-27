import { Boton } from '../../../shared/components/Boton.tsx';
import { fotoDePista } from '../../../shared/fotos.ts';
import type { ReservaVista } from '../mappers/reserva.mapper.ts';

export function ReservaItem({ reserva, onCancelar }: { reserva: ReservaVista; onCancelar: (id: string) => void }) {
  const cancelada = reserva.estado === 'cancelada';
  const foto = fotoDePista(reserva.deporte, 0);
  return (
    <li className={`flex items-center gap-4 rounded-tarjeta border border-borde bg-superficie p-3 transition-opacity sm:p-4 ${cancelada ? 'opacity-60' : ''}`}>
      <img src={foto.src} alt="" loading="lazy" className={`size-16 shrink-0 rounded-ui object-cover ${cancelada ? 'grayscale' : ''}`} />
      <div className="flex min-w-0 flex-1 flex-col gap-0.5">
        <span className="truncate font-display text-lg font-semibold tracking-tight text-tinta">{reserva.pistaNombre}</span>
        <span className="text-sm capitalize text-tinta-2">{reserva.etiquetaDia} · <span className="tabular-nums">{reserva.etiquetaHora}</span></span>
      </div>
      {cancelada
        ? <span className="rounded-full bg-superficie-2 px-2.5 py-1 text-xs font-medium text-tinta-2">cancelada</span>
        : <span className="rounded-full bg-ok-suave px-2.5 py-1 text-xs font-medium text-ok">confirmada</span>}
      {reserva.cancelable && <Boton variante="peligro" tamano="sm" onClick={() => onCancelar(reserva.id)}>Cancelar</Boton>}
    </li>
  );
}
