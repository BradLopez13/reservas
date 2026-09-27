import type { Deporte, Pista } from '@reservas/contracts';
import { BlurText } from '../../../shared/react-bits/BlurText.tsx';
import { FiltroDeporte } from './FiltroDeporte.tsx';
import { PistaCard } from './PistaCard.tsx';

export interface PistasViewProps {
  deporte: Deporte | undefined;
  filtros: { valor: Deporte | undefined; texto: string }[];
  pistas: Pista[];
  cargando: boolean;
  onFiltrar: (d: Deporte | undefined) => void;
}

export function PistasView({ deporte, filtros, pistas, cargando, onFiltrar }: PistasViewProps) {
  return (
    <div className="flex flex-col gap-6">
      <BlurText text="Reserva tu pista" className="text-3xl font-bold" />
      <FiltroDeporte valor={deporte} opciones={filtros} onCambiar={onFiltrar} />
      {cargando && <p className="text-neutral-500">Cargando pistas…</p>}
      <ul className="grid gap-3 sm:grid-cols-2">
        {pistas.map((p) => <li key={p.id}><PistaCard pista={p} /></li>)}
      </ul>
    </div>
  );
}
