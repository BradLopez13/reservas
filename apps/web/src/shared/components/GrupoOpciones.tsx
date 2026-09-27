import type { KeyboardEvent, ReactNode, Ref } from 'react';

export interface Opcion<T> { valor: T; contenido: ReactNode; clave: string }

interface Props<T> {
  etiqueta: string;
  valor: T;
  opciones: Opcion<T>[];
  onCambiar: (v: T) => void;
  className?: string;
  claseOpcion: (activa: boolean) => string;
  ref?: Ref<HTMLDivElement>;
}

// Opciones mutuamente excluyentes (un deporte, un día) como grupo de radios:
// una sola parada de tabulador, flechas para moverse y aria-checked en la activa.
export function GrupoOpciones<T>({ etiqueta, valor, opciones, onCambiar, className = '', claseOpcion, ref }: Props<T>) {
  const indice = Math.max(0, opciones.findIndex((o) => o.valor === valor));

  const onTecla = (e: KeyboardEvent<HTMLButtonElement>) => {
    const paso = e.key === 'ArrowRight' || e.key === 'ArrowDown' ? 1 : e.key === 'ArrowLeft' || e.key === 'ArrowUp' ? -1 : 0;
    if (!paso) return;
    e.preventDefault();
    const siguiente = opciones[(indice + paso + opciones.length) % opciones.length]!;
    onCambiar(siguiente.valor);
    (e.currentTarget.parentElement?.children[(indice + paso + opciones.length) % opciones.length] as HTMLElement | undefined)?.focus();
  };

  return (
    <div ref={ref} role="radiogroup" aria-label={etiqueta} className={className}>
      {opciones.map((o, i) => {
        const activa = i === indice;
        return (
          <button
            key={o.clave}
            type="button"
            role="radio"
            aria-checked={activa}
            tabIndex={activa ? 0 : -1}
            onClick={() => onCambiar(o.valor)}
            onKeyDown={onTecla}
            className={claseOpcion(activa)}
          >
            {o.contenido}
          </button>
        );
      })}
    </div>
  );
}
