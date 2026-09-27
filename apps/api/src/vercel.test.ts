import { describe, expect, it, vi } from 'vitest';

// Solo se prueba la función pura; el módulo arranca la app al importarse.
vi.mock('./app.ts', () => ({ crearApp: async () => ({ ready: async () => {}, server: { emit() {} } }) }));
vi.mock('./shared/db/cliente.ts', () => ({ crearDb: () => ({ db: {} }) }));
process.env.DATABASE_URL ??= 'postgres://x:x@localhost:1/x';
process.env.APP_ORIGIN ??= 'https://web.example';

const { urlOriginal } = await import('./vercel.ts');

describe('urlOriginal', () => {
  it('reconstruye la ruta que la reescritura de Vercel dejó en __ruta', () => {
    expect(urlOriginal('/api?__ruta=healthz')).toBe('/api/healthz');
    expect(urlOriginal('/api?__ruta=reservas%2Fmias')).toBe('/api/reservas/mias');
  });
  it('conserva el resto de la query', () => {
    expect(urlOriginal('/api?__ruta=pistas%2Fabc%2Ffranjas&fecha=2026-10-25')).toBe('/api/pistas/abc/franjas?fecha=2026-10-25');
  });
  it('deja intacta una URL que ya viene completa', () => {
    expect(urlOriginal('/api/healthz')).toBe('/api/healthz');
    expect(urlOriginal('/api/pistas?deporte=padel')).toBe('/api/pistas?deporte=padel');
  });
});
