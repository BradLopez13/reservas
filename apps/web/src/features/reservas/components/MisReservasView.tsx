import { Aviso } from '../../../shared/components/Aviso.tsx';
import type { ReservaVista } from '../mappers/reserva.mapper.ts';
import { ReservaItem } from './ReservaItem.tsx';

export interface MisReservasViewProps { reservas: ReservaVista[]; cargando: boolean; error: string | null; onCancelar: (id: string) => void }

export function MisReservasView({ reservas, cargando, error, onCancelar }: MisReservasViewProps) {
  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-2xl font-bold">Mis reservas</h1>
      {error && <Aviso tipo="error">{error}</Aviso>}
      {!cargando && reservas.length === 0 && <p className="text-neutral-500">Todavía no tienes reservas.</p>}
      <ul className="flex flex-col gap-2">
        {reservas.map((r) => <ReservaItem key={r.id} reserva={r} onCancelar={onCancelar} />)}
      </ul>
    </div>
  );
}
