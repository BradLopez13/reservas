import { CalendarCheck, Clock, Prohibit, ShieldCheck, XCircle } from '@phosphor-icons/react';
import type { Icon } from '@phosphor-icons/react';
import { useT } from '../../../i18n/i18n.ts';
import { Pagina } from '../../../shared/components/Pagina.tsx';
import { FOTO_NORMAS } from '../../../shared/fotos.ts';
import { useTitulo } from '../../../shared/hooks/useTitulo.ts';

// Página estática: no tiene view-model. Un icono por norma, en el orden del
// diccionario; las normas son un reglamento numerado, no tarjetas.
const ICONOS: Icon[] = [Clock, CalendarCheck, XCircle, ShieldCheck, Prohibit];

export function NormasScreen() {
  const { t, d } = useT();
  useTitulo(t('normas.pestana'));
  const normas = d.normas.lista;
  return (
    <Pagina rotulo={t('nav.informacion')} titulo={t('normas.titulo')} entradilla={t('normas.entradilla')} foto={FOTO_NORMAS}>
      <ol className="border-t border-borde">
        {normas.map(({ titulo, texto }, i) => {
          const Icono = ICONOS[i] ?? Clock;
          return (
            <li key={titulo} className="grid gap-4 border-b border-borde py-7 sm:grid-cols-[4rem_3rem_1fr] sm:gap-6">
              <span aria-hidden="true" className="cifra text-3xl leading-none text-acento">{String(i + 1).padStart(2, '0')}</span>
              <span className="hidden size-10 place-items-center rounded-ui bg-superficie text-tinta-2 sm:grid"><Icono size={20} weight="duotone" aria-hidden="true" /></span>
              <div className="flex flex-col gap-2">
                <h2 className="font-display text-2xl font-semibold tracking-tight text-tinta">{titulo}</h2>
                <p className="max-w-[60ch] leading-relaxed text-tinta-2">{texto}</p>
              </div>
            </li>
          );
        })}
      </ol>
    </Pagina>
  );
}
