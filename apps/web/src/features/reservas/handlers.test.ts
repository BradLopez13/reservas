import { describe, expect, it } from 'vitest';
import { ApiError } from '../../shared/api/errores.ts';
import { estadoConfirmacion } from './handlers.ts';

describe('estadoConfirmacion', () => {
  const base = { isPending: false, isSuccess: false, error: null };
  it('distingue la franja ocupada de otros errores', () => {
    expect(estadoConfirmacion({ ...base, error: new ApiError('PISTA_OCUPADA', 409, 'x') })).toBe('ocupada');
    expect(estadoConfirmacion({ ...base, error: new ApiError('ERROR_INTERNO', 500, 'x') })).toBe('error');
  });
  it('el éxito manda sobre todo lo demás', () => {
    expect(estadoConfirmacion({ ...base, isSuccess: true })).toBe('confirmada');
  });
  it('mientras se envía, reservando', () => {
    expect(estadoConfirmacion({ ...base, isPending: true })).toBe('reservando');
  });
});
