import { motion } from 'motion/react';
import { useReducedMotion } from '../hooks/useReducedMotion.ts';

// El titular de la portada: visible desde el primer fotograma, cada palabra
// sube unos píxeles hasta su sitio. Nada de opacidad ni desenfoque, para que
// el texto nunca falte. La capa partida en palabras queda fuera del árbol de
// accesibilidad y los lectores de pantalla reciben la frase entera, con sus
// espacios. Con prefers-reduced-motion se pinta quieto.
export function TituloAnimado({ texto, className = '' }: { texto: string; className?: string }) {
  const reducido = useReducedMotion();
  const palabras = texto.split(' ');
  if (reducido) return <span className={`flex flex-wrap gap-x-[0.25em] ${className}`}>{texto}</span>;
  return (
    <span className={className}>
      <span className="sr-only">{texto}</span>
      <span aria-hidden="true" className="flex flex-wrap gap-x-[0.25em]" data-animado="">
        {palabras.map((p, i) => (
          <motion.span
            key={i}
            className="inline-block"
            initial={{ y: 28 }}
            animate={{ y: 0 }}
            transition={{ delay: 0.08 + i * 0.06, duration: 0.9, ease: [0.32, 0.72, 0, 1] }}
          >
            {p}
          </motion.span>
        ))}
      </span>
    </span>
  );
}
