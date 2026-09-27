import { useId, type InputHTMLAttributes } from 'react';

// Etiqueta encima del input, con la etiqueta envolviendo al input para que los
// tests y los lectores de pantalla los asocien sin ids. La ayuda va fuera de la
// etiqueta y se enlaza con aria-describedby, para no ensuciar el nombre del campo.
export function Campo({ etiqueta, ayuda, ...props }: InputHTMLAttributes<HTMLInputElement> & { etiqueta: string; ayuda?: string }) {
  const idAyuda = useId();
  return (
    <div className="flex flex-col gap-1.5">
      <label className="flex flex-col gap-1.5 text-sm font-medium text-tinta">
        {etiqueta}
        <input
          {...props}
          aria-describedby={ayuda ? idAyuda : undefined}
          className="h-11 rounded-ui border border-borde-fuerte bg-superficie px-3.5 text-base font-normal text-tinta transition-[border-color,box-shadow] duration-200 placeholder:text-tinta-3 focus:border-acento focus:shadow-[0_0_0_4px_var(--color-acento-suave)] focus:outline-none"
        />
      </label>
      {ayuda && <p id={idAyuda} className="text-xs text-tinta-2">{ayuda}</p>}
    </div>
  );
}
