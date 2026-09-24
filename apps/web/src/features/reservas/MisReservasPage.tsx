import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { cancelarReserva, misReservas } from '../../api/reservas.ts';
import { Aviso } from '../../components/Aviso.tsx';
import { aReservaVista } from '../../mappers/reservas.ts';

export function MisReservasPage() {
  const qc = useQueryClient();
  const reservas = useQuery({ queryKey: ['mis-reservas'], queryFn: async () => (await misReservas()).map((r) => aReservaVista(r, new Date())) });
  const cancelar = useMutation({ mutationFn: cancelarReserva, onSettled: () => void qc.invalidateQueries({ queryKey: ['mis-reservas'] }) });
  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-2xl font-bold">Mis reservas</h1>
      {cancelar.isError && <Aviso tipo="error">No se ha podido cancelar: solo se puede hasta 2 horas antes.</Aviso>}
      {reservas.data?.length === 0 && <p className="text-neutral-500">Todavía no tienes reservas.</p>}
      <ul className="flex flex-col gap-2">
        {reservas.data?.map((r) => (
          <li key={r.id} className={`flex items-center gap-4 rounded-lg border bg-white px-4 py-3 ${r.estado === 'cancelada' ? 'opacity-50' : ''}`}>
            <div className="flex-1">
              <span className="font-semibold">{r.pistaNombre}</span> · {r.etiquetaDia} · {r.etiquetaHora}
              {r.estado === 'cancelada' && <span className="ml-2 text-xs uppercase">cancelada</span>}
            </div>
            {r.cancelable && <button onClick={() => cancelar.mutate(r.id)} className="text-sm text-red-700 underline">Cancelar</button>}
          </li>
        ))}
      </ul>
    </div>
  );
}
