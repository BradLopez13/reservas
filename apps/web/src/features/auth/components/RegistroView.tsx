import type { FormEvent } from 'react';
import { Link } from 'react-router';
import { useT } from '../../../i18n/i18n.ts';
import { Aviso } from '../../../shared/components/Aviso.tsx';
import { Boton } from '../../../shared/components/Boton.tsx';
import { Campo } from '../../../shared/components/Campo.tsx';
import { FOTO_REGISTRO } from '../../../shared/fotos.ts';
import type { ErroresCampo } from '../../../shared/hooks/useFormulario.ts';
import { MarcoAcceso } from './MarcoAcceso.tsx';

export interface RegistroViewProps { error: string | null; errores: ErroresCampo; enviando: boolean; onSubmit: (e: FormEvent<HTMLFormElement>) => void }

export function RegistroView({ error, errores, enviando, onSubmit }: RegistroViewProps) {
  const { t } = useT();
  return (
    <MarcoAcceso titulo={t('auth.crearCuenta')} subtitulo={t('auth.crearSubtitulo')} foto={FOTO_REGISTRO}>
      <form onSubmit={onSubmit} noValidate className="flex flex-col gap-5">
        {error && <Aviso tipo="error">{error}</Aviso>}
        <Campo etiqueta={t('auth.nombre')} name="nombre" required maxLength={60} autoComplete="name" error={errores.nombre} />
        <Campo etiqueta={t('auth.email')} name="email" type="email" required autoComplete="email" error={errores.email} />
        <Campo etiqueta={t('auth.password')} ayuda={t('auth.passwordAyuda')} name="password" type="password" required minLength={10} autoComplete="new-password" error={errores.password} />
        <Boton disabled={enviando} className="mt-1">{enviando ? t('auth.creando') : t('auth.crearCuenta')}</Boton>
        <p className="text-sm text-tinta-2">{t('auth.yaTienesCuenta')} <Link to="/login" className="font-medium text-acento underline underline-offset-4">{t('auth.entrar')}</Link></p>
      </form>
    </MarcoAcceso>
  );
}
