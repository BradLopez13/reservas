import type { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router';
import { useT } from '../../../i18n/i18n.ts';
import { Cargando, Esqueleto } from '../../../shared/components/Esqueleto.tsx';
import { useSesion } from '../providers/SesionProvider.tsx';

export function RutaPrivada({ children }: { children: ReactNode }) {
  const { usuario, cargando } = useSesion();
  const { t } = useT();
  const location = useLocation();
  if (cargando) {
    return (
      <div className="mx-auto flex max-w-3xl flex-col gap-4">
        <Cargando que={t('ajustes.cargandoSesion')} />
        <Esqueleto className="h-10 w-56" />
        <Esqueleto className="h-24 rounded-tarjeta" />
        <Esqueleto className="h-24 rounded-tarjeta" />
      </div>
    );
  }
  if (!usuario) return <Navigate to="/login" replace state={{ volverA: location.pathname }} />;
  return <>{children}</>;
}
