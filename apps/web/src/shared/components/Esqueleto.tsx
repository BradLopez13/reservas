import { useT } from '../../i18n/i18n.ts';

// Cargas con la forma de lo que va a aparecer, en lugar de un texto o una rueda.
export function Esqueleto({ className = '' }: { className?: string }) {
  return <div aria-hidden="true" className={`animate-pulse rounded-ui bg-superficie-2 ${className}`} />;
}

export function Cargando({ que }: { que: string }) {
  const { t } = useT();
  return <p role="status" className="sr-only">{t('cargando', { que })}</p>;
}
