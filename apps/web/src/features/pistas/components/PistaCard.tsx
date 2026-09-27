import { ArrowUpRight } from '@phosphor-icons/react';
import { Link } from 'react-router';
import { useT } from '../../../i18n/i18n.ts';
import { fotoDePista } from '../../../shared/fotos.ts';
import { GlareHover } from '../../../shared/react-bits/GlareHover.tsx';
import type { PistaVista } from '../hooks/usePistas.ts';

// Baldosa del bento: la foto ocupa toda la celda y el texto se apoya en un
// degradado por abajo. La baldosa grande es la del hueco más cercano.
export function PistaCard({ pista, indice, grande = false }: { pista: PistaVista; indice: number; grande?: boolean }) {
  const { t, nombreDeporte } = useT();
  const foto = fotoDePista(pista.deporte, indice);
  const d = pista.disponibilidad;
  return (
    <Link to={`/pistas/${pista.id}`} className="bisel group block h-full transition-transform duration-700 ease-suave hover:-translate-y-1">
      <span className="relative block h-full overflow-hidden bg-superficie">
        <GlareHover className="absolute inset-0">
          <img
            src={foto.src}
            alt={t(foto.alt)}
            loading="lazy"
            className="size-full object-cover saturate-[0.9] transition-transform duration-1000 ease-suave group-hover:scale-[1.06]"
          />
        </GlareHover>
        <span aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-pista-2 via-pista-2/55 to-pista-2/10" />
        {d && (
          <span className={`absolute left-5 top-5 rounded-full px-3 py-1.5 text-[13px] font-semibold sm:left-6 sm:top-6 ${d.hayHueco ? 'bg-acento text-sobre-acento' : 'bg-superficie-2 text-tinta'}`}>
            {grande && d.hayHueco ? t('pista.antesLibre', { texto: d.texto }) : d.texto}
          </span>
        )}
        <span className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 p-5 sm:p-6">
          <span className="flex flex-col gap-1.5">
            <span className="text-[15px] font-medium text-tinta-2">{nombreDeporte(pista.deporte)}</span>
            <span className={`font-display font-semibold tracking-tight text-tinta ${grande ? 'text-4xl sm:text-5xl' : 'text-2xl sm:text-3xl'}`}>{pista.nombre}</span>
            <span className="text-[15px] tabular-nums text-tinta">{t('pista.horario', { apertura: pista.apertura, cierre: pista.cierre, duracion: pista.duracionMin })}</span>
          </span>
          <span className="grid size-11 shrink-0 place-items-center rounded-full bg-acento text-sobre-acento transition-transform duration-700 ease-suave group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:scale-105">
            <ArrowUpRight size={20} weight="light" aria-hidden="true" />
          </span>
        </span>
      </span>
    </Link>
  );
}
