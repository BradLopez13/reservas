import { CalendarBlank } from '@phosphor-icons/react';
import { Link } from 'react-router';
import { useT } from '../../../i18n/i18n.ts';
import { Aviso } from '../../../shared/components/Aviso.tsx';
import { estilosBoton } from '../../../shared/components/Boton.tsx';
import { Cargando, Esqueleto } from '../../../shared/components/Esqueleto.tsx';
import { Vacio } from '../../../shared/components/Vacio.tsx';
import type { ReservaVista } from '../mappers/reserva.mapper.ts';
import { ReservaItem } from './ReservaItem.tsx';

export interface MisReservasViewProps { reservas: ReservaVista[]; cargando: boolean; error: string | null; onCancelar: (id: string) => void }

export function MisReservasView({ reservas, cargando, error, onCancelar }: MisReservasViewProps) {
  const { t } = useT();
  const confirmadas = reservas.filter((r) => r.estado === 'confirmada').length;
  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-10">
      <header className="grid gap-4 border-b border-borde pb-8 sm:grid-cols-[1fr_auto] sm:items-end">
        <div className="flex flex-col gap-3">
          <p className="rotulo uppercase text-tinta-3">{t('misReservas.entrada')}</p>
          <h1 className="font-display text-5xl font-semibold tracking-[-0.03em] text-tinta sm:text-6xl">{t('misReservas.titulo')}</h1>
          <p className="max-w-[44ch] text-tinta-2">{t('misReservas.subtitulo')}</p>
        </div>
        {!cargando && reservas.length > 0 && (
          <p aria-hidden="true" className="cifra text-5xl leading-none text-acento sm:text-6xl">{String(confirmadas).padStart(2, '0')}</p>
        )}
      </header>
      {error && <Aviso tipo="error">{error}</Aviso>}
      {cargando ? (
        <>
          <Cargando que={t('misReservas.cargando')} />
          <div className="flex flex-col gap-3" aria-hidden="true">{[0, 1, 2].map((i) => <Esqueleto key={i} className="h-28 rounded-tarjeta" />)}</div>
        </>
      ) : reservas.length === 0 ? (
        <Vacio Icono={CalendarBlank} titulo={t('misReservas.vacioTitulo')} accion={<Link to="/" className={estilosBoton('primario', 'sm')}>{t('misReservas.verPistas')}</Link>}>
          {t('misReservas.vacioTexto')}
        </Vacio>
      ) : (
        <ul className="flex flex-col gap-3">
          {reservas.map((r) => <ReservaItem key={r.id} reserva={r} onCancelar={onCancelar} />)}
        </ul>
      )}
    </div>
  );
}
