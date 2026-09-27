// Las líneas de una pista vistas desde arriba (dos campos, líneas de saque y
// línea central), como fondo de los paneles verdes. Solo decoración: aria-hidden.
export function LineasPista({ className = '' }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 1200 600"
      preserveAspectRatio="xMidYMid slice"
      className={`pointer-events-none absolute inset-0 size-full text-linea ${className}`}
      fill="none"
      stroke="currentColor"
      strokeWidth="3"
    >
      <rect x="60" y="60" width="1080" height="480" rx="2" />
      <line x1="600" y1="60" x2="600" y2="540" strokeWidth="5" />
      <line x1="300" y1="60" x2="300" y2="540" />
      <line x1="900" y1="60" x2="900" y2="540" />
      <line x1="60" y1="300" x2="300" y2="300" />
      <line x1="900" y1="300" x2="1140" y2="300" />
    </svg>
  );
}
