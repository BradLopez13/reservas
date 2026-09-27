import type { Deporte } from '@reservas/contracts';

interface Props { valor: Deporte | undefined; opciones: { valor: Deporte | undefined; texto: string }[]; onCambiar: (d: Deporte | undefined) => void }

export function FiltroDeporte({ valor, opciones, onCambiar }: Props) {
  return (
    <div className="flex gap-2" role="group" aria-label="Deporte">
      {opciones.map((o) => (
        <button key={o.texto} onClick={() => onCambiar(o.valor)} aria-pressed={valor === o.valor}
          className={`rounded-full border px-3 py-1 text-sm ${valor === o.valor ? 'bg-neutral-900 text-white' : 'bg-white'}`}>
          {o.texto}
        </button>
      ))}
    </div>
  );
}
