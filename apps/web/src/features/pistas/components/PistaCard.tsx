import { Link } from 'react-router';
import type { Pista } from '@reservas/contracts';

export function PistaCard({ pista }: { pista: Pista }) {
  return (
    <Link to={`/pistas/${pista.id}`} className="block rounded-lg border bg-white p-4 hover:border-emerald-600">
      <span className="text-xs uppercase text-neutral-500">{pista.deporte}</span>
      <span className="block text-lg font-semibold">{pista.nombre}</span>
      <span className="text-sm text-neutral-600">{pista.apertura}–{pista.cierre} · franjas de {pista.duracionMin} min</span>
    </Link>
  );
}
