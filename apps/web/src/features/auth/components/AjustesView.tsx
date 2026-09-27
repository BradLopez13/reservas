import type { FormEvent } from 'react';
import { Aviso } from '../../../shared/components/Aviso.tsx';
import { Boton } from '../../../shared/components/Boton.tsx';
import { Campo } from '../../../shared/components/Campo.tsx';

export interface AjustesViewProps {
  nombre: string; error: string | null; enviando: boolean; cambiada: boolean;
  onSubmit: (e: FormEvent<HTMLFormElement>) => void; onCerrarSesiones: () => void;
}

export function AjustesView({ nombre, error, enviando, cambiada, onSubmit, onCerrarSesiones }: AjustesViewProps) {
  return (
    <div className="mx-auto flex max-w-sm flex-col gap-6">
      <h1 className="text-2xl font-bold">Cuenta de {nombre}</h1>
      <form onSubmit={onSubmit} className="flex flex-col gap-3">
        <h2 className="font-semibold">Cambiar contraseña</h2>
        {error && <Aviso tipo="error">{error}</Aviso>}
        {cambiada && <Aviso tipo="ok">Contraseña cambiada. Las demás sesiones se han cerrado.</Aviso>}
        <Campo etiqueta="Actual" name="actual" type="password" required autoComplete="current-password" />
        <Campo etiqueta="Nueva (mínimo 10 caracteres)" name="nueva" type="password" required minLength={10} autoComplete="new-password" />
        <Boton disabled={enviando}>Cambiar</Boton>
      </form>
      <div className="flex flex-col gap-2">
        <h2 className="font-semibold">Sesiones</h2>
        <Boton variante="secundario" className="text-left" onClick={onCerrarSesiones}>Cerrar sesión en todos los dispositivos</Boton>
      </div>
    </div>
  );
}
