import { describe, expect, it } from 'vitest';
import { ApiError } from '../../../shared/api/errores.ts';
import { mensajeErrorRegistro } from './useRegistro.ts';

describe('lógica de la pantalla de registro', () => {
  it('avisa del email repetido', () => {
    expect(mensajeErrorRegistro(new ApiError('EMAIL_EN_USO', 409, 'x'))).toMatch(/Ya existe/);
    expect(mensajeErrorRegistro(new ApiError('VALIDACION', 422, 'x'))).toMatch(/10 caracteres/);
  });
});
