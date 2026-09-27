import type { FormEvent } from 'react';
import { Link } from 'react-router';
import { useT } from '../../../i18n/i18n.ts';
import { Aviso } from '../../../shared/components/Aviso.tsx';
import { Boton } from '../../../shared/components/Boton.tsx';
import { Campo } from '../../../shared/components/Campo.tsx';
import { FOTO_ENTRAR } from '../../../shared/fotos.ts';
import type { ErroresCampo } from '../../../shared/hooks/useFormulario.ts';
import { MarcoAcceso } from './MarcoAcceso.tsx';

export interface LoginViewProps {
  error: string | null; errores: ErroresCampo; enviando: boolean; motivo: string | null; volverA: string;
  onSubmit: (e: FormEvent<HTMLFormElement>) => void;
}

export function LoginView({ error, errores, enviando, motivo, volverA, onSubmit }: LoginViewProps) {
  const { t } = useT();
  return (
    <MarcoAcceso titulo={t('auth.entrar')} subtitulo={t('auth.entrarSubtitulo')} foto={FOTO_ENTRAR}>
      <form onSubmit={onSubmit} noValidate className="flex flex-col gap-5">
        {motivo && <Aviso tipo="info">{motivo} {t('auth.seleccionConservada')}</Aviso>}
        {error && <Aviso tipo="error">{error}</Aviso>}
        <Campo etiqueta={t('auth.email')} name="email" type="email" required autoComplete="email" error={errores.email} />
        <Campo etiqueta={t('auth.password')} name="password" type="password" required autoComplete="current-password" error={errores.password} />
        <Boton disabled={enviando} className="mt-1">{enviando ? t('auth.entrando') : t('auth.entrar')}</Boton>
        <p className="text-sm text-tinta-2">
          {t('auth.sinCuenta')} <Link to="/registro" state={{ volverA }} className="font-medium text-acento underline underline-offset-4">{t('auth.crearUna')}</Link>
        </p>
      </form>
    </MarcoAcceso>
  );
}
