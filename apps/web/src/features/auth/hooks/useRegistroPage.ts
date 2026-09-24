import { useNavigate } from 'react-router';
import { useFormulario } from '../../../shared/hooks/useFormulario.ts';
import { leerRegistro, mensajeErrorRegistro } from '../handlers.ts';
import { useRegistro } from '../mutations.ts';
import { useSesion } from '../SesionProvider.tsx';

export function useRegistroPage() {
  const { refrescar } = useSesion();
  const navigate = useNavigate();
  const crear = useRegistro(async () => { await refrescar(); navigate('/', { replace: true }); });
  const form = useFormulario({ enviar: async (f) => { await crear.mutateAsync(leerRegistro(f)); }, mensajeDeError: mensajeErrorRegistro });
  return { error: form.error, enviando: form.enviando, onSubmit: form.onSubmit };
}
