import type { CambiarPassword, Login, Registro } from '@reservas/contracts';
import { ApiError } from '../../shared/api/errores.ts';

// Funciones puras: del formulario al contrato, y del error al mensaje.
// Sin React y sin red, así que se prueban sin montar nada.

export const leerLogin = (f: FormData): Login => ({ email: String(f.get('email')), password: String(f.get('password')) });

export const leerRegistro = (f: FormData): Registro => ({ nombre: String(f.get('nombre')), email: String(f.get('email')), password: String(f.get('password')) });

export const leerCambioPassword = (f: FormData): CambiarPassword => ({ actual: String(f.get('actual')), nueva: String(f.get('nueva')) });

export const mensajeErrorLogin = (e: unknown) =>
  e instanceof ApiError && e.code === 'DEMASIADOS_INTENTOS' ? 'Demasiados intentos. Espera unos minutos.' : 'Email o contraseña incorrectos.';

export const mensajeErrorRegistro = (e: unknown) =>
  e instanceof ApiError && e.code === 'EMAIL_EN_USO' ? 'Ya existe una cuenta con ese email.' : 'Revisa los datos: la contraseña necesita al menos 10 caracteres.';

export const mensajeErrorPassword = () => 'La contraseña actual no es correcta o la nueva es demasiado corta.';

// A dónde volver tras el login: la ruta que exigía sesión, o la portada.
export const rutaDeVuelta = (state: unknown) => (state as { volverA?: string } | null)?.volverA ?? '/';
