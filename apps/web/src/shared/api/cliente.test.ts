import { http, HttpResponse } from 'msw';
import { describe, expect, it, vi } from 'vitest';
import { servidor } from '../../test/servidor.ts';
import { alExpirarSesion, cliente } from './cliente.ts';
import { ApiError } from './errores.ts';
import { crearReserva } from '../../features/reservas/api.ts';

const UUID = '0d1f7c6e-9a4b-4c1e-8f2a-3b5d7e9f1a2b';
const datos = { pistaId: UUID, inicio: '2026-10-25T08:00:00.000Z' };

describe('cliente axios', () => {
  it('convierte un error de la API en ApiError tipado', async () => {
    servidor.use(http.post('/api/reservas', () => HttpResponse.json({ error: { code: 'PISTA_OCUPADA', message: 'Ocupada' } }, { status: 409 })));
    const err = await crearReserva(datos, 'clave-1').catch((e: unknown) => e);
    expect(err).toBeInstanceOf(ApiError);
    expect((err as ApiError).code).toBe('PISTA_OCUPADA');
    expect((err as ApiError).status).toBe(409);
  });

  it('envía la cabecera Idempotency-Key que le pasa la función', async () => {
    let cabecera: string | null = null;
    servidor.use(http.post('/api/reservas', ({ request }) => {
      cabecera = request.headers.get('idempotency-key');
      return HttpResponse.json({ id: UUID, pistaId: UUID, pistaNombre: 'P', deporte: 'padel', inicio: datos.inicio, fin: '2026-10-25T09:30:00.000Z', estado: 'confirmada' }, { status: 201 });
    }));
    await crearReserva(datos, 'clave-2');
    expect(cabecera).toBe('clave-2');
  });

  it('ante un 401 avisa de sesión caducada', async () => {
    const cb = vi.fn();
    alExpirarSesion(cb);
    servidor.use(http.get('/api/auth/yo', () => HttpResponse.json({ error: { code: 'NO_AUTENTICADO', message: 'x' } }, { status: 401 })));
    await cliente.get('/auth/yo').catch(() => undefined);
    expect(cb).toHaveBeenCalledOnce();
  });

  it('rechaza una respuesta que no cumple el contrato', async () => {
    servidor.use(http.post('/api/reservas', () => HttpResponse.json({ id: 'no-es-uuid' }, { status: 201 })));
    await expect(crearReserva(datos, 'k')).rejects.toThrow();
  });
});
