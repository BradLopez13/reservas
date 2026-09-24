import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { Link } from 'react-router';
import type { Deporte } from '@reservas/contracts';
import { listarPistas } from './api.ts';
import { BlurText } from '../../shared/react-bits/BlurText.tsx';

const DEPORTES: { valor: Deporte | undefined; texto: string }[] = [
  { valor: undefined, texto: 'Todas' }, { valor: 'padel', texto: 'Pádel' }, { valor: 'tenis', texto: 'Tenis' }, { valor: 'futbol', texto: 'Fútbol' },
];

export function PistasPage() {
  const [deporte, setDeporte] = useState<Deporte | undefined>();
  const pistas = useQuery({ queryKey: ['pistas', deporte], queryFn: () => listarPistas(deporte) });
  return (
    <div className="flex flex-col gap-6">
      <BlurText text="Reserva tu pista" className="text-3xl font-bold" />
      <div className="flex gap-2">
        {DEPORTES.map((d) => (
          <button key={d.texto} onClick={() => setDeporte(d.valor)} className={`rounded-full border px-3 py-1 text-sm ${deporte === d.valor ? 'bg-neutral-900 text-white' : 'bg-white'}`}>
            {d.texto}
          </button>
        ))}
      </div>
      {pistas.isPending && <p className="text-neutral-500">Cargando pistas…</p>}
      <ul className="grid gap-3 sm:grid-cols-2">
        {pistas.data?.map((p) => (
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
