import { useEffect, useState } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router';
import { t, useT } from '../../../i18n/i18n.ts';
import { diaCorto, hoy } from '../../../shared/fechas.ts';
import { useTitulo } from '../../../shared/hooks/useTitulo.ts';
import { useSesion } from '../../auth/providers/SesionProvider.tsx';
import type { FranjaVista } from '../mappers/franja.mapper.ts';
import { useFranjasQuery, usePistasQuery } from '../queries/usePistasQueries.ts';

export type EstadoPista = 'cargando' | 'no-encontrada' | 'error' | 'ok';

const FECHA = /^\d{4}-\d{2}-\d{2}$/;

// Ruta de vuelta tras el login: la misma pista, el mismo día y la franja elegida.
export const rutaConFranja = (pistaId: string, fecha: string, franja: FranjaVista) =>
  `/pistas/${pistaId}?fecha=${fecha}&franja=${encodeURIComponent(franja.inicio.toISOString())}`;

export function useFranjasDia() {
  const { id: pistaId = '' } = useParams();
  const [params, setParams] = useSearchParams();
  const navigate = useNavigate();
  const { usuario } = useSesion();
  useT();
  const fechaParam = params.get('fecha');
  const [fecha, setFecha] = useState(() => (fechaParam && FECHA.test(fechaParam) && fechaParam >= hoy() ? fechaParam : hoy()));
  const [seleccion, setSeleccion] = useState<FranjaVista | null>(null);
  const franjas = useFranjasQuery(pistaId, fecha);
  // La ficha de la pista sale de la misma lista que la portada, ya en caché.
  const pistas = usePistasQuery();
  const pista = pistas.data?.find((p) => p.id === pistaId);

  // Una pista que no está en la lista no existe, aunque su petición de franjas también falle.
  const estado: EstadoPista = pistas.isPending ? 'cargando' : pistas.isError ? 'error' : !pista ? 'no-encontrada' : franjas.isError ? 'error' : 'ok';
  useTitulo(pista?.nombre);

  // Al volver del login con la franja en la URL, se abre la confirmación directamente.
  const franjaParam = params.get('franja');
  useEffect(() => {
    if (!usuario || !franjaParam || !franjas.data) return;
    const elegida = franjas.data.find((f) => f.inicio.toISOString() === franjaParam && f.libre && f.inicio > new Date());
    if (elegida) setSeleccion(elegida);
    setParams((p) => { p.delete('franja'); return p; }, { replace: true });
  }, [usuario, franjaParam, franjas.data, setParams]);

  // Elegir una franja sin sesión lleva al login, explicando por qué, y vuelve aquí con la franja guardada.
  const onElegir = (f: FranjaVista) => {
    if (!usuario) {
      const motivo = t('pista.motivoLogin', { pista: pista?.nombre ?? t('pista.generico'), dia: diaCorto(f.inicio), hora: f.etiqueta });
      navigate('/login', { state: { volverA: rutaConFranja(pistaId, fecha, f), motivo } });
      return;
    }
    setSeleccion(f);
  };

  return {
    pistaId, pista, estado, fecha, minFecha: hoy(), franjas: franjas.data ?? [], cargando: franjas.isPending, seleccion,
    onCambiarFecha: setFecha, onElegir, onCerrarConfirmacion: () => setSeleccion(null),
  };
}
