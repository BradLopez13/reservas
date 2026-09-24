import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { franjasDe } from './api.ts';
import { AnimatedList } from '../../shared/react-bits/AnimatedList.tsx';
import { aFranjaVista, type FranjaVista } from './mappers.ts';
import { useSesion } from '../auth/SesionProvider.tsx';
import { ConfirmarReserva } from '../reservas/ConfirmarReserva.tsx';
import { hoy } from '../../shared/fechas.ts';

export function FranjasDia() {
  const { id = '' } = useParams();
  const navigate = useNavigate();
  const { usuario } = useSesion();
  const [fecha, setFecha] = useState(hoy);
  const [seleccion, setSeleccion] = useState<FranjaVista | null>(null);
  const franjas = useQuery({ queryKey: ['franjas', id, fecha], queryFn: async () => (await franjasDe(id, fecha)).map(aFranjaVista) });

  function elegir(f: FranjaVista) {
    if (!usuario) { navigate('/login', { state: { volverA: `/pistas/${id}` } }); return; }
    setSeleccion(f);
  }

  return (
    <div className="flex flex-col gap-4">
      <label className="flex items-center gap-3 text-sm">
        Día<input type="date" value={fecha} min={hoy()} onChange={(e) => setFecha(e.target.value)} className="rounded border px-2 py-1" />
      </label>
      {franjas.isPending && <p className="text-neutral-500">Cargando franjas…</p>}
      {franjas.data && (
        <AnimatedList
          items={franjas.data}
          keyOf={(f) => f.inicio.toISOString()}
          render={(f) => (
            <button disabled={!f.libre || f.inicio <= new Date()} onClick={() => elegir(f)}
              className="w-full rounded-lg border bg-white px-4 py-3 text-left hover:border-emerald-600 disabled:cursor-not-allowed disabled:bg-neutral-100 disabled:text-neutral-400">
              {f.etiqueta} <span className="float-right text-sm">{f.libre ? 'Libre' : 'Ocupada'}</span>
            </button>
          )}
        />
      )}
      {seleccion && <ConfirmarReserva pistaId={id} franja={seleccion} onCerrar={() => setSeleccion(null)} />}
    </div>
  );
}
