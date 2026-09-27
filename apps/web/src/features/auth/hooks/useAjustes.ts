import type { CambiarPassword } from '@reservas/contracts';
import { useFormulario } from '../../../shared/hooks/useFormulario.ts';
import { useCambiarPassword, useCerrarSesiones } from '../mutations/useAuthMutations.ts';
import { useSesion } from '../providers/SesionProvider.tsx';

export const leerCambioPassword = (f: FormData): CambiarPassword => ({ actual: String(f.get('actual')), nueva: String(f.get('nueva')) });
export const mensajeErrorPassword = () => 'La contraseña actual no es correcta o la nueva es demasiado corta.';

export function useAjustes() {
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
