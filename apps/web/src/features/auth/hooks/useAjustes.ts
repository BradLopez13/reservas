import type { CambiarPassword } from '@reservas/contracts';
import { t, useT } from '../../../i18n/i18n.ts';
import { useFormulario } from '../../../shared/hooks/useFormulario.ts';
import { useTitulo } from '../../../shared/hooks/useTitulo.ts';
import { useCambiarPassword, useCerrarSesiones } from '../mutations/useAuthMutations.ts';
import { useSesion } from '../providers/SesionProvider.tsx';

export const leerCambioPassword = (f: FormData): CambiarPassword => ({ actual: String(f.get('actual')), nueva: String(f.get('nueva')) });
export const mensajeErrorPassword = () => t('ajustes.errorPassword');

export function useAjustes() {
  const { usuario, salir } = useSesion();
  useT();
  useTitulo(t('ajustes.pestana'));
  const cambiar = useCambiarPassword();
  const cerrarTodas = useCerrarSesiones(salir);
  const form = useFormulario({
    enviar: async (f, formulario) => { await cambiar.mutateAsync(leerCambioPassword(f)); formulario.reset(); },
    mensajeDeError: mensajeErrorPassword,
  });
  return {
    nombre: usuario?.nombre ?? '',
    error: form.error,
    errores: form.errores,
    enviando: form.enviando,
    cambiada: cambiar.isSuccess && !form.error,
    onSubmit: form.onSubmit,
    onCerrarSesiones: () => cerrarTodas.mutate(),
  };
}
