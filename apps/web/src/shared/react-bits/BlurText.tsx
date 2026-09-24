import BlurTextBits from './BlurText.bits.tsx';
import { useReducedMotion } from './reducedMotion.ts';

export function BlurText({ text, className }: { text: string; className?: string }) {
  if (useReducedMotion()) return <h1 className={className}>{text}</h1>;
  return (
    <div data-animado>
      <BlurTextBits text={text} {...(className ? { className } : {})} animateBy="words" delay={80} />
    </div>
  );
}
