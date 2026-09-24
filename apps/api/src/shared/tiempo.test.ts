import { describe, expect, it } from 'vitest';
import { aUtc, fechaLocal } from './tiempo.ts';

describe('aUtc', () => {
  it('convierte hora de Madrid en verano (CEST, +2)', () => {
    expect(aUtc('2026-10-24', '09:00').toISOString()).toBe('2026-10-24T07:00:00.000Z');
  });
  it('convierte hora de Madrid el día del cambio de hora (CET, +1)', () => {
    expect(aUtc('2026-10-25', '09:00').toISOString()).toBe('2026-10-25T08:00:00.000Z');
  });
  it('fechaLocal devuelve el día en Madrid aunque en UTC sea el anterior', () => {
    expect(fechaLocal(new Date('2026-07-01T22:30:00Z'))).toBe('2026-07-02');
  });
});
