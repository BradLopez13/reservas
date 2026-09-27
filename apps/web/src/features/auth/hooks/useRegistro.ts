import type { Registro } from '@reservas/contracts';
import { useLocation, useNavigate } from 'react-router';
import { t, useT } from '../../../i18n/i18n.ts';
import { ApiError } from '../../../shared/api/errores.ts';
import { useFormulario } from '../../../shared/hooks/useFormulario.ts';
import { useTitulo } from '../../../shared/hooks/useTitulo.ts';
import { useRegistro as useRegistroMutation } from '../mutations/useAuthMutations.ts';
import { useSesion } from '../providers/SesionProvider.tsx';
import { rutaDeVuelta } from './useLogin.ts';

export const leerRegistro = (f: FormData): Registro => ({ nombre: String(f.get('nombre')), email: String(f.get('email')), password: String(f.get('password')) });

export const mensajeErrorRegistro = (e: unknown) =>
  e instanceof ApiError && e.code === 'EMAIL_EN_USO' ? t('auth.errorEmailEnUso') : t('auth.errorRegistro');

export function useRegistro() {
  const { refrescar } = useSesion();
  const navigate = useNavigate();
  const location = useLocation();
  useT();
  useTitulo(t('auth.crearCuenta'));
  // Quien venía de elegir una franja vuelve a ella también tras crear la cuenta.
  const crear = useRegistroMutation(async () => { await refrescar(); navigate(rutaDeVuelta(location.state), { replace: true }); });
  const form = useFormulario({ enviar: async (f) => { await crear.mutateAsync(leerRegistro(f)); }, mensajeDeError: mensajeErrorRegistro });
  return { error: form.error, errores: form.errores, enviando: form.enviando, onSubmit: form.onSubmit };
}
