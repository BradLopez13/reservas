import { useState, type FormEvent } from 'react';
import { t } from '../../i18n/i18n.ts';

interface Opciones {
  enviar: (datos: FormData, form: HTMLFormElement) => Promise<void>;
  mensajeDeError: (e: unknown) => string;
}

export type ErroresCampo = Record<string, string>;

// Mensaje propio, en el idioma de la app, para cada tipo de fallo de validación del navegador.
export function mensajeDeValidez(campo: HTMLInputElement): string | null {
  const v = campo.validity;
  if (v.valid) return null;
  if (v.valueMissing) return t('validacion.obligatorio');
  if (v.typeMismatch) return t('validacion.email');
  if (v.tooShort) return t('validacion.minimo', { n: campo.minLength });
  if (v.tooLong) return t('validacion.maximo', { n: campo.maxLength });
  return t('validacion.revisa');
}

// Errores de cada campo del formulario, por su atributo name. Vacío si todo es válido.
export function erroresDe(form: HTMLFormElement): ErroresCampo {
  const errores: ErroresCampo = {};
  for (const campo of Array.from(form.querySelectorAll('input[name]')) as HTMLInputElement[]) {
    const m = mensajeDeValidez(campo);
    if (m) errores[campo.name] = m;
  }
  return errores;
}

// El ciclo de todo formulario de la app: validar campo a campo antes de enviar,
// bloquear el botón mientras se envía, traducir el error a un mensaje y
// limpiarlo en el siguiente intento. Los formularios llevan noValidate para
// que los mensajes sean estos y no los del navegador.
export function useFormulario({ enviar, mensajeDeError }: Opciones) {
  const [error, setError] = useState<string | null>(null);
  const [errores, setErrores] = useState<ErroresCampo>({});
  const [enviando, setEnviando] = useState(false);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    setError(null);
    const invalidos = erroresDe(form);
    setErrores(invalidos);
    if (Object.keys(invalidos).length > 0) {
      (form.querySelector(`[name="${Object.keys(invalidos)[0]}"]`) as HTMLElement | null)?.focus();
      return;
    }
    setEnviando(true);
    try {
      await enviar(new FormData(form), form);
    } catch (err) {
      setError(mensajeDeError(err));
    } finally {
      setEnviando(false);
    }
  }

  return { error, errores, enviando, onSubmit };
}
