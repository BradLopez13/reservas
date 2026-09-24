import { useState } from 'react';
import { Aviso } from '../../shared/components/Aviso.tsx';
import { Boton } from '../../shared/components/Boton.tsx';
import { Campo } from '../../shared/components/Campo.tsx';
import { useFormulario } from '../../shared/hooks/useFormulario.ts';
import { cambiarPassword, cerrarSesiones } from './api.ts';
import { useSesion } from './SesionProvider.tsx';

export function AjustesPage() {
  const { usuario, salir } = useSesion();
  const [hecho, setHecho] = useState(false);

  const form = useFormulario({
    enviar: async (f, formulario) => {
      await cambiarPassword({ actual: String(f.get('actual')), nueva: String(f.get('nueva')) });
      formulario.reset();
      setHecho(true);
    },
    mensajeDeError: () => 'La contraseña actual no es correcta o la nueva es demasiado corta.',
  });

  return (
    <div className="mx-auto flex max-w-sm flex-col gap-6">
      <h1 className="text-2xl font-bold">Cuenta de {usuario?.nombre}</h1>
      <form onSubmit={form.onSubmit} className="flex flex-col gap-3">
        <h2 className="font-semibold">Cambiar contraseña</h2>
        {form.error && <Aviso tipo="error">{form.error}</Aviso>}
        {hecho && !form.error && <Aviso tipo="ok">Contraseña cambiada. Las demás sesiones se han cerrado.</Aviso>}
        <Campo etiqueta="Actual" name="actual" type="password" required autoComplete="current-password" />
        <Campo etiqueta="Nueva (mínimo 10 caracteres)" name="nueva" type="password" required minLength={10} autoComplete="new-password" />
        <Boton disabled={form.enviando}>Cambiar</Boton>
      </form>
      <div className="flex flex-col gap-2">
        <h2 className="font-semibold">Sesiones</h2>
        <Boton variante="secundario" className="text-left" onClick={async () => { await cerrarSesiones(); await salir(); }}>
          Cerrar sesión en todos los dispositivos
        </Boton>
      </div>
    </div>
  );
}
