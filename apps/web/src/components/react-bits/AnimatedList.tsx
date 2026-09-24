import type { ReactNode } from 'react';

// Provisional sin animación; la Tarea 11 añade la aparición en cascada.
export function AnimatedList<T>({ items, keyOf, render }: { items: T[]; keyOf: (t: T) => string; render: (t: T) => ReactNode }) {
  return <ul className="flex flex-col gap-2">{items.map((t) => <li key={keyOf(t)}>{render(t)}</li>)}</ul>;
}
