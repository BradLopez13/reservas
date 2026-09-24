import { useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router';
import { registro } from '../../api/auth.ts';
import { ApiError } from '../../api/errores.ts';
import { Aviso } from '../../components/Aviso.tsx';
import { useSesion } from './SesionProvider.tsx';

export function RegistroPage() {
  const { refrescar } = useSesion();
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const [enviando, setEnviando] = useState(false);

  async function enviar(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setEnviando(true);
    const f = new FormData(e.currentTarget);
    try {
      await registro({ nombre: String(f.get('nombre')), email: String(f.get('email')), password: String(f.get('password')) });
      await refrescar();
      navigate('/', { replace: true });
    } catch (err) {
      setError(err instanceof ApiError && err.code === 'EMAIL_EN_USO' ? 'Ya existe una cuenta con ese email.' : 'Revisa los datos: la contraseña necesita al menos 10 caracteres.');
    } finally {
      setEnviando(false);
    }
  }

  return (
    <form onSubmit={enviar} className="mx-auto flex max-w-sm flex-col gap-4">
      <h1 className="text-2xl font-bold">Crear cuenta</h1>
      {error && <Aviso tipo="error">{error}</Aviso>}
      <label className="flex flex-col gap-1 text-sm">Nombre<input name="nombre" required maxLength={60} className="rounded border px-3 py-2" /></label>
      <label className="flex flex-col gap-1 text-sm">Email<input name="email" type="email" required autoComplete="email" className="rounded border px-3 py-2" /></label>
      <label className="flex flex-col gap-1 text-sm">Contraseña (mínimo 10 caracteres)<input name="password" type="password" required minLength={10} autoComplete="new-password" className="rounded border px-3 py-2" /></label>
      <button disabled={enviando} className="rounded bg-emerald-700 px-4 py-2 font-medium text-white disabled:opacity-50">Crear cuenta</button>
    </form>
  );
}
