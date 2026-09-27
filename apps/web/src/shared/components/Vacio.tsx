import type { Icon } from '@phosphor-icons/react';
import type { ReactNode } from 'react';

// Estado vacío: qué no hay y qué hacer para que lo haya.
export function Vacio({ Icono, titulo, children, accion }: { Icono: Icon; titulo: string; children?: ReactNode; accion?: ReactNode }) {
  return (
    <div className="flex flex-col items-center gap-4 rounded-tarjeta border border-dashed border-borde-fuerte px-6 py-14 text-center">
      <span className="grid size-12 place-items-center rounded-full bg-acento-suave text-acento">
        <Icono size={24} weight="duotone" aria-hidden="true" />
      </span>
      <div className="flex flex-col gap-1">
        <p className="font-display text-lg font-semibold text-tinta">{titulo}</p>
        {children && <p className="max-w-[40ch] text-sm text-tinta-2">{children}</p>}
      </div>
      {accion}
    </div>
  );
}
