import { motion } from 'motion/react';
import type { ReactNode } from 'react';
import { useReducedMotion } from './reducedMotion.ts';

interface Props<T> { items: T[]; keyOf: (t: T) => string; render: (t: T) => ReactNode }

// Aparición en cascada de las franjas al cambiar de día.
export function AnimatedList<T>({ items, keyOf, render }: Props<T>) {
  const reducido = useReducedMotion();
  return (
    <ul className="flex flex-col gap-2" data-animado={reducido ? undefined : ''}>
      {items.map((t, i) => reducido
        ? <li key={keyOf(t)}>{render(t)}</li>
        : (
          <motion.li key={keyOf(t)} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03, duration: 0.2 }}>
            {render(t)}
          </motion.li>
        ))}
    </ul>
  );
}
