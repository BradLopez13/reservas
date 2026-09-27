import { Eye, EyeSlash } from '@phosphor-icons/react';
import { useId, useState, type InputHTMLAttributes } from 'react';
import { useT } from '../../i18n/i18n.ts';

interface Props extends InputHTMLAttributes<HTMLInputElement> { etiqueta: string; ayuda?: string; error?: string | undefined }

// Etiqueta encima del input, asociada por id. La ayuda y el error se enlazan
// con aria-describedby; el error se anuncia al aparecer. Las contraseñas se
// pueden mostrar con un botón que queda fuera de la etiqueta para no robarle
// el clic al campo.
export function Campo({ etiqueta, ayuda, error, type, className = '', ...props }: Props) {
  const { t } = useT();
  const id = useId();
  const idAyuda = `${id}-ayuda`;
  const idError = `${id}-error`;
  const [visible, setVisible] = useState(false);
  const esPassword = type === 'password';
  const descritoPor = [ayuda ? idAyuda : null, error ? idError : null].filter(Boolean).join(' ') || undefined;
  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      <label htmlFor={id} className="text-sm font-medium text-tinta">{etiqueta}</label>
      <div className="relative flex">
        <input
          {...props}
          id={id}
          type={esPassword && visible ? 'text' : type}
          aria-describedby={descritoPor}
          aria-invalid={error ? true : undefined}
          className={`h-11 w-full rounded-ui border bg-superficie px-3.5 text-base text-tinta transition-[border-color,box-shadow] duration-200 placeholder:text-tinta-3 focus:shadow-[0_0_0_4px_var(--color-acento-suave)] focus:outline-none ${
            error ? 'border-error focus:border-error' : 'border-borde-fuerte focus:border-acento'
          } ${esPassword ? 'pr-12' : ''}`}
        />
        {esPassword && (
          <button
            type="button"
            onClick={() => setVisible((v) => !v)}
            aria-pressed={visible}
            aria-label={visible ? t('auth.ocultarPassword') : t('auth.mostrarPassword')}
            className="absolute inset-y-0 right-0 grid w-11 place-items-center rounded-r-ui text-tinta-2 transition-colors hover:text-tinta"
          >
            {visible ? <EyeSlash size={18} weight="light" /> : <Eye size={18} weight="light" />}
          </button>
        )}
      </div>
      {ayuda && <p id={idAyuda} className="text-xs text-tinta-2">{ayuda}</p>}
      <p id={idError} aria-live="polite" className={`text-xs font-medium text-error ${error ? '' : 'sr-only'}`}>{error}</p>
    </div>
  );
}
