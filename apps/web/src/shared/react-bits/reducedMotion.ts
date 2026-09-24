import { useSyncExternalStore } from 'react';

const QUERY = '(prefers-reduced-motion: reduce)';

const suscribir = (cb: () => void) => {
  const mq = window.matchMedia(QUERY);
  mq.addEventListener('change', cb);
  return () => mq.removeEventListener('change', cb);
};
const leer = () => window.matchMedia(QUERY).matches;

// Propio, y no el `useReducedMotion` de `motion`: aquel cachea el primer valor
// de matchMedia para toda la vida del módulo y no se puede simular en tests.
export const useReducedMotion = () => useSyncExternalStore(suscribir, leer, () => false);
