import { ArrowUpRight } from '@phosphor-icons/react';
import { Link } from 'react-router';
import type { Pista } from '@reservas/contracts';
import { fotoDePista, NOMBRE_DEPORTE } from '../../../shared/fotos.ts';
import { GlareHover } from '../../../shared/react-bits/GlareHover.tsx';

// Baldosa del bento: la foto ocupa toda la celda y el texto se apoya en un
// degradado por abajo. Bandeja con bisel alrededor.
export function PistaCard({ pista, indice, grande = false }: { pista: Pista; indice: number; grande?: boolean }) {
  const foto = fotoDePista(pista.deporte, indice);
  return (
    <Link to={`/pistas/${pista.id}`} className="bisel group block h-full transition-transform duration-700 ease-suave hover:-translate-y-1">
      <span className="relative block h-full overflow-hidden bg-superficie">
        <GlareHover className="absolute inset-0">
          <img
            src={foto.src}
            alt={foto.alt}
            loading="lazy"
            className="size-full object-cover saturate-[0.9] transition-transform duration-1000 ease-suave group-hover:scale-[1.06]"
          />
        </GlareHover>
        <span aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-pista-2/95 via-pista-2/35 to-transparent" />
        <span className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 p-5 sm:p-6">
          <span className="flex flex-col gap-1">
            <span className="text-sm text-tinta-2">{NOMBRE_DEPORTE[pista.deporte]}</span>
            <span className={`font-display font-semibold tracking-tight text-tinta ${grande ? 'text-4xl sm:text-5xl' : 'text-2xl sm:text-3xl'}`}>{pista.nombre}</span>
            <span className="text-sm text-tinta-2">
              <span className="tabular-nums">{pista.apertura} a {pista.cierre}</span>, franjas de {pista.duracionMin} min
            </span>
          </span>
          <span className="grid size-11 shrink-0 place-items-center rounded-full bg-acento text-sobre-acento transition-transform duration-700 ease-suave group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:scale-105">
            <ArrowUpRight size={20} weight="light" aria-hidden="true" />
          </span>
        </span>
      </span>
    </Link>
  );
}
