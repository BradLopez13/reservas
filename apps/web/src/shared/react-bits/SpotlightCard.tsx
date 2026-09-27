import type { ReactNode } from 'react';
import { useReducedMotion } from '../hooks/useReducedMotion.ts';
import SpotlightCardBits from './SpotlightCard.bits.tsx';

// Tarjeta oscura con un foco que sigue al cursor. Las clases del envoltorio
// sustituyen el aspecto por defecto de React Bits por los tokens de la app.
const BASE = 'rounded-tarjeta! border-linea/10! bg-pista-2! p-6! sm:p-8!';

export function SpotlightCard({ children, className = '' }: { children: ReactNode; className?: string }) {
  if (useReducedMotion()) return <div className={`relative overflow-hidden ${BASE} ${className}`}>{children}</div>;
  return (
    <SpotlightCardBits spotlightColor="rgba(212, 240, 74, 0.16)" className={`${BASE} ${className}`}>
      {children}
    </SpotlightCardBits>
  );
}
