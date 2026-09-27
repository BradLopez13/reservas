import type { Login } from '@reservas/contracts';
import { useLocation, useNavigate } from 'react-router';
import { t, useT } from '../../../i18n/i18n.ts';
import { ApiError } from '../../../shared/api/errores.ts';
import { useFormulario } from '../../../shared/hooks/useFormulario.ts';
import { useTitulo } from '../../../shared/hooks/useTitulo.ts';
import { useLogin as useLoginMutation } from '../mutations/useAuthMutations.ts';
import { useSesion } from '../providers/SesionProvider.tsx';

// --- Lógica pura de la pantalla (sin React): se prueba sin montar nada.
export const leerLogin = (f: FormData): Login => ({ email: String(f.get('email')), password: String(f.get('password')) });

export const mensajeErrorLogin = (e: unknown) =>
  e instanceof ApiError && e.code === 'DEMASIADOS_INTENTOS' ? t('auth.errorIntentos') : t('auth.errorLogin');

// A dónde volver tras el login: la ruta que exigía sesión, o la portada.
export const rutaDeVuelta = (state: unknown) => (state as { volverA?: string } | null)?.volverA ?? '/';

// Por qué se ha pedido la sesión, si la pantalla anterior lo dijo.
export const motivoDeLogin = (state: unknown) => (state as { motivo?: string } | null)?.motivo ?? null;

// --- View-model: todo lo que la vista necesita, y nada más.
export function useLogin() {
  const { refrescar } = useSesion();
  const navigate = useNavigate();
  const location = useLocation();
  useT();
  useTitulo(t('auth.entrar'));
  const entrar = useLoginMutation(async () => { await refrescar(); navigate(rutaDeVuelta(location.state), { replace: true }); });
  const form = useFormulario({ enviar: (f) => entrar.mutateAsync(leerLogin(f)), mensajeDeError: mensajeErrorLogin });
  return { error: form.error, errores: form.errores, enviando: form.enviando, motivo: motivoDeLogin(location.state), volverA: rutaDeVuelta(location.state), onSubmit: form.onSubmit };
}
