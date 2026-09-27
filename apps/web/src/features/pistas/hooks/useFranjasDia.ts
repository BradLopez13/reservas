import { useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { hoy } from '../../../shared/fechas.ts';
import { useSesion } from '../../auth/providers/SesionProvider.tsx';
import type { FranjaVista } from '../mappers/franja.mapper.ts';
import { useFranjasQuery, usePistasQuery } from '../queries/usePistasQueries.ts';

export function useFranjasDia() {
  const { id: pistaId = '' } = useParams();
  const navigate = useNavigate();
  const { usuario } = useSesion();
  const [fecha, setFecha] = useState(hoy);
  const [seleccion, setSeleccion] = useState<FranjaVista | null>(null);
  const franjas = useFranjasQuery(pistaId, fecha);
  // La ficha de la pista sale de la misma lista que la portada, ya en caché.
  const pistas = usePistasQuery();
  const pista = pistas.data?.find((p) => p.id === pistaId);

  // Elegir una franja sin sesión lleva al login y vuelve aquí después.
  const onElegir = (f: FranjaVista) => {
    if (!usuario) { navigate('/login', { state: { volverA: `/pistas/${pistaId}` } }); return; }
    setSeleccion(f);
  };

  return {
    pistaId, pista, fecha, minFecha: hoy(), franjas: franjas.data ?? [], cargando: franjas.isPending, seleccion,
    onCambiarFecha: setFecha, onElegir, onCerrarConfirmacion: () => setSeleccion(null),
  };
}
