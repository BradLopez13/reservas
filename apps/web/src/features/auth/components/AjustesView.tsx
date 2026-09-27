import type { FormEvent } from 'react';
import { useT } from '../../../i18n/i18n.ts';
import { Aviso } from '../../../shared/components/Aviso.tsx';
import { Boton } from '../../../shared/components/Boton.tsx';
import { Campo } from '../../../shared/components/Campo.tsx';
import type { ErroresCampo } from '../../../shared/hooks/useFormulario.ts';

export interface AjustesViewProps {
  nombre: string; error: string | null; errores: ErroresCampo; enviando: boolean; cambiada: boolean;
  onSubmit: (e: FormEvent<HTMLFormElement>) => void; onCerrarSesiones: () => void;
}

export function AjustesView({ nombre, error, errores, enviando, cambiada, onSubmit, onCerrarSesiones }: AjustesViewProps) {
  const { t } = useT();
  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-10">
      <header className="flex flex-col gap-2">
        <h1 className="font-display text-4xl font-semibold tracking-tight text-tinta">{t('ajustes.titulo')}</h1>
        <p className="text-tinta-2">{t('ajustes.cuentaDe', { nombre })}</p>
      </header>

      <section className="grid gap-6 border-t border-borde pt-8 md:grid-cols-[220px_1fr]">
        <div className="flex flex-col gap-1">
          <h2 className="font-display text-xl font-semibold tracking-tight text-tinta">{t('ajustes.password')}</h2>
          <p className="text-sm text-tinta-2">{t('ajustes.passwordTexto')}</p>
        </div>
        <form onSubmit={onSubmit} noValidate className="flex max-w-sm flex-col gap-5">
          {error && <Aviso tipo="error">{error}</Aviso>}
          {cambiada && <Aviso tipo="ok">{t('ajustes.cambiada')}</Aviso>}
          <Campo etiqueta={t('ajustes.actual')} name="actual" type="password" required autoComplete="current-password" error={errores.actual} />
          <Campo etiqueta={t('ajustes.nueva')} ayuda={t('ajustes.nuevaAyuda')} name="nueva" type="password" required minLength={10} autoComplete="new-password" error={errores.nueva} />
          <Boton disabled={enviando} className="self-start">{enviando ? t('ajustes.cambiando') : t('ajustes.cambiar')}</Boton>
        </form>
      </section>

      <section className="grid gap-6 border-t border-borde pt-8 md:grid-cols-[220px_1fr]">
        <div className="flex flex-col gap-1">
          <h2 className="font-display text-xl font-semibold tracking-tight text-tinta">{t('ajustes.sesiones')}</h2>
          <p className="text-sm text-tinta-2">{t('ajustes.sesionesTexto')}</p>
        </div>
        <Boton variante="secundario" className="self-start" onClick={onCerrarSesiones}>{t('ajustes.cerrarTodas')}</Boton>
      </section>
    </div>
  );
}
