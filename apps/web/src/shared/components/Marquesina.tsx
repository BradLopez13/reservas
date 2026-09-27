import type { ReactNode } from 'react';
import { useReducedMotion } from '../hooks/useReducedMotion.ts';

// Una banda de rótulos que corre sin fin, como un marcador. El contenido va
// duplicado para que el bucle no tenga costura y queda fuera del árbol de
// accesibilidad: todo lo que dice está también en la lista de pistas. Con
// prefers-reduced-motion la banda se queda quieta.
export function Marquesina({ elementos, className = '' }: { elementos: ReactNode[]; className?: string }) {
  const reducido = useReducedMotion();
  if (elementos.length === 0) return null;
  const fila = (
    <ul className="flex shrink-0 items-center gap-10 pr-10">
      {elementos.map((e, i) => <li key={i} className="flex shrink-0 items-center gap-10">{e}<span className="size-1 rounded-full bg-acento" /></li>)}
    </ul>
  );
  return (
    <div aria-hidden="true" className={`flex overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_8%,black_92%,transparent)] ${className}`}>
      <div className={`flex w-max ${reducido ? '' : 'animate-marquesina'}`}>
        {fila}
        {fila}
      </div>
    </div>
  );
}
