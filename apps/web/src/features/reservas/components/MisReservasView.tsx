import { CalendarBlank } from '@phosphor-icons/react';
import { Link } from 'react-router';
import { Aviso } from '../../../shared/components/Aviso.tsx';
import { estilosBoton } from '../../../shared/components/Boton.tsx';
import { Cargando, Esqueleto } from '../../../shared/components/Esqueleto.tsx';
import { Vacio } from '../../../shared/components/Vacio.tsx';
import type { ReservaVista } from '../mappers/reserva.mapper.ts';
import { ReservaItem } from './ReservaItem.tsx';

export interface MisReservasViewProps { reservas: ReservaVista[]; cargando: boolean; error: string | null; onCancelar: (id: string) => void }

export function MisReservasView({ reservas, cargando, error, onCancelar }: MisReservasViewProps) {
  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-8">
      <header className="flex flex-col gap-2">
        <h1 className="font-display text-4xl font-semibold tracking-tight text-tinta">Mis reservas</h1>
        <p className="text-tinta-2">Puedes cancelar una reserva hasta dos horas antes de que empiece.</p>
      </header>
      {error && <Aviso tipo="error">{error}</Aviso>}
      {cargando ? (
        <>
          <Cargando que="reservas" />
          <div className="flex flex-col gap-3" aria-hidden="true">{[0, 1, 2].map((i) => <Esqueleto key={i} className="h-24 rounded-tarjeta" />)}</div>
        </>
      ) : reservas.length === 0 ? (
        <Vacio Icono={CalendarBlank} titulo="Todavía no tienes reservas" accion={<Link to="/" className={estilosBoton('primario', 'sm')}>Ver pistas</Link>}>
          Elige una pista, un día y una hora libre.
        </Vacio>
      ) : (
        <ul className="flex flex-col gap-3">
          {reservas.map((r) => <ReservaItem key={r.id} reserva={r} onCancelar={onCancelar} />)}
        </ul>
      )}
    </div>
  );
}
