import { describe, expect, it } from 'vitest';
import { aFranjaVista } from './franjas.ts';

describe('aFranjaVista', () => {
  it('convierte a Date y etiqueta en hora de Madrid', () => {
    const v = aFranjaVista({ inicio: '2026-10-25T08:00:00.000Z', fin: '2026-10-25T09:30:00.000Z', libre: true });
    expect(v.inicio).toBeInstanceOf(Date);
    expect(v.etiqueta).toBe('09:00–10:30');
  });
});
