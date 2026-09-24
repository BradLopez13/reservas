import { describe, expect, it } from 'vitest';
import { CrearReservaBodySchema, FranjasQuerySchema } from './reservas.ts';

describe('CrearReservaBodySchema', () => {
  it('acepta un uuid y un instante ISO', () => {
    const r = CrearReservaBodySchema.safeParse({
      pistaId: '0d1f7c6e-9a4b-4c1e-8f2a-3b5d7e9f1a2b',
      inicio: '2026-10-25T08:00:00.000Z',
    });
    expect(r.success).toBe(true);
  });

  it('rechaza un inicio que no es una fecha', () => {
    expect(CrearReservaBodySchema.safeParse({ pistaId: 'x', inicio: 'mañana' }).success).toBe(false);
  });
});

describe('FranjasQuerySchema', () => {
  it('solo acepta YYYY-MM-DD', () => {
    expect(FranjasQuerySchema.safeParse({ fecha: '2026-10-25' }).success).toBe(true);
    expect(FranjasQuerySchema.safeParse({ fecha: '25/10/2026' }).success).toBe(false);
  });
});
