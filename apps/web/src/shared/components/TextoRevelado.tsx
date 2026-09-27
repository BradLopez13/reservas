import { useGSAP } from '@gsap/react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useRef } from 'react';
import { useReducedMotion } from '../hooks/useReducedMotion.ts';

gsap.registerPlugin(ScrollTrigger, useGSAP);

// Un párrafo cuyas palabras se encienden una a una al ritmo del scroll.
// La capa animada, partida en spans, queda fuera del árbol de accesibilidad;
// los lectores de pantalla reciben el párrafo entero. Con
// prefers-reduced-motion se pinta entero desde el principio.
export function TextoRevelado({ texto, className = '' }: { texto: string; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const reducido = useReducedMotion();
  const palabras = texto.split(' ');

  useGSAP(() => {
    if (reducido || !ref.current) return;
    gsap.fromTo(
      ref.current.querySelectorAll('span'),
      { opacity: 0.18 },
      { opacity: 1, stagger: 0.04, ease: 'none', scrollTrigger: { trigger: ref.current, start: 'top 78%', end: 'bottom 45%', scrub: true } },
    );
  }, { scope: ref, dependencies: [reducido] });

  if (reducido) return <p className={className}>{texto}</p>;
  return (
    <p className={className}>
      <span className="sr-only">{texto}</span>
      <span ref={ref} aria-hidden="true">
        {palabras.map((p, i) => <span key={i} className="inline-block">{p}{i < palabras.length - 1 ? ' ' : ''}</span>)}
      </span>
    </p>
  );
}
