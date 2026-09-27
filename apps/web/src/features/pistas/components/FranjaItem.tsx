import { ClockCounterClockwise, Lock } from '@phosphor-icons/react';
import { useT } from '../../../i18n/i18n.ts';
import type { FranjaVista } from '../mappers/franja.mapper.ts';

export type EstadoFranja = 'libre' | 'ocupada' | 'pasada';

// Una celda del tablón horario. Las franjas no disponibles se distinguen por
// el tramado, el icono y el tachado, no solo por el color, y su texto
// mantiene el contraste. La libre se enciende en lima al pasar por encima.
export function FranjaItem({ franja, estado, onElegir }: { franja: FranjaVista; estado: EstadoFranja; onElegir: (f: FranjaVista) => void }) {
  const { t } = useT();
  const libre = estado === 'libre';
  const Icono = estado === 'ocupada' ? Lock : ClockCounterClockwise;
  return (
    <button
      type="button"
      disabled={!libre}
      onClick={() => onElegir(franja)}
      className={`group flex h-full min-h-[5.5rem] w-full flex-col items-start justify-between gap-2 px-4 py-3.5 text-left transition-[background-color,color] duration-500 ease-suave focus-visible:relative focus-visible:z-10 focus-visible:-outline-offset-2 ${
        libre ? 'bg-fondo text-tinta hover:bg-acento hover:text-sobre-acento' : 'tramado cursor-not-allowed bg-pista text-tinta-3'
      }`}
    >
      <span className={`cifra text-lg leading-none ${libre ? '' : 'line-through decoration-tinta-3/60'}`}>{franja.etiqueta}</span>
      <span className={`rotulo inline-flex items-center gap-1.5 ${libre ? 'text-acento group-hover:text-sobre-acento' : ''}`}>
        {libre ? <span aria-hidden="true" className="size-1.5 rounded-full bg-current" /> : <Icono size={12} weight="bold" aria-hidden="true" />}
        {t(`pista.${estado}`)}
      </span>
    </button>
  );
}
