import type { ReactNode } from 'react';
import { AnimatedList } from '../../../shared/react-bits/AnimatedList.tsx';
import type { FranjaVista } from '../mappers/franja.mapper.ts';
import { FranjaItem } from './FranjaItem.tsx';

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
        render={(f) => <FranjaItem franja={f} deshabilitada={!f.libre || f.inicio <= ahora} onElegir={onElegir} />}
      />
      {confirmacion}
    </div>
  );
}
