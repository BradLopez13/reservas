import { useReducedMotion } from '../hooks/useReducedMotion.ts';
import CountUpBits from './CountUp.bits.tsx';

// Un número que cuenta hasta su valor al entrar en pantalla.
export function CountUp({ hasta, className }: { hasta: number; className?: string }) {
  if (useReducedMotion()) return <span className={className}>{hasta}</span>;
  return <CountUpBits to={hasta} duration={1.2} {...(className ? { className } : {})} />;
}
