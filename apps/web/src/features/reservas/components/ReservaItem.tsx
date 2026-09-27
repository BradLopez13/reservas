import { useT } from '../../../i18n/i18n.ts';
import { Boton } from '../../../shared/components/Boton.tsx';
import { diaNumero, mesCorto } from '../../../shared/fechas.ts';
import { fotoDePista } from '../../../shared/fotos.ts';
import type { ReservaVista } from '../mappers/reserva.mapper.ts';

// Cada reserva es una entrada troquelada: a la izquierda el talón con el día
// sobre la foto de la pista; a la derecha, la pista, la hora y el estado. La
// cancelada se apaga y lleva un sello encima.
export function ReservaItem({ reserva, onCancelar }: { reserva: ReservaVista; onCancelar: (id: string) => void }) {
  const { t, nombreDeporte } = useT();
  const cancelada = reserva.estado === 'cancelada';
  const foto = fotoDePista(reserva.deporte, 0);
  return (
    <li className={`entrada relative grid grid-cols-[7.5rem_minmax(0,1fr)] bg-superficie transition-opacity ${cancelada ? 'opacity-60' : ''}`}>
      <div className="relative flex flex-col justify-between overflow-hidden p-4">
        <img src={foto.src} alt="" loading="lazy" className={`absolute inset-0 size-full object-cover opacity-30 saturate-[0.7] ${cancelada ? 'grayscale' : ''}`} />
        <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-pista-2/90 to-pista-2/30" />
        <span className="rotulo relative uppercase text-tinta-2">{mesCorto(reserva.inicio)}</span>
        <span className="cifra relative text-5xl leading-none text-tinta">{diaNumero(reserva.inicio)}</span>
      </div>

      <div className="flex min-w-0 flex-col justify-between gap-4 p-4 pl-6 sm:flex-row sm:items-center sm:p-5 sm:pl-7">
        <div className="flex min-w-0 flex-col gap-1.5">
          <span className="rotulo uppercase text-tinta-3">{nombreDeporte(reserva.deporte)} · {t('misReservas.entrada')}</span>
          <span className="truncate font-display text-2xl font-semibold tracking-tight text-tinta">{reserva.pistaNombre}</span>
          <span className="cifra text-sm text-tinta-2"><span className="capitalize">{reserva.etiquetaDia}</span> · {reserva.etiquetaHora}</span>
        </div>
        <div className="flex shrink-0 items-center gap-3">
          {cancelada
            ? <span className="sello rounded-[6px] px-2.5 py-1 font-mono text-[11px] font-semibold text-tinta-3">{t('misReservas.cancelada')}</span>
            : <span className="rotulo inline-flex items-center gap-1.5 rounded-[6px] bg-ok-suave px-2.5 py-1.5 text-ok"><span aria-hidden="true" className="size-1.5 rounded-full bg-current" />{t('misReservas.confirmada')}</span>}
          {reserva.cancelable && <Boton variante="peligro" tamano="sm" onClick={() => onCancelar(reserva.id)}>{t('misReservas.cancelar')}</Boton>}
        </div>
      </div>
    </li>
  );
}
