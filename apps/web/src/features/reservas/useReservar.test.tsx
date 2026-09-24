import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { act, renderHook, waitFor } from '@testing-library/react';
import { http, HttpResponse } from 'msw';
import type { ReactNode } from 'react';
import { describe, expect, it } from 'vitest';
import { servidor } from '../../test/servidor.ts';
import { useReservar } from './useReservar.ts';

const UUID = '0d1f7c6e-9a4b-4c1e-8f2a-3b5d7e9f1a2b';
const wrapper = ({ children }: { children: ReactNode }) => <QueryClientProvider client={new QueryClient()}>{children}</QueryClientProvider>;
const reserva = { id: UUID, pistaId: UUID, pistaNombre: 'P', deporte: 'padel', inicio: '2026-10-25T08:00:00.000Z', fin: '2026-10-25T09:30:00.000Z', estado: 'confirmada' };

describe('useReservar', () => {
  it('reutiliza la misma Idempotency-Key en un reintento y la cambia con nuevaClave()', async () => {
    const claves: string[] = [];
    let fallos = 1;
    servidor.use(http.post('/api/reservas', ({ request }) => {
      claves.push(request.headers.get('idempotency-key')!);
      if (fallos-- > 0) return HttpResponse.error();
      return HttpResponse.json(reserva, { status: 201 });
    }));
    const { result } = renderHook(() => useReservar(), { wrapper });
    const datos = { pistaId: UUID, inicio: reserva.inicio };
    await act(async () => { await result.current.mutation.mutateAsync(datos).catch(() => undefined); });
    await act(async () => { await result.current.mutation.mutateAsync(datos); });
    expect(claves).toHaveLength(2);
    expect(claves[0]).toBe(claves[1]);
    act(() => result.current.nuevaClave());
    await waitFor(() => expect(result.current.clave).not.toBe(claves[0]));
  });
});
