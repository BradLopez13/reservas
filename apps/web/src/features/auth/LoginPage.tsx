import { Link, useLocation, useNavigate } from 'react-router';
import { ApiError } from '../../shared/api/errores.ts';
import { Aviso } from '../../shared/components/Aviso.tsx';
import { Boton } from '../../shared/components/Boton.tsx';
import { Campo } from '../../shared/components/Campo.tsx';
import { useFormulario } from '../../shared/hooks/useFormulario.ts';
import { login } from './api.ts';
import { useSesion } from './SesionProvider.tsx';

export function LoginPage() {
  const { refrescar } = useSesion();
  const navigate = useNavigate();
  const location = useLocation();
  const volverA = (location.state as { volverA?: string } | null)?.volverA ?? '/';

  const form = useFormulario({
    enviar: async (f) => {
      await login({ email: String(f.get('email')), password: String(f.get('password')) });
      await refrescar();
      navigate(volverA, { replace: true });
    },
    mensajeDeError: (e) => (e instanceof ApiError && e.code === 'DEMASIADOS_INTENTOS' ? 'Demasiados intentos. Espera unos minutos.' : 'Email o contraseña incorrectos.'),
  });

  return (
    <form onSubmit={form.onSubmit} className="mx-auto flex max-w-sm flex-col gap-4">
      <h1 className="text-2xl font-bold">Entrar</h1>
      {form.error && <Aviso tipo="error">{form.error}</Aviso>}
      <Campo etiqueta="Email" name="email" type="email" required autoComplete="email" />
      <Campo etiqueta="Contraseña" name="password" type="password" required autoComplete="current-password" />
      <Boton disabled={form.enviando}>Entrar</Boton>
      <p className="text-sm text-neutral-600">¿Sin cuenta? <Link to="/registro" className="underline">Crear una</Link></p>
    </form>
  );
}
