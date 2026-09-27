import type { FranjaVista } from '../mappers/franja.mapper.ts';

export function FranjaItem({ franja, deshabilitada, onElegir }: { franja: FranjaVista; deshabilitada: boolean; onElegir: (f: FranjaVista) => void }) {
  return (
    <button disabled={deshabilitada} onClick={() => onElegir(franja)}
      className="w-full rounded-lg border bg-white px-4 py-3 text-left hover:border-emerald-600 disabled:cursor-not-allowed disabled:bg-neutral-100 disabled:text-neutral-400">
      {franja.etiqueta} <span className="float-right text-sm">{franja.libre ? 'Libre' : 'Ocupada'}</span>
    </button>
  );
}
