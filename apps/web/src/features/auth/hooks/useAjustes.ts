import { useFormulario } from '../../../shared/hooks/useFormulario.ts';
import { leerCambioPassword, mensajeErrorPassword } from '../handlers.ts';
import { useCambiarPassword, useCerrarSesiones } from '../mutations.ts';
import { useSesion } from '../SesionProvider.tsx';

export function useAjustesPage() {
  const { usuario, salir } = useSesion();
  const cambiar = useCambiarPassword();
  const cerrarTodas = useCerrarSesiones(salir);
  const form = useFormulario({
    enviar: async (f, formulario) => { await cambiar.mutateAsync(leerCambioPassword(f)); formulario.reset(); },
    mensajeDeError: mensajeErrorPassword,
  });
  return {
    nombre: usuario?.nombre ?? '',
    error: form.error,
    enviando: form.enviando,
    cambiada: cambiar.isSuccess && !form.error,
    onSubmit: form.onSubmit,
    onCerrarSesiones: () => cerrarTodas.mutate(),
  };
}
