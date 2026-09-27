import { ArrowUpRight } from '@phosphor-icons/react';
import { Link } from 'react-router';
import { useT } from '../../../i18n/i18n.ts';
import { fotoDePista } from '../../../shared/fotos.ts';
import { GlareHover } from '../../../shared/react-bits/GlareHover.tsx';
import type { PistaVista } from '../hooks/usePistas.ts';

// Baldosa del bento: la foto ocupa toda la celda y el texto se apoya en un
// degradado por abajo. Arriba, el número de orden y la disponibilidad como
// rótulos de marcador; la baldosa grande es la del hueco más cercano y lleva
// la esquina grande de la marca.
export function PistaCard({ pista, indice, grande = false }: { pista: PistaVista; indice: number; grande?: boolean }) {
  const { t, nombreDeporte } = useT();
  const foto = fotoDePista(pista.deporte, indice);
  const d = pista.disponibilidad;
  return (
    <Link
      to={`/pistas/${pista.id}`}
      className={`group relative block h-full overflow-hidden bg-superficie shadow-[inset_0_0_0_1px_var(--color-borde)] transition-transform duration-700 ease-suave hover:-translate-y-1 ${
        grande ? 'rounded-[var(--radius-esquina)_var(--radius-tarjeta)_var(--radius-tarjeta)_var(--radius-tarjeta)]' : 'rounded-tarjeta'
      }`}
    >
      <GlareHover className="absolute inset-0">
        <img
          src={foto.src}
          alt={t(foto.alt)}
          loading="lazy"
          className="size-full object-cover saturate-[0.9] transition-transform duration-1000 ease-suave group-hover:scale-[1.06]"
        />
      </GlareHover>
      <span aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-pista-2 via-pista-2/55 to-pista-2/15" />

      <span className={`absolute inset-x-0 top-0 flex items-start justify-between gap-3 p-5 ${grande ? 'pl-8 pt-7 sm:pl-10' : 'sm:p-6'}`}>
        <span aria-hidden="true" className="rotulo uppercase text-tinta-2">{String(indice + 1).padStart(2, '0')}</span>
        {d && (
          <span className={`rotulo rounded-[6px] px-2.5 py-1.5 ${d.hayHueco ? 'bg-acento text-sobre-acento' : 'bg-pista-2/80 text-tinta backdrop-blur-md'}`}>
            {grande && d.hayHueco ? t('pista.antesLibre', { texto: d.texto }) : d.texto}
          </span>
        )}
      </span>

      <span className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 p-5 sm:p-6">
        <span className="flex min-w-0 flex-col gap-1.5">
          <span className="rotulo uppercase text-tinta-2">{nombreDeporte(pista.deporte)}</span>
          <span className={`font-display font-semibold tracking-tight text-tinta ${grande ? 'text-4xl sm:text-6xl' : 'text-2xl sm:text-3xl'}`}>{pista.nombre}</span>
          <span className="cifra text-[13px] text-tinta-2 sm:text-sm">{t('pista.horario', { apertura: pista.apertura, cierre: pista.cierre, duracion: pista.duracionMin })}</span>
        </span>
        <span className="grid size-11 shrink-0 place-items-center rounded-ui bg-tinta text-fondo transition-[transform,background-color,color] duration-700 ease-suave group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:bg-acento">
          <ArrowUpRight size={20} weight="bold" aria-hidden="true" />
        </span>
      </span>
    </Link>
  );
}
