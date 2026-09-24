import { useNavigate } from 'react-router';
import { ApiError } from '../../shared/api/errores.ts';
import { Aviso } from '../../shared/components/Aviso.tsx';
import { Boton } from '../../shared/components/Boton.tsx';
import { Campo } from '../../shared/components/Campo.tsx';
import { useFormulario } from '../../shared/hooks/useFormulario.ts';
import { registro } from './api.ts';
import { useSesion } from './SesionProvider.tsx';

export function RegistroPage() {
  const { refrescar } = useSesion();
  const navigate = useNavigate();

  const form = useFormulario({
    enviar: async (f) => {
      await registro({ nombre: String(f.get('nombre')), email: String(f.get('email')), password: String(f.get('password')) });
      await refrescar();
      navigate('/', { replace: true });
    },
    mensajeDeError: (e) => (e instanceof ApiError && e.code === 'EMAIL_EN_USO' ? 'Ya existe una cuenta con ese email.' : 'Revisa los datos: la contraseña necesita al menos 10 caracteres.'),
  });

  return (
    <form onSubmit={form.onSubmit} className="mx-auto flex max-w-sm flex-col gap-4">
      <h1 className="text-2xl font-bold">Crear cuenta</h1>
      {form.error && <Aviso tipo="error">{form.error}</Aviso>}
      <Campo etiqueta="Nombre" name="nombre" required maxLength={60} />
      <Campo etiqueta="Email" name="email" type="email" required autoComplete="email" />
      <Campo etiqueta="Contraseña (mínimo 10 caracteres)" name="password" type="password" required minLength={10} autoComplete="new-password" />
      <Boton disabled={form.enviando}>Crear cuenta</Boton>
    </form>
  );
}
