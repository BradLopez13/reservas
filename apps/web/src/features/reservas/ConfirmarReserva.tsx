import { useNavigate } from 'react-router';
import { Aviso } from '../../components/Aviso.tsx';
import { ClickSpark } from '../../components/react-bits/ClickSpark.tsx';
import type { FranjaVista } from '../../mappers/franjas.ts';
import { useReservar } from './useReservar.ts';

// Se monta al elegir una franja y se desmonta al cerrar: cada confirmación
// estrena su propia clave de idempotencia.
export function ConfirmarReserva({ pistaId, franja, onCerrar }: { pistaId: string; franja: FranjaVista; onCerrar: () => void }) {
  const { mutation } = useReservar();
  const navigate = useNavigate();
  const err = mutation.error;
  const ocupada = err?.code === 'PISTA_OCUPADA';
  return (
    <div role="dialog" aria-modal="true" className="fixed inset-0 flex items-center justify-center bg-black/40 p-4">
      <div className="flex w-full max-w-sm flex-col gap-4 rounded-lg bg-white p-6">
        <h2 className="text-xl font-bold">Reservar {franja.etiqueta}</h2>
        {ocupada && <Aviso tipo="error">Alguien se te ha adelantado: esa franja ya está ocupada. Elige otra.</Aviso>}
        {err && !ocupada && <Aviso tipo="error">No se ha podido reservar. Vuelve a intentarlo.</Aviso>}
        {mutation.isSuccess && <Aviso tipo="ok">Reserva confirmada.</Aviso>}
        <div className="flex justify-end gap-2">
          <button onClick={onCerrar} className="rounded border px-4 py-2">{mutation.isSuccess || ocupada ? 'Cerrar' : 'Cancelar'}</button>
          {mutation.isSuccess ? (
            <button onClick={() => navigate('/mis-reservas')} className="rounded bg-emerald-700 px-4 py-2 text-white">Ver mis reservas</button>
          ) : !ocupada && (
            <ClickSpark>
              <button disabled={mutation.isPending} onClick={() => mutation.mutate({ pistaId, inicio: franja.inicio.toISOString() })}
                className="rounded bg-emerald-700 px-4 py-2 text-white disabled:opacity-50">
                {mutation.isPending ? 'Reservando…' : 'Confirmar'}
              </button>
            </ClickSpark>
          )}
        </div>
      </div>
    </div>
  );
}
