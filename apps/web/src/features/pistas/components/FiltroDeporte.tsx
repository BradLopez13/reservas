import type { Deporte } from '@reservas/contracts';

interface Props { valor: Deporte | undefined; opciones: { valor: Deporte | undefined; texto: string }[]; onCambiar: (d: Deporte | undefined) => void }

export function FiltroDeporte({ valor, opciones, onCambiar }: Props) {
  return (
    <div className="flex flex-wrap gap-1 rounded-full border border-borde bg-superficie/60 p-1 backdrop-blur-md" role="group" aria-label="Deporte">
      {opciones.map((o) => {
        const activo = valor === o.valor;
        return (
          <button
            key={o.texto}
            type="button"
            onClick={() => onCambiar(o.valor)}
            aria-pressed={activo}
            className={`h-9 rounded-full px-4 text-sm font-medium transition-[background-color,color,transform] duration-500 ease-suave active:scale-[0.98] ${
              activo ? 'bg-acento text-sobre-acento' : 'text-tinta-2 hover:text-tinta'
            }`}
          >
            {o.texto}
          </button>
        );
      })}
    </div>
  );
}
