import type { Login } from '@reservas/contracts';
import { useLocation, useNavigate } from 'react-router';
import { ApiError } from '../../../shared/api/errores.ts';
import { useFormulario } from '../../../shared/hooks/useFormulario.ts';
import { useLogin as useLoginMutation } from '../mutations/useAuthMutations.ts';
import { useSesion } from '../providers/SesionProvider.tsx';

// --- Lógica pura de la pantalla (sin React): se prueba sin montar nada.
export const leerLogin = (f: FormData): Login => ({ email: String(f.get('email')), password: String(f.get('password')) });

export const mensajeErrorLogin = (e: unknown) =>
  e instanceof ApiError && e.code === 'DEMASIADOS_INTENTOS' ? 'Demasiados intentos. Espera unos minutos.' : 'Email o contraseña incorrectos.';

// A dónde volver tras el login: la ruta que exigía sesión, o la portada.
export const rutaDeVuelta = (state: unknown) => (state as { volverA?: string } | null)?.volverA ?? '/';

// --- View-model: todo lo que la vista necesita, y nada más.
export function useLogin() {
  const { refrescar } = useSesion();
  const navigate = useNavigate();
  const location = useLocation();
  const entrar = useLoginMutation(async () => { await refrescar(); navigate(rutaDeVuelta(location.state), { replace: true }); });
  const form = useFormulario({ enviar: (f) => entrar.mutateAsync(leerLogin(f)), mensajeDeError: mensajeErrorLogin });
  return { error: form.error, enviando: form.enviando, onSubmit: form.onSubmit };
}
