import type { FormEvent } from 'react';
import { Link } from 'react-router';
import { Aviso } from '../../../shared/components/Aviso.tsx';
import { Boton } from '../../../shared/components/Boton.tsx';
import { Campo } from '../../../shared/components/Campo.tsx';
import { FOTO_REGISTRO } from '../../../shared/fotos.ts';
import { MarcoAcceso } from './MarcoAcceso.tsx';

export interface RegistroViewProps { error: string | null; enviando: boolean; onSubmit: (e: FormEvent<HTMLFormElement>) => void }

export function RegistroView({ error, enviando, onSubmit }: RegistroViewProps) {
  return (
    <MarcoAcceso titulo="Crear cuenta" subtitulo="Solo hace falta un nombre, un email y una contraseña." foto={FOTO_REGISTRO}>
      <form onSubmit={onSubmit} className="flex flex-col gap-5">
        {error && <Aviso tipo="error">{error}</Aviso>}
        <Campo etiqueta="Nombre" name="nombre" required maxLength={60} autoComplete="name" />
        <Campo etiqueta="Email" name="email" type="email" required autoComplete="email" />
        <Campo etiqueta="Contraseña" ayuda="Mínimo 10 caracteres. Sin más reglas." name="password" type="password" required minLength={10} autoComplete="new-password" />
        <Boton disabled={enviando} className="mt-1">{enviando ? 'Creando cuenta…' : 'Crear cuenta'}</Boton>
        <p className="text-sm text-tinta-2">¿Ya tienes cuenta? <Link to="/login" className="font-medium text-acento underline underline-offset-4">Entrar</Link></p>
      </form>
    </MarcoAcceso>
  );
}
