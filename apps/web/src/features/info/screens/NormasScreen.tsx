import { CalendarCheck, Clock, Prohibit, ShieldCheck, XCircle } from '@phosphor-icons/react';
import type { Icon } from '@phosphor-icons/react';
import { useT } from '../../../i18n/i18n.ts';
import { Pagina } from '../../../shared/components/Pagina.tsx';
import { FOTO_NORMAS } from '../../../shared/fotos.ts';
import { useTitulo } from '../../../shared/hooks/useTitulo.ts';

// Página estática: no tiene view-model. Un icono por norma, en el orden del diccionario.
const ICONOS: Icon[] = [Clock, CalendarCheck, XCircle, ShieldCheck, Prohibit];

export function NormasScreen() {
  const { t, d } = useT();
  useTitulo(t('normas.pestana'));
  const normas = d.normas.lista;
  return (
    <Pagina titulo={t('normas.titulo')} entradilla={t('normas.entradilla')} foto={FOTO_NORMAS}>
      <ul className="grid gap-4 sm:grid-cols-2">
        {normas.map(({ titulo, texto }, i) => {
          const Icono = ICONOS[i] ?? Clock;
          return (
            <li key={titulo} className={`flex flex-col gap-3 rounded-tarjeta border border-borde bg-superficie p-5 ${i === normas.length - 1 ? 'sm:col-span-2' : ''}`}>
              <span className="grid size-10 place-items-center rounded-ui bg-acento-suave text-acento"><Icono size={20} weight="duotone" aria-hidden="true" /></span>
              <h2 className="font-display text-lg font-semibold tracking-tight text-tinta">{titulo}</h2>
              <p className="text-sm leading-relaxed text-tinta-2">{texto}</p>
            </li>
          );
        })}
      </ul>
    </Pagina>
  );
}
