import { describe, expect, it } from 'vitest';
import { ApiError } from '../../shared/api/errores.ts';
import { leerLogin, mensajeErrorLogin, mensajeErrorRegistro, rutaDeVuelta } from './handlers.ts';

describe('handlers de auth', () => {
  it('lee las credenciales del formulario', () => {
    const f = new FormData();
    f.set('email', 'ana@example.com');
    f.set('password', 'contraseña-larga');
    expect(leerLogin(f)).toEqual({ email: 'ana@example.com', password: 'contraseña-larga' });
  });

  it('distingue el bloqueo por intentos del resto de errores de login', () => {
    expect(mensajeErrorLogin(new ApiError('DEMASIADOS_INTENTOS', 429, 'x'))).toMatch(/Demasiados intentos/);
    expect(mensajeErrorLogin(new ApiError('CREDENCIALES_INVALIDAS', 401, 'x'))).toMatch(/incorrectos/);
    expect(mensajeErrorLogin(new Error('red'))).toMatch(/incorrectos/);
  });

  it('avisa del email repetido al registrarse', () => {
    expect(mensajeErrorRegistro(new ApiError('EMAIL_EN_USO', 409, 'x'))).toMatch(/Ya existe/);
  });

  it('vuelve a la portada si no hay ruta guardada', () => {
    expect(rutaDeVuelta(null)).toBe('/');
    expect(rutaDeVuelta({ volverA: '/pistas/1' })).toBe('/pistas/1');
  });
});
