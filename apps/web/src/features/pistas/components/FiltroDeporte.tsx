import type { Deporte } from '@reservas/contracts';
import { useT } from '../../../i18n/i18n.ts';
import { GrupoOpciones } from '../../../shared/components/GrupoOpciones.tsx';

interface Props { valor: Deporte | undefined; opciones: { valor: Deporte | undefined; texto: string }[]; onCambiar: (d: Deporte | undefined) => void }

// Pestañas de marcador: una regla con las opciones y la activa encendida en lima.
export function FiltroDeporte({ valor, opciones, onCambiar }: Props) {
  const { t } = useT();
  return (
    <GrupoOpciones
      etiqueta={t('deportes.filtro')}
      valor={valor}
      onCambiar={onCambiar}
      opciones={opciones.map((o) => ({ valor: o.valor, contenido: o.texto, clave: o.valor ?? 'todas' }))}
      className="flex flex-wrap gap-1 rounded-ui border border-borde bg-superficie/50 p-1 backdrop-blur-md"
      claseOpcion={(activa) =>
        `h-9 rounded-[6px] px-4 text-sm font-medium transition-[background-color,color,transform] duration-500 ease-suave active:scale-[0.98] ${
          activa ? 'bg-acento text-sobre-acento' : 'text-tinta-2 hover:bg-superficie-2 hover:text-tinta'
        }`}
    />
  );
}
