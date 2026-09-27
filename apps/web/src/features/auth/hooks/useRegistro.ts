import type { Registro } from '@reservas/contracts';
import { useNavigate } from 'react-router';
import { ApiError } from '../../../shared/api/errores.ts';
import { useFormulario } from '../../../shared/hooks/useFormulario.ts';
import { useRegistro as useRegistroMutation } from '../mutations/useAuthMutations.ts';
import { useSesion } from '../providers/SesionProvider.tsx';

export const leerRegistro = (f: FormData): Registro => ({ nombre: String(f.get('nombre')), email: String(f.get('email')), password: String(f.get('password')) });

export const mensajeErrorRegistro = (e: unknown) =>
  e instanceof ApiError && e.code === 'EMAIL_EN_USO' ? 'Ya existe una cuenta con ese email.' : 'Revisa los datos: la contraseña necesita al menos 10 caracteres.';

export function useRegistro() {
  const { refrescar } = useSesion();
  const navigate = useNavigate();
  const crear = useRegistroMutation(async () => { await refrescar(); navigate('/', { replace: true }); });
  const form = useFormulario({ enviar: async (f) => { await crear.mutateAsync(leerRegistro(f)); }, mensajeDeError: mensajeErrorRegistro });
  return { error: form.error, enviando: form.enviando, onSubmit: form.onSubmit };
}
