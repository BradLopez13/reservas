import { useState, type FormEvent } from 'react';
import { Link, useLocation, useNavigate } from 'react-router';
import { login } from '../../api/auth.ts';
import { ApiError } from '../../api/errores.ts';
import { Aviso } from '../../components/Aviso.tsx';
import { useSesion } from './SesionProvider.tsx';

export function LoginPage() {
  const { refrescar } = useSesion();
  const navigate = useNavigate();
  const location = useLocation();
  const [error, setError] = useState<string | null>(null);
  const [enviando, setEnviando] = useState(false);
  const volverA = (location.state as { volverA?: string } | null)?.volverA ?? '/';

  async function enviar(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setEnviando(true);
    const f = new FormData(e.currentTarget);
    try {
      await login({ email: String(f.get('email')), password: String(f.get('password')) });
      await refrescar();
      navigate(volverA, { replace: true });
    } catch (err) {
      setError(err instanceof ApiError && err.code === 'DEMASIADOS_INTENTOS' ? 'Demasiados intentos. Espera unos minutos.' : 'Email o contraseña incorrectos.');
    } finally {
      setEnviando(false);
    }
  }

  return (
    <form onSubmit={enviar} className="mx-auto flex max-w-sm flex-col gap-4">
      <h1 className="text-2xl font-bold">Entrar</h1>
      {error && <Aviso tipo="error">{error}</Aviso>}
      <label className="flex flex-col gap-1 text-sm">Email<input name="email" type="email" required autoComplete="email" className="rounded border px-3 py-2" /></label>
      <label className="flex flex-col gap-1 text-sm">Contraseña<input name="password" type="password" required autoComplete="current-password" className="rounded border px-3 py-2" /></label>
      <button disabled={enviando} className="rounded bg-emerald-700 px-4 py-2 font-medium text-white disabled:opacity-50">Entrar</button>
      <p className="text-sm text-neutral-600">¿Sin cuenta? <Link to="/registro" className="underline">Crear una</Link></p>
    </form>
  );
}
