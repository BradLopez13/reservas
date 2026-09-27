import type { ReactNode } from 'react';
import { useReducedMotion } from '../hooks/useReducedMotion.ts';
import GlareHoverBits from './GlareHover.bits.tsx';

// Un reflejo cruza la foto de la tarjeta al pasar el ratón.
export function GlareHover({ children, className = '' }: { children: ReactNode; className?: string }) {
  if (useReducedMotion()) return <div className={`relative overflow-hidden ${className}`}>{children}</div>;
  return (
    <GlareHoverBits
      width="100%"
      height="100%"
      background="transparent"
      borderRadius="0"
      borderColor="transparent"
      glareColor="#ffffff"
      glareOpacity={0.28}
      glareAngle={-35}
      glareSize={260}
      transitionDuration={700}
      className={`border-0! ${className}`}
    >
      {children}
    </GlareHoverBits>
  );
}
