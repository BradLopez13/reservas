import { Aviso } from '../../../shared/components/Aviso.tsx';
import { Boton } from '../../../shared/components/Boton.tsx';
import type { ReservaVista } from '../mappers.ts';

export interface MisReservasViewProps { reservas: ReservaVista[]; cargando: boolean; error: string | null; onCancelar: (id: string) => void }

export function MisReservasView({ reservas, cargando, error, onCancelar }: MisReservasViewProps) {
  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-2xl font-bold">Mis reservas</h1>
      {error && <Aviso tipo="error">{error}</Aviso>}
      {!cargando && reservas.length === 0 && <p className="text-neutral-500">Todavía no tienes reservas.</p>}
      <ul className="flex flex-col gap-2">
        {reservas.map((r) => (
          <li key={r.id} className={`flex items-center gap-4 rounded-lg border bg-white px-4 py-3 ${r.estado === 'cancelada' ? 'opacity-50' : ''}`}>
            <div className="flex-1">
              <span className="font-semibold">{r.pistaNombre}</span> · {r.etiquetaDia} · {r.etiquetaHora}
              {r.estado === 'cancelada' && <span className="ml-2 text-xs uppercase">cancelada</span>}
            </div>
            {r.cancelable && <Boton variante="peligro" onClick={() => onCancelar(r.id)}>Cancelar</Boton>}
          </li>
        ))}
      </ul>
    </div>
  );
}
