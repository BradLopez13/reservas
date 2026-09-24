import axios, { type AxiosError } from 'axios';
import { CodigoError, ErrorRespuestaSchema } from '@reservas/contracts';
import { ApiError } from './errores.ts';

declare module 'axios' {
  interface AxiosRequestConfig { idempotencyKey?: string }
}

let expirarSesion: () => void = () => {};
export function alExpirarSesion(cb: () => void) { expirarSesion = cb; }

// Mismo origen y cookie httpOnly: withCredentials basta, sin CORS ni tokens en JS.
export const cliente = axios.create({ baseURL: '/api', withCredentials: true, timeout: 15_000 });

cliente.interceptors.request.use((config) => {
  if (config.idempotencyKey) config.headers.set('Idempotency-Key', config.idempotencyKey);
  return config;
});

cliente.interceptors.response.use(undefined, (err: AxiosError) => {
  const status = err.response?.status ?? 0;
  const parsed = ErrorRespuestaSchema.safeParse(err.response?.data);
  const apiError = parsed.success
    ? new ApiError(parsed.data.error.code, status, parsed.data.error.message, parsed.data.error.details)
    : new ApiError(CodigoError.ERROR_INTERNO, status, status ? `Error ${status}` : 'Sin conexión');
  if (status === 401) expirarSesion();
  return Promise.reject(apiError);
});
