import { useState, type FormEvent } from 'react';

interface Opciones {
  enviar: (datos: FormData, form: HTMLFormElement) => Promise<void>;
  mensajeDeError: (e: unknown) => string;
}

// El ciclo de todo formulario de la app: bloquear el botón mientras se envía,
// traducir el error a un mensaje y limpiarlo en el siguiente intento.
export function useFormulario({ enviar, mensajeDeError }: Opciones) {
  const [error, setError] = useState<string | null>(null);
  const [enviando, setEnviando] = useState(false);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    setError(null);
    setEnviando(true);
    try {
      await enviar(new FormData(form), form);
    } catch (err) {
      setError(mensajeDeError(err));
    } finally {
      setEnviando(false);
    }
  }

  return { error, enviando, onSubmit };
}
