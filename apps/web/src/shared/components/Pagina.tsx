import type { ReactNode } from 'react';
import { useT } from '../../i18n/i18n.ts';
import type { Foto } from '../fotos.ts';
import { LineasPista } from './LineasPista.tsx';

// Marco de las páginas informativas: un rótulo, el título a la izquierda con
// la entradilla enfrente, la foto opcional con la esquina grande y el texto
// largo en el ancho de lectura.
export function Pagina({ rotulo, titulo, entradilla, foto, children }: { rotulo: string; titulo: string; entradilla: string; foto?: Foto; children: ReactNode }) {
  const { t } = useT();
  return (
    <article className="mx-auto flex max-w-5xl flex-col gap-12">
      <header className="grid gap-6 border-b border-borde pb-10 md:grid-cols-12 md:items-end">
        <div className="flex flex-col gap-4 md:col-span-7">
          <p className="rotulo uppercase text-tinta-3">{rotulo}</p>
          <h1 className="font-display text-5xl font-semibold leading-[0.95] tracking-[-0.035em] text-tinta sm:text-6xl lg:text-7xl">{titulo}</h1>
        </div>
        <p className="max-w-[40ch] text-lg leading-relaxed text-tinta-2 md:col-span-5 md:justify-self-end">{entradilla}</p>
      </header>
      {foto && (
        <div className="relative overflow-hidden rounded-[var(--radius-ui)_var(--radius-esquina)_var(--radius-ui)_var(--radius-esquina)] bg-pista">
          <img src={foto.src} alt={t(foto.alt)} loading="lazy" className="aspect-[21/9] w-full object-cover saturate-[0.85]" />
          <LineasPista className="opacity-[0.14]" />
        </div>
      )}
      <div className="mx-auto flex w-full max-w-3xl flex-col gap-12">{children}</div>
    </article>
  );
}
