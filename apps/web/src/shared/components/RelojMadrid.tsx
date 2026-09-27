import { useEffect, useState } from 'react';
import { useT } from '../../i18n/i18n.ts';
import { hora, ZONA } from '../fechas.ts';

// La hora de Madrid, que es la de todas las franjas, en la barra. Se
// actualiza al cambiar de minuto; el punto que late es solo decoración.
export function RelojMadrid({ className = '' }: { className?: string }) {
  const { t } = useT();
  const [ahora, setAhora] = useState(() => new Date());

  useEffect(() => {
    let temporizador: ReturnType<typeof setTimeout>;
    const programar = () => {
      const d = new Date();
      setAhora(d);
      temporizador = setTimeout(programar, 60_000 - (d.getSeconds() * 1000 + d.getMilliseconds()));
    };
    programar();
    return () => clearTimeout(temporizador);
  }, []);

  return (
    <time
      dateTime={ahora.toISOString()}
      aria-label={`${t('nav.horaMadrid')}: ${hora(ahora)}`}
      title={t('nav.horaMadrid')}
      className={`rotulo inline-flex items-center gap-2 text-tinta-2 ${className}`}
    >
      <span aria-hidden="true" className="size-1.5 rounded-full bg-acento motion-safe:animate-latido" />
      <span aria-hidden="true">MAD</span>
      <span aria-hidden="true" className="text-tinta">{ahora.toLocaleTimeString('es-ES', { timeZone: ZONA, hour: '2-digit', minute: '2-digit', hour12: false })}</span>
    </time>
  );
}
