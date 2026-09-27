import type { ReactNode } from 'react';
import type { Foto } from '../fotos.ts';

// Marco de las páginas informativas: título, entradilla, foto opcional y texto largo.
export function Pagina({ titulo, entradilla, foto, children }: { titulo: string; entradilla: string; foto?: Foto; children: ReactNode }) {
  return (
    <article className="mx-auto flex max-w-3xl flex-col gap-10">
      <header className="flex flex-col gap-4">
        <h1 className="font-display text-4xl font-semibold leading-[1.05] tracking-tight text-tinta sm:text-5xl">{titulo}</h1>
        <p className="max-w-[52ch] text-lg leading-relaxed text-tinta-2">{entradilla}</p>
      </header>
      {foto && <img src={foto.src} alt={foto.alt} loading="lazy" className="aspect-[21/9] w-full rounded-tarjeta object-cover shadow-tarjeta" />}
      {children}
    </article>
  );
}
