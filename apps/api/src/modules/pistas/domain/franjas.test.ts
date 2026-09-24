import { describe, expect, it } from 'vitest';
import { esFranjaValida, generarFranjas } from './franjas.ts';

const pista = { apertura: '09:00', cierre: '22:00', duracionMin: 90 };

describe('generarFranjas', () => {
  it('genera franjas de 90 minutos sin pasar del cierre', () => {
    const f = generarFranjas(pista, '2026-10-24');
    expect(f).toHaveLength(8); // 09:00 … 19:30–21:00; la de 21:00–22:30 se pasa
    expect(f[0]!.inicio.toISOString()).toBe('2026-10-24T07:00:00.000Z');
    expect(f[7]!.fin.toISOString()).toBe('2026-10-24T19:00:00.000Z');
  });
  it('el día del cambio de hora sigue teniendo 8 franjas y la primera es a las 09:00 locales', () => {
    const f = generarFranjas(pista, '2026-10-25');
    expect(f).toHaveLength(8);
    expect(f[0]!.inicio.toISOString()).toBe('2026-10-25T08:00:00.000Z');
  });
});

describe('esFranjaValida', () => {
  const ahora = new Date('2026-10-24T06:00:00Z');
  it('acepta una franja alineada y futura', () => {
    const r = esFranjaValida(pista, new Date('2026-10-24T07:00:00Z'), ahora);
    expect(r.ok).toBe(true);
    if (r.ok) expect(r.periodo.fin.toISOString()).toBe('2026-10-24T08:30:00.000Z');
  });
  it('rechaza una franja que no está alineada', () => {
    expect(esFranjaValida(pista, new Date('2026-10-24T07:15:00Z'), ahora).ok).toBe(false);
  });
  it('rechaza una franja que ya ha empezado', () => {
    expect(esFranjaValida(pista, new Date('2026-10-24T07:00:00Z'), new Date('2026-10-24T07:00:01Z')).ok).toBe(false);
  });
});
