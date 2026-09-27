import { useEffect } from 'react';
import { useT } from '../../i18n/i18n.ts';

// Cada pantalla pone su título en la pestaña: «Pádel 1 - Reservas».
export function useTitulo(titulo: string | undefined) {
  const { t, idioma } = useT();
  useEffect(() => {
    document.title = titulo ? `${titulo} - ${t('app.nombre')}` : t('app.pestana');
  }, [titulo, idioma, t]);
}
