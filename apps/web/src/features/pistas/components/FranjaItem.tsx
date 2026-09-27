import type { FranjaVista } from '../mappers/franja.mapper.ts';

export type EstadoFranja = 'libre' | 'ocupada' | 'pasada';

const TEXTO: Record<EstadoFranja, string> = { libre: 'Libre', ocupada: 'Ocupada', pasada: 'Pasada' };

export function FranjaItem({ franja, estado, onElegir }: { franja: FranjaVista; estado: EstadoFranja; onElegir: (f: FranjaVista) => void }) {
  const libre = estado === 'libre';
  return (
    <button
      type="button"
      disabled={!libre}
      onClick={() => onElegir(franja)}
      className={`group flex w-full flex-col items-start gap-0.5 rounded-[1.25rem] border px-4 py-3.5 text-left transition-[border-color,background-color,color,transform] duration-500 ease-suave ${
        libre
          ? 'border-borde bg-superficie hover:border-acento hover:bg-acento hover:text-sobre-acento active:scale-[0.98]'
          : 'cursor-not-allowed border-transparent bg-superficie/40 text-tinta-3'
      }`}
    >
      <span className="font-medium tabular-nums">{franja.etiqueta}</span>
      <span className={`text-xs ${libre ? 'font-medium text-acento group-hover:text-sobre-acento' : ''}`}>{TEXTO[estado]}</span>
    </button>
  );
}
