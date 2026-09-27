import { useGSAP } from '@gsap/react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useRef } from 'react';
import { useReducedMotion } from '../hooks/useReducedMotion.ts';

gsap.registerPlugin(ScrollTrigger, useGSAP);

// La imagen entra pequeña y apagada y crece hasta su tamaño al llegar al centro.
export function ImagenEscala({ src, alt, className = '' }: { src: string; alt: string; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const reducido = useReducedMotion();

  useGSAP(() => {
    if (reducido || !ref.current) return;
    gsap.fromTo(
      ref.current,
      { scale: 0.86, opacity: 0.35 },
      { scale: 1, opacity: 1, ease: 'none', scrollTrigger: { trigger: ref.current, start: 'top 92%', end: 'top 45%', scrub: true } },
    );
  }, { scope: ref, dependencies: [reducido] });

  return (
    <div ref={ref} className={`bisel will-change-transform ${className}`}>
      <img src={src} alt={alt} loading="lazy" className="block aspect-[4/3] w-full object-cover" />
    </div>
  );
}
