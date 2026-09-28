import { useLayoutEffect, useRef } from 'react';
import { useLocation } from 'react-router';

// Cada pantalla empieza arriba del todo. Dos excepciones: volver a la lista
// de pistas recupera el punto donde el usuario la dejó, y una ruta con ancla
// (/#pistas) lleva a ese elemento, también cuando ya se está en la portada.
export function useRestaurarScroll() {
  const { pathname, hash, key } = useLocation();
  const scrollPortada = useRef(0);
  const anterior = useRef(pathname);

  useLayoutEffect(() => {
    if (anterior.current === '/' && pathname !== '/') scrollPortada.current = window.scrollY;
    anterior.current = pathname;
    const destino = hash ? document.getElementById(hash.slice(1)) : null;
    if (destino) {
      // En el siguiente fotograma, cuando el menú móvil ya ha soltado el scroll del body.
      const id = requestAnimationFrame(() => destino.scrollIntoView({ behavior: 'instant', block: 'start' }));
      return () => cancelAnimationFrame(id);
    }
    window.scrollTo({ top: pathname === '/' ? scrollPortada.current : 0, behavior: 'instant' });
    return undefined;
  }, [pathname, hash, key]);
}
