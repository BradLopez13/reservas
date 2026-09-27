import type { Deporte } from '@reservas/contracts';
import type { Clave } from '../i18n/i18n.ts';

// Fotografías de Unsplash (licencia Unsplash). Se piden ya recortadas al tamaño
// en que se muestran. El texto alternativo es una clave del diccionario.
const unsplash = (id: string, w: number, h: number) => `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&h=${h}&q=75`;

export type ClaveFoto = Extract<Clave, `fotos.${string}`>;
export interface Foto { src: string; alt: ClaveFoto }

export const FOTO_PORTADA: Foto = { src: unsplash('1554068865-24cecd4e34b8', 1400, 1050), alt: 'fotos.portada' };

export const FOTO_CARRERA: Foto = { src: unsplash('1587280501635-68a0e82cd5ff', 1200, 900), alt: 'fotos.carrera' };

export const FOTO_ENTRAR: Foto = { src: unsplash('1622163642998-1ea32b0bbc67', 1000, 1250), alt: 'fotos.entrar' };

export const FOTO_REGISTRO: Foto = { src: unsplash('1599586120429-48281b6f0ece', 1000, 1250), alt: 'fotos.registro' };

export const FOTO_COMO_FUNCIONA: Foto = { src: unsplash('1459865264687-595d652de67e', 1600, 700), alt: 'fotos.comoFunciona' };

export const FOTO_NORMAS: Foto = { src: unsplash('1529900748604-07564a03e7a6', 1600, 700), alt: 'fotos.normas' };

const FOTOS_DEPORTE: Record<Deporte, Foto[]> = {
  padel: [
    { src: unsplash('1595435934249-5df7ed86e1c0', 900, 675), alt: 'fotos.padel1' },
    { src: unsplash('1622279457486-62dcc4a431d6', 900, 675), alt: 'fotos.padel2' },
    { src: unsplash('1602211844066-d3bb556e983b', 900, 675), alt: 'fotos.padel3' },
  ],
  tenis: [
    { src: unsplash('1599586120429-48281b6f0ece', 900, 675), alt: 'fotos.tenis1' },
    { src: unsplash('1622163642998-1ea32b0bbc67', 900, 675), alt: 'fotos.tenis2' },
    { src: unsplash('1554068865-24cecd4e34b8', 900, 675), alt: 'fotos.tenis3' },
  ],
  futbol: [
    { src: unsplash('1551958219-acbc608c6377', 900, 675), alt: 'fotos.futbol1' },
    { src: unsplash('1574629810360-7efbbe195018', 900, 675), alt: 'fotos.futbol2' },
    { src: unsplash('1575361204480-aadea25e6e68', 900, 675), alt: 'fotos.futbol3' },
    { src: unsplash('1529900748604-07564a03e7a6', 900, 675), alt: 'fotos.futbol4' },
  ],
};

// Cada pista recibe una foto de su deporte. El índice es la posición de la
// pista en la lista, así que dos pistas seguidas del mismo deporte no repiten foto.
export const fotoDePista = (deporte: Deporte, indice: number): Foto => {
  const fotos = FOTOS_DEPORTE[deporte];
  return fotos[indice % fotos.length]!;
};
