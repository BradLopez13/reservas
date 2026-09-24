import type { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router';
import { useSesion } from './SesionProvider.tsx';

export function RutaPrivada({ children }: { children: ReactNode }) {
  const { usuario, cargando } = useSesion();
  const location = useLocation();
  if (cargando) return <p className="p-6 text-neutral-500">Cargando…</p>;
  if (!usuario) return <Navigate to="/login" replace state={{ volverA: location.pathname }} />;
  return <>{children}</>;
}
