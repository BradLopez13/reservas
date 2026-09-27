import { Link } from 'react-router';
import type { Deporte, Pista } from '@reservas/contracts';
import { BlurText } from '../../../shared/react-bits/BlurText.tsx';

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
      <div className="flex gap-2">
        {filtros.map((f) => (
          <button key={f.texto} onClick={() => onFiltrar(f.valor)} className={`rounded-full border px-3 py-1 text-sm ${deporte === f.valor ? 'bg-neutral-900 text-white' : 'bg-white'}`}>
            {f.texto}
          </button>
        ))}
      </div>
      {cargando && <p className="text-neutral-500">Cargando pistas…</p>}
      <ul className="grid gap-3 sm:grid-cols-2">
        {pistas.map((p) => (
          <li key={p.id}>
            <Link to={`/pistas/${p.id}`} className="block rounded-lg border bg-white p-4 hover:border-emerald-600">
              <span className="text-xs uppercase text-neutral-500">{p.deporte}</span>
              <span className="block text-lg font-semibold">{p.nombre}</span>
              <span className="text-sm text-neutral-600">{p.apertura}–{p.cierre} · franjas de {p.duracionMin} min</span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
