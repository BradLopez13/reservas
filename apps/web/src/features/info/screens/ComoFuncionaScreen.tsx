import { Link } from 'react-router';
import { useT } from '../../../i18n/i18n.ts';
import { estilosBoton } from '../../../shared/components/Boton.tsx';
import { Pagina } from '../../../shared/components/Pagina.tsx';
import { FOTO_COMO_FUNCIONA } from '../../../shared/fotos.ts';
import { useTitulo } from '../../../shared/hooks/useTitulo.ts';

// Página estática: no tiene view-model. Los textos salen del diccionario.
export function ComoFuncionaScreen() {
  const { t, d } = useT();
  useTitulo(t('comoFunciona.pestana'));
  return (
    <Pagina titulo={t('comoFunciona.titulo')} entradilla={t('comoFunciona.entradilla')} foto={FOTO_COMO_FUNCIONA}>
      <ol className="grid gap-4 sm:grid-cols-2">
        {d.comoFunciona.pasos.map((paso, i) => (
          <li key={paso.titulo} className="flex gap-4 rounded-tarjeta border border-borde bg-superficie p-5">
            <span className="grid size-9 shrink-0 place-items-center rounded-full bg-acento-suave font-display text-sm font-semibold text-acento">{i + 1}</span>
            <div className="flex flex-col gap-1">
              <h2 className="font-display text-lg font-semibold tracking-tight text-tinta">{paso.titulo}</h2>
              <p className="text-sm leading-relaxed text-tinta-2">{paso.texto}</p>
            </div>
          </li>
        ))}
      </ol>

      <section className="flex flex-col gap-4">
        <h2 className="font-display text-2xl font-semibold tracking-tight text-tinta">{t('comoFunciona.preguntas')}</h2>
        <div className="divide-y divide-borde border-y border-borde">
          {d.comoFunciona.faq.map((q) => (
            <details key={q.p} className="group py-4">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-medium text-tinta marker:hidden [&::-webkit-details-marker]:hidden">
                {q.p}
                <span aria-hidden="true" className="text-tinta-3 transition-transform duration-200 group-open:rotate-45">+</span>
              </summary>
              <p className="pt-3 text-sm leading-relaxed text-tinta-2">{q.r}</p>
            </details>
          ))}
        </div>
      </section>

      <Link to="/" className={`${estilosBoton('primario')} self-start`}>{t('comoFunciona.verPistas')}</Link>
    </Pagina>
  );
}
