import type { ReactNode } from 'react';
import ClickSparkBits from './ClickSpark.bits.tsx';
import { useReducedMotion } from '../hooks/useReducedMotion.ts';

// Chispas al confirmar la reserva.
export function ClickSpark({ children }: { children: ReactNode }) {
  if (useReducedMotion()) return <>{children}</>;
  return <ClickSparkBits sparkColor="#d4f04a" sparkCount={8} sparkRadius={18}>{children}</ClickSparkBits>;
}
