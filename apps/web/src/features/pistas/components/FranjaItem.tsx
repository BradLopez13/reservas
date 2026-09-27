import { ClockCounterClockwise, Lock } from '@phosphor-icons/react';
import type { FranjaVista } from '../mappers/franja.mapper.ts';

export type EstadoFranja = 'libre' | 'ocupada' | 'pasada';

const TEXTO: Record<EstadoFranja, string> = { libre: 'Libre', ocupada: 'Ocupada', pasada: 'Pasada' };

// Las franjas no disponibles se distinguen por el icono y el borde discontinuo,
// no solo por el color, y su texto mantiene el contraste.
export function FranjaItem({ franja, estado, onElegir }: { franja: FranjaVista; estado: EstadoFranja; onElegir: (f: FranjaVista) => void }) {
  const libre = estado === 'libre';
  const Icono = estado === 'ocupada' ? Lock : ClockCounterClockwise;
  return (
    <button
      type="button"
      disabled={!libre}
      onClick={() => onElegir(franja)}
      className={`group flex w-full flex-col items-start gap-0.5 rounded-[1.25rem] border px-4 py-3.5 text-left transition-[border-color,background-color,color,transform] duration-500 ease-suave ${
        libre
          ? 'border-borde bg-superficie text-tinta hover:border-acento hover:bg-acento hover:text-sobre-acento active:scale-[0.98]'
          : 'cursor-not-allowed border-dashed border-borde bg-transparent text-tinta-3'
      }`}
    >
      <span className={`font-medium tabular-nums ${libre ? '' : 'line-through decoration-tinta-3/60'}`}>{franja.etiqueta}</span>
      <span className={`inline-flex items-center gap-1 text-xs ${libre ? 'font-medium text-acento group-hover:text-sobre-acento' : ''}`}>
        {!libre && <Icono size={12} weight="bold" aria-hidden="true" />}
        {TEXTO[estado]}
      </span>
    </button>
  );
}
