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
    <div className="mx-auto flex max-w-2xl flex-col gap-10">
      <header className="flex flex-col gap-2">
        <h1 className="font-display text-4xl font-semibold tracking-tight text-tinta">Ajustes</h1>
        <p className="text-tinta-2">La cuenta de {nombre}.</p>
      </header>

      <section className="grid gap-6 border-t border-borde pt-8 md:grid-cols-[220px_1fr]">
        <div className="flex flex-col gap-1">
          <h2 className="font-display text-xl font-semibold tracking-tight text-tinta">Contraseña</h2>
          <p className="text-sm text-tinta-2">Al cambiarla se cierran las demás sesiones.</p>
        </div>
        <form onSubmit={onSubmit} className="flex max-w-sm flex-col gap-5">
          {error && <Aviso tipo="error">{error}</Aviso>}
          {cambiada && <Aviso tipo="ok">Contraseña cambiada. Las demás sesiones se han cerrado.</Aviso>}
          <Campo etiqueta="Contraseña actual" name="actual" type="password" required autoComplete="current-password" />
          <Campo etiqueta="Contraseña nueva" ayuda="Mínimo 10 caracteres." name="nueva" type="password" required minLength={10} autoComplete="new-password" />
          <Boton disabled={enviando} className="self-start">{enviando ? 'Cambiando…' : 'Cambiar contraseña'}</Boton>
        </form>
      </section>

      <section className="grid gap-6 border-t border-borde pt-8 md:grid-cols-[220px_1fr]">
        <div className="flex flex-col gap-1">
          <h2 className="font-display text-xl font-semibold tracking-tight text-tinta">Sesiones</h2>
          <p className="text-sm text-tinta-2">Incluida esta: tendrás que volver a entrar.</p>
        </div>
        <Boton variante="secundario" className="self-start" onClick={onCerrarSesiones}>Cerrar sesión en todos los dispositivos</Boton>
      </section>
    </div>
  );
}
