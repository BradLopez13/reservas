import type { ButtonHTMLAttributes, ReactNode } from 'react';

export type VarianteBoton = 'primario' | 'secundario' | 'peligro' | 'fantasma';
export type TamanoBoton = 'md' | 'sm';

type Props = ButtonHTMLAttributes<HTMLButtonElement> & { variante?: VarianteBoton; tamano?: TamanoBoton; icono?: ReactNode };

// Formas de la app: botones en píldora, tarjetas a 2rem, campos a 12px.
const BASE =
  'group inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full font-medium transition-[background-color,border-color,color,transform] duration-500 ease-suave ' +
  'active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50';

const VARIANTES: Record<VarianteBoton, string> = {
  primario: 'bg-acento text-sobre-acento hover:bg-acento-fuerte',
  secundario: 'border border-borde-fuerte bg-superficie/60 text-tinta backdrop-blur-md hover:border-tinta-3 hover:bg-superficie-2',
  peligro: 'text-error hover:bg-error-suave',
  fantasma: 'text-tinta-2 hover:bg-superficie-2 hover:text-tinta',
};

const TAMANOS: Record<TamanoBoton, string> = { md: 'h-12 pl-6 pr-6 text-[15px]', sm: 'h-10 px-4 text-sm' };

// Las mismas clases sirven para un <Link> que debe parecer un botón.
export const estilosBoton = (variante: VarianteBoton = 'primario', tamano: TamanoBoton = 'md') => `${BASE} ${VARIANTES[variante]} ${TAMANOS[tamano]}`;

// El icono final de un botón va dentro de su propio círculo, pegado al borde derecho.
export function IconoBoton({ children }: { children: ReactNode }) {
  return (
    <span aria-hidden="true" className="-mr-3 ml-1 grid size-8 place-items-center rounded-full bg-sobre-acento/10 transition-transform duration-500 ease-suave group-hover:translate-x-0.5 group-hover:scale-105">
      {children}
    </span>
  );
}

export function Boton({ variante = 'primario', tamano = 'md', icono, className = '', children, ...props }: Props) {
  return (
    <button {...props} className={`${estilosBoton(variante, tamano)} ${className}`}>
      {children}
      {icono && <IconoBoton>{icono}</IconoBoton>}
    </button>
  );
}
