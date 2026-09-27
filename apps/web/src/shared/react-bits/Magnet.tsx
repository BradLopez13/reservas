import type { ReactNode } from 'react';
import { useReducedMotion } from '../hooks/useReducedMotion.ts';
import MagnetBits from './Magnet.bits.tsx';

// El botón principal de la portada se acerca al cursor. Es un efecto de ratón:
// en pantallas táctiles no hace nada, y con prefers-reduced-motion no se monta.
export function Magnet({ children }: { children: ReactNode }) {
  if (useReducedMotion()) return <>{children}</>;
  return <MagnetBits padding={60} magnetStrength={6} wrapperClassName="inline-block">{children}</MagnetBits>;
}
