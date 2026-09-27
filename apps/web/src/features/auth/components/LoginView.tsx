import type { FormEvent } from 'react';
import { Link } from 'react-router';
import { Aviso } from '../../../shared/components/Aviso.tsx';
import { Boton } from '../../../shared/components/Boton.tsx';
import { Campo } from '../../../shared/components/Campo.tsx';
import { FOTO_ENTRAR } from '../../../shared/fotos.ts';
import { MarcoAcceso } from './MarcoAcceso.tsx';

export interface LoginViewProps { error: string | null; enviando: boolean; motivo: string | null; volverA: string; onSubmit: (e: FormEvent<HTMLFormElement>) => void }

export function LoginView({ error, enviando, motivo, volverA, onSubmit }: LoginViewProps) {
  return (
    <MarcoAcceso titulo="Entrar" subtitulo="Vuelve a tus reservas." foto={FOTO_ENTRAR}>
      <form onSubmit={onSubmit} className="flex flex-col gap-5">
        {motivo && <Aviso tipo="info">{motivo} Tu selección se conserva.</Aviso>}
        {error && <Aviso tipo="error">{error}</Aviso>}
        <Campo etiqueta="Email" name="email" type="email" required autoComplete="email" />
        <Campo etiqueta="Contraseña" name="password" type="password" required autoComplete="current-password" />
        <Boton disabled={enviando} className="mt-1">{enviando ? 'Entrando…' : 'Entrar'}</Boton>
        <p className="text-sm text-tinta-2">
          ¿Sin cuenta? <Link to="/registro" state={{ volverA }} className="font-medium text-acento underline underline-offset-4">Crear una</Link>
        </p>
      </form>
    </MarcoAcceso>
  );
}
