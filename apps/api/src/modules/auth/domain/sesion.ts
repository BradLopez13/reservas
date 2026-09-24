export interface Sesion { id: string; usuarioId: string; creadaEn: Date; ultimoUso: Date; expiraEn: Date }

export const SESION_DESLIZANTE_MS = 7 * 24 * 60 * 60 * 1000;
export const SESION_MAX_MS = 30 * 24 * 60 * 60 * 1000;
export const TOCAR_CADA_MS = 60 * 60 * 1000;

// Caduca a los 7 días sin uso, y nunca más tarde de 30 días desde el login.
export function expiracion(creadaEn: Date, ahora: Date) {
  return new Date(Math.min(ahora.getTime() + SESION_DESLIZANTE_MS, creadaEn.getTime() + SESION_MAX_MS));
}
