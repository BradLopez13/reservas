// La marca: una R geométrica cuyo hueco es una pista vista desde arriba con
// una franja reservada. Hereda el color del texto, así que sirve en lima sobre
// verde y en verde sobre claro (las dos variantes del kit de marca).
export function Marca({ tamano = 28, className = '' }: { tamano?: number; className?: string }) {
  return (
    <svg width={tamano} height={tamano} viewBox="0 0 32 32" aria-hidden="true" className={`shrink-0 ${className}`} fill="currentColor">
      <path fillRule="evenodd" d="M5 3h15a8 8 0 0 1 0 16h-3.4L27 29h-8l-6.6-9.4H12V29H5V3Zm7 5.5v5h7a2.5 2.5 0 0 0 0-5h-7Z" />
      <g stroke="currentColor" strokeWidth="0.9" fill="none">
        <rect x="12.9" y="9.1" width="6.4" height="3.8" />
        <line x1="16.1" y1="9.1" x2="16.1" y2="12.9" />
        <line x1="12.9" y1="11" x2="19.3" y2="11" />
      </g>
      <rect x="16.1" y="9.1" width="3.2" height="1.9" />
    </svg>
  );
}
