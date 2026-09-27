import type { ReactNode } from 'react';
import type { Foto } from '../../../shared/fotos.ts';

// Marco de las pantallas de entrar y crear cuenta: formulario a la izquierda,
// fotografía a la derecha en escritorio.
export function MarcoAcceso({ titulo, subtitulo, foto, children }: { titulo: string; subtitulo: string; foto: Foto; children: ReactNode }) {
  return (
    <div className="grid items-center gap-12 lg:min-h-[70vh] lg:grid-cols-2">
      <div className="mx-auto flex w-full max-w-sm flex-col gap-8">
        <header className="flex flex-col gap-2">
          <h1 className="font-display text-4xl font-semibold tracking-tight text-tinta">{titulo}</h1>
          <p className="text-tinta-2">{subtitulo}</p>
        </header>
        {children}
      </div>
      <img src={foto.src} alt={foto.alt} loading="lazy" className="hidden aspect-[4/5] w-full rounded-tarjeta object-cover shadow-tarjeta lg:block" />
    </div>
  );
}
