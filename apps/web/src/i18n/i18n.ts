import { useSyncExternalStore } from 'react';
import type { Deporte } from '@reservas/contracts';
import en from './en.json';
import es from './es.json';

// Todos los textos de la app viven en es.json y en.json; los componentes solo
// piden claves. El diccionario es un almacén externo: cambiar de idioma avisa
// a todo lo que use `useT()`, y las funciones puras (`t`, `idioma`) sirven
// fuera de React, en hooks, mappers y mensajes de error.

export type Idioma = 'es' | 'en';
export type Diccionario = typeof es;

// Rutas con punto hasta cada texto: 'nav.pistas', 'pista.horasLibres.other'…
type Rutas<T, P extends string = ''> = T extends string
  ? P
  : T extends readonly unknown[]
    ? never
    : { [K in keyof T & string]: Rutas<T[K], P extends '' ? K : `${P}.${K}`> }[keyof T & string];
export type Clave = Rutas<Diccionario>;

// en.json debe tener las mismas claves que es.json: si falta una, no compila.
const DICCIONARIOS: Record<Idioma, Diccionario> = { es, en };

export const IDIOMAS: Idioma[] = ['es', 'en'];
export const LOCALE: Record<Idioma, string> = { es: 'es-ES', en: 'en-GB' };
const CLAVE_ALMACEN = 'idioma';

const esIdioma = (v: unknown): v is Idioma => v === 'es' || v === 'en';

function idiomaInicial(): Idioma {
  try {
    const guardado = globalThis.localStorage?.getItem(CLAVE_ALMACEN);
    if (esIdioma(guardado)) return guardado;
  } catch { /* sin almacenamiento: castellano */ }
  return 'es';
}

let actual: Idioma = idiomaInicial();
const oyentes = new Set<() => void>();

export const idioma = () => actual;

export function establecerIdioma(nuevo: Idioma) {
  if (nuevo === actual) return;
  actual = nuevo;
  try { globalThis.localStorage?.setItem(CLAVE_ALMACEN, nuevo); } catch { /* sin almacenamiento */ }
  if (typeof document !== 'undefined') document.documentElement.lang = nuevo;
  oyentes.forEach((f) => f());
}

export function suscribir(cb: () => void) {
  oyentes.add(cb);
  return () => { oyentes.delete(cb); };
}

export const diccionario = () => DICCIONARIOS[actual];

type Params = Record<string, string | number>;

function leer(clave: string): string {
  const valor = clave.split('.').reduce<unknown>((o, k) => (o && typeof o === 'object' ? (o as Record<string, unknown>)[k] : undefined), diccionario());
  if (typeof valor !== 'string') throw new Error(`Falta el texto «${clave}» en ${actual}.json`);
  return valor;
}

const interpolar = (texto: string, params?: Params) => (params ? texto.replace(/\{(\w+)\}/g, (_, k: string) => String(params[k] ?? `{${k}}`)) : texto);

export const t = (clave: Clave, params?: Params) => interpolar(leer(clave), params);

// Claves con variantes «one» y «other»: `plural('pista.horasLibres', 3)`.
type BasePlural<C> = C extends `${infer B}.one` ? B : never;
type ClavePlural = BasePlural<Clave>;
export const plural = (base: ClavePlural, n: number, params?: Params) => interpolar(leer(`${base}.${n === 1 ? 'one' : 'other'}`), { n, ...params });

export const nombreDeporte = (d: Deporte) => t(`deportes.${d}`);

// En React: se vuelve a renderizar al cambiar de idioma.
export function useT() {
  const i = useSyncExternalStore(suscribir, idioma, idioma);
  return { t, plural, d: DICCIONARIOS[i], idioma: i, nombreDeporte };
}

if (typeof document !== 'undefined') document.documentElement.lang = actual;
