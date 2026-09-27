import type { Deporte } from '@reservas/contracts';
import { GrupoOpciones } from '../../../shared/components/GrupoOpciones.tsx';

interface Props { valor: Deporte | undefined; opciones: { valor: Deporte | undefined; texto: string }[]; onCambiar: (d: Deporte | undefined) => void }

export function FiltroDeporte({ valor, opciones, onCambiar }: Props) {
  return (
    <GrupoOpciones
      etiqueta="Deporte"
      valor={valor}
      onCambiar={onCambiar}
      opciones={opciones.map((o) => ({ valor: o.valor, contenido: o.texto, clave: o.texto }))}
      className="flex flex-wrap gap-1 rounded-full border border-borde bg-superficie/60 p-1 backdrop-blur-md"
      claseOpcion={(activa) =>
        `h-9 rounded-full px-4 text-sm font-medium transition-[background-color,color,transform] duration-500 ease-suave active:scale-[0.98] ${
          activa ? 'bg-acento text-sobre-acento' : 'text-tinta-2 hover:text-tinta'
        }`}
    />
  );
}
