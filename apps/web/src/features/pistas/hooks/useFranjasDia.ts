import { useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { hoy } from '../../../shared/fechas.ts';
import { useSesion } from '../../auth/SesionProvider.tsx';
import type { FranjaVista } from '../mappers.ts';
import { useFranjas } from '../queries.ts';

export function useFranjasDia() {
  const { id: pistaId = '' } = useParams();
  const navigate = useNavigate();
  const { usuario } = useSesion();
  const [fecha, setFecha] = useState(hoy);
  const [seleccion, setSeleccion] = useState<FranjaVista | null>(null);
  const franjas = useFranjas(pistaId, fecha);

  // Elegir una franja sin sesión lleva al login y vuelve aquí después.
  const onElegir = (f: FranjaVista) => {
    if (!usuario) { navigate('/login', { state: { volverA: `/pistas/${pistaId}` } }); return; }
    setSeleccion(f);
  };

  return {
    pistaId, fecha, minFecha: hoy(), franjas: franjas.data ?? [], cargando: franjas.isPending, seleccion,
    onCambiarFecha: setFecha, onElegir, onCerrarConfirmacion: () => setSeleccion(null),
  };
}
