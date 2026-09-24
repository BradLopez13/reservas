import type { ButtonHTMLAttributes } from 'react';

type Props = ButtonHTMLAttributes<HTMLButtonElement> & { variante?: 'primario' | 'secundario' | 'peligro' };

const ESTILOS = {
  primario: 'rounded bg-emerald-700 px-4 py-2 font-medium text-white hover:bg-emerald-800 disabled:opacity-50',
  secundario: 'rounded border px-4 py-2 hover:bg-neutral-100',
  peligro: 'text-sm text-red-700 underline',
};

export function Boton({ variante = 'primario', className = '', ...props }: Props) {
  return <button {...props} className={`${ESTILOS[variante]} ${className}`} />;
}
