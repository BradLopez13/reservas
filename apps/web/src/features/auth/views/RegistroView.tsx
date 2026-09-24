import type { FormEvent } from 'react';
import { Aviso } from '../../../shared/components/Aviso.tsx';
import { Boton } from '../../../shared/components/Boton.tsx';
import { Campo } from '../../../shared/components/Campo.tsx';

export interface RegistroViewProps { error: string | null; enviando: boolean; onSubmit: (e: FormEvent<HTMLFormElement>) => void }

export function RegistroView({ error, enviando, onSubmit }: RegistroViewProps) {
  return (
    <form onSubmit={onSubmit} className="mx-auto flex max-w-sm flex-col gap-4">
      <h1 className="text-2xl font-bold">Crear cuenta</h1>
      {error && <Aviso tipo="error">{error}</Aviso>}
      <Campo etiqueta="Nombre" name="nombre" required maxLength={60} />
      <Campo etiqueta="Email" name="email" type="email" required autoComplete="email" />
      <Campo etiqueta="Contraseña (mínimo 10 caracteres)" name="password" type="password" required minLength={10} autoComplete="new-password" />
      <Boton disabled={enviando}>Crear cuenta</Boton>
    </form>
  );
}
