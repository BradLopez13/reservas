export const ANTELACION_CANCELACION_MS = 2 * 60 * 60 * 1000;
export function puedeCancelar(inicio: Date, ahora: Date): boolean {
  return inicio.getTime() - ahora.getTime() >= ANTELACION_CANCELACION_MS;
}
