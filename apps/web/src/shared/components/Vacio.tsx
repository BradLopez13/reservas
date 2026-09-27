import type { Icon } from '@phosphor-icons/react';
import type { ReactNode } from 'react';

// Estado vacío: qué no hay y qué hacer para que lo haya. Una pista vacía,
// vista desde arriba: el tramado de fuera de juego y el mensaje en el centro.
export function Vacio({ Icono, titulo, children, accion }: { Icono: Icon; titulo: string; children?: ReactNode; accion?: ReactNode }) {
  return (
    <div className="tramado flex flex-col items-center gap-5 rounded-tarjeta border border-dashed border-borde-fuerte px-6 py-16 text-center">
      <span className="grid size-12 place-items-center rounded-ui bg-acento text-sobre-acento">
        <Icono size={24} weight="duotone" aria-hidden="true" />
      </span>
      <div className="flex flex-col gap-1.5">
        <p className="font-display text-2xl font-semibold tracking-tight text-tinta">{titulo}</p>
        {children && <p className="max-w-[40ch] text-sm text-tinta-2">{children}</p>}
      </div>
      {accion}
    </div>
  );
}
