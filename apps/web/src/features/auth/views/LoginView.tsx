import type { FormEvent } from 'react';
import { Link } from 'react-router';
import { Aviso } from '../../../shared/components/Aviso.tsx';
import { Boton } from '../../../shared/components/Boton.tsx';
import { Campo } from '../../../shared/components/Campo.tsx';

export interface LoginViewProps { error: string | null; enviando: boolean; onSubmit: (e: FormEvent<HTMLFormElement>) => void }

export function LoginView({ error, enviando, onSubmit }: LoginViewProps) {
  return (
    <form onSubmit={onSubmit} className="mx-auto flex max-w-sm flex-col gap-4">
      <h1 className="text-2xl font-bold">Entrar</h1>
      {error && <Aviso tipo="error">{error}</Aviso>}
      <Campo etiqueta="Email" name="email" type="email" required autoComplete="email" />
      <Campo etiqueta="Contraseña" name="password" type="password" required autoComplete="current-password" />
      <Boton disabled={enviando}>Entrar</Boton>
      <p className="text-sm text-neutral-600">¿Sin cuenta? <Link to="/registro" className="underline">Crear una</Link></p>
    </form>
  );
}
