import { useEffect } from 'react';

// Cada pantalla pone su título en la pestaña: «Pádel 1 - Reservas».
export function useTitulo(titulo: string | undefined) {
  useEffect(() => {
    document.title = titulo ? `${titulo} - Reservas` : 'Reservas de pistas';
  }, [titulo]);
}
