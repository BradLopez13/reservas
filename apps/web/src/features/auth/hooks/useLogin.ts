import { useLocation, useNavigate } from 'react-router';
import { useFormulario } from '../../../shared/hooks/useFormulario.ts';
import { leerLogin, mensajeErrorLogin, rutaDeVuelta } from '../handlers.ts';
import { useLogin } from '../mutations.ts';
import { useSesion } from '../SesionProvider.tsx';

// Toda la lógica de la pantalla de login; la vista solo recibe lo que devuelve.
export function useLoginPage() {
  const { refrescar } = useSesion();
  const navigate = useNavigate();
  const location = useLocation();
  const entrar = useLogin(async () => { await refrescar(); navigate(rutaDeVuelta(location.state), { replace: true }); });
  const form = useFormulario({ enviar: (f) => entrar.mutateAsync(leerLogin(f)), mensajeDeError: mensajeErrorLogin });
  return { error: form.error, enviando: form.enviando, onSubmit: form.onSubmit };
}
