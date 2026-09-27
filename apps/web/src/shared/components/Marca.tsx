// Marca de la app: un cuadrado redondeado con una pelota. Geométrica a propósito,
// para que funcione a 20 px en la barra y a 64 px en el pie.
export function Marca({ tamano = 28 }: { tamano?: number }) {
  return (
    <svg width={tamano} height={tamano} viewBox="0 0 32 32" aria-hidden="true" className="shrink-0">
      <rect width="32" height="32" rx="8" className="fill-acento" />
      <circle cx="16" cy="16" r="6.5" className="fill-sobre-acento" />
    </svg>
  );
}
