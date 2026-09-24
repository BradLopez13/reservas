import type { InputHTMLAttributes } from 'react';

// Etiqueta + input, con la etiqueta envolviendo al input para que los tests y
// los lectores de pantalla los asocien sin ids.
export function Campo({ etiqueta, ...props }: InputHTMLAttributes<HTMLInputElement> & { etiqueta: string }) {
  return (
    <label className="flex flex-col gap-1 text-sm">
      {etiqueta}
      <input {...props} className="rounded border px-3 py-2" />
    </label>
  );
}
