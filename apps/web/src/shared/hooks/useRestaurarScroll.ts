import { useLayoutEffect, useRef } from 'react';
import { useLocation } from 'react-router';

// Cada pantalla empieza arriba del todo. La única excepción es volver a la
// lista de pistas, que recupera el punto donde el usuario la dejó.
export function useRestaurarScroll() {
  const { pathname } = useLocation();
  const scrollPortada = useRef(0);
  const anterior = useRef(pathname);

  useLayoutEffect(() => {
    if (anterior.current === '/') scrollPortada.current = window.scrollY;
    anterior.current = pathname;
    window.scrollTo({ top: pathname === '/' ? scrollPortada.current : 0, behavior: 'instant' });
  }, [pathname]);
}
