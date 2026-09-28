import { Plus } from '@phosphor-icons/react';
import { Link } from 'react-router';
import { useT } from '../../../i18n/i18n.ts';
import { estilosBoton } from '../../../shared/components/Boton.tsx';
import { Pagina } from '../../../shared/components/Pagina.tsx';
import { FOTO_COMO_FUNCIONA } from '../../../shared/fotos.ts';
import { useTitulo } from '../../../shared/hooks/useTitulo.ts';

// Página estática: no tiene view-model. Los textos salen del diccionario.
// Los pasos van numerados en cifras grandes, en zigzag: los impares a la
// izquierda y los pares desplazados a la derecha.
export function ComoFuncionaScreen() {
  const { t, d } = useT();
  useTitulo(t('comoFunciona.pestana'));
  return (
    <Pagina rotulo={t('nav.informacion')} titulo={t('comoFunciona.titulo')} entradilla={t('comoFunciona.entradilla')} foto={FOTO_COMO_FUNCIONA}>
      <ol className="flex flex-col">
        {d.comoFunciona.pasos.map((paso, i) => (
          <li key={paso.titulo} className={`grid gap-4 border-t border-borde py-8 sm:grid-cols-12 ${i === d.comoFunciona.pasos.length - 1 ? 'border-b' : ''}`}>
            <span aria-hidden="true" className={`cifra text-5xl leading-none text-acento sm:col-span-3 sm:text-6xl ${i % 2 ? 'sm:col-start-3' : ''}`}>{String(i + 1).padStart(2, '0')}</span>
            <div className={`flex flex-col gap-2 sm:col-span-7 ${i % 2 ? 'sm:col-start-6' : 'sm:col-start-4'}`}>
              <h2 className="font-display text-2xl font-semibold tracking-tight text-tinta">{paso.titulo}</h2>
              <p className="max-w-[52ch] leading-relaxed text-tinta-2">{paso.texto}</p>
            </div>
          </li>
        ))}
      </ol>

      <section className="flex flex-col gap-5">
        <h2 className="font-display text-3xl font-semibold tracking-tight text-tinta">{t('comoFunciona.preguntas')}</h2>
        <div className="divide-y divide-borde border-y border-borde">
          {d.comoFunciona.faq.map((q, i) => (
            <details key={q.p} className="group py-5">
              <summary className="flex cursor-pointer list-none items-center gap-5 font-medium text-tinta marker:hidden [&::-webkit-details-marker]:hidden">
                <span aria-hidden="true" className="rotulo w-6 shrink-0 text-tinta-3">{String(i + 1).padStart(2, '0')}</span>
                <span className="flex-1">{q.p}</span>
                <Plus aria-hidden="true" size={16} weight="bold" className="shrink-0 text-tinta-3 transition-transform duration-300 ease-suave group-open:rotate-45" />
              </summary>
              <p className="max-w-[60ch] pl-11 pt-3 leading-relaxed text-tinta-2">{q.r}</p>
            </details>
          ))}
        </div>
      </section>

      <Link to="/#pistas" className={`${estilosBoton('primario')} self-start`}>{t('comoFunciona.verPistas')}</Link>
    </Pagina>
  );
}
