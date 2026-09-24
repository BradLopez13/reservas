import { describe, expect, it } from 'vitest';
import { puedeCancelar } from './reservas.ts';

describe('puedeCancelar', () => {
  const inicio = new Date('2026-10-24T10:00:00Z');
  it('sí, con 2 horas justas de antelación', () => expect(puedeCancelar(inicio, new Date('2026-10-24T08:00:00Z'))).toBe(true));
  it('no, con menos de 2 horas', () => expect(puedeCancelar(inicio, new Date('2026-10-24T08:00:01Z'))).toBe(false));
});
