import type { ReactNode } from 'react';
import { AnimatedList } from '../../../shared/react-bits/AnimatedList.tsx';
import type { FranjaVista } from '../mappers.ts';

export interface FranjasDiaViewProps {
  fecha: string; minFecha: string; franjas: FranjaVista[]; cargando: boolean;
  onCambiarFecha: (fecha: string) => void; onElegir: (f: FranjaVista) => void;
  confirmacion?: ReactNode;
}

export function FranjasDiaView({ fecha, minFecha, franjas, cargando, onCambiarFecha, onElegir, confirmacion }: FranjasDiaViewProps) {
  const ahora = new Date();
  return (
    <div className="flex flex-col gap-4">
      <label className="flex items-center gap-3 text-sm">
        Día<input type="date" value={fecha} min={minFecha} onChange={(e) => onCambiarFecha(e.target.value)} className="rounded border px-2 py-1" />
      </label>
      {cargando && <p className="text-neutral-500">Cargando franjas…</p>}
      <AnimatedList
        items={franjas}
        keyOf={(f) => f.inicio.toISOString()}
        render={(f) => (
          <button disabled={!f.libre || f.inicio <= ahora} onClick={() => onElegir(f)}
            className="w-full rounded-lg border bg-white px-4 py-3 text-left hover:border-emerald-600 disabled:cursor-not-allowed disabled:bg-neutral-100 disabled:text-neutral-400">
            {f.etiqueta} <span className="float-right text-sm">{f.libre ? 'Libre' : 'Ocupada'}</span>
          </button>
        )}
      />
      {confirmacion}
    </div>
  );
}
