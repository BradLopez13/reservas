import type { Deporte } from '@reservas/contracts';

// Fotografías de Unsplash (licencia Unsplash). Se piden ya recortadas al tamaño en que se muestran.
const unsplash = (id: string, w: number, h: number) => `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&h=${h}&q=75`;

export interface Foto { src: string; alt: string }

export const FOTO_PORTADA: Foto = { src: unsplash('1554068865-24cecd4e34b8', 1400, 1050), alt: 'Jugador sacando en una pista de tierra batida, vista desde arriba' };

export const FOTO_PORTADA_ANCHA: Foto = { src: unsplash('1554068865-24cecd4e34b8', 2000, 1250), alt: FOTO_PORTADA.alt };

export const FOTO_CARRERA: Foto = { src: unsplash('1587280501635-68a0e82cd5ff', 1200, 900), alt: 'Pelota de tenis girando sobre fondo oscuro' };

export const FOTO_ENTRAR: Foto = { src: unsplash('1622163642998-1ea32b0bbc67', 1000, 1250), alt: 'Raqueta y pelota sobre la línea de una pista azul' };

export const FOTO_REGISTRO: Foto = { src: unsplash('1599586120429-48281b6f0ece', 1000, 1250), alt: 'Zapatillas, raqueta y pelota sobre tierra batida' };

export const FOTO_COMO_FUNCIONA: Foto = { src: unsplash('1459865264687-595d652de67e', 1600, 700), alt: 'Línea blanca sobre el césped de un campo' };

export const FOTO_NORMAS: Foto = { src: unsplash('1529900748604-07564a03e7a6', 1600, 700), alt: 'Botas de fútbol en la esquina de un campo de césped artificial' };

const FOTOS_DEPORTE: Record<Deporte, Foto[]> = {
  padel: [
    { src: unsplash('1595435934249-5df7ed86e1c0', 900, 675), alt: 'Jugadora sentada en una pista azul rodeada de pelotas' },
    { src: unsplash('1622279457486-62dcc4a431d6', 900, 675), alt: 'Jugador golpeando de revés en una pista verde' },
  ],
  tenis: [
    { src: unsplash('1599586120429-48281b6f0ece', 900, 675), alt: 'Zapatillas, raqueta y pelota sobre tierra batida' },
    { src: unsplash('1622163642998-1ea32b0bbc67', 900, 675), alt: 'Raqueta y pelota sobre la línea de una pista azul' },
    { src: unsplash('1554068865-24cecd4e34b8', 900, 675), alt: 'Jugador sacando en una pista de tierra batida, vista desde arriba' },
  ],
  futbol: [
    { src: unsplash('1551958219-acbc608c6377', 900, 675), alt: 'Tres balones sobre el césped frente a una portería' },
    { src: unsplash('1574629810360-7efbbe195018', 900, 675), alt: 'Jugador conduciendo el balón sobre el césped' },
    { src: unsplash('1575361204480-aadea25e6e68', 900, 675), alt: 'Balón sobre el césped al sol' },
    { src: unsplash('1529900748604-07564a03e7a6', 900, 675), alt: 'Botas de fútbol en la esquina de un campo de césped artificial' },
  ],
};

// Cada pista recibe una foto de su deporte. El índice es la posición de la
// pista en la lista, así que dos pistas seguidas del mismo deporte no repiten foto.
export const fotoDePista = (deporte: Deporte, indice: number): Foto => {
  const fotos = FOTOS_DEPORTE[deporte];
  return fotos[indice % fotos.length]!;
};

export const NOMBRE_DEPORTE: Record<Deporte, string> = { padel: 'Pádel', tenis: 'Tenis', futbol: 'Fútbol' };
