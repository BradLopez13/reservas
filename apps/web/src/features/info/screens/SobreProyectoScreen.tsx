import { GithubLogo } from '@phosphor-icons/react';
import { useT } from '../../../i18n/i18n.ts';
import { estilosBoton } from '../../../shared/components/Boton.tsx';
import { REPO_URL } from '../../../shared/components/Layout.tsx';
import { Pagina } from '../../../shared/components/Pagina.tsx';
import { useTitulo } from '../../../shared/hooks/useTitulo.ts';
import { SpotlightCard } from '../../../shared/react-bits/SpotlightCard.tsx';

const STACK = ['TypeScript', 'Fastify', 'PostgreSQL', 'Drizzle', 'React 19', 'TanStack Query', 'Zod', 'Vite', 'Tailwind v4', 'Vitest', 'Playwright', 'Vercel', 'Supabase'];

// Página estática: no tiene view-model. Los textos salen del diccionario.
export function SobreProyectoScreen() {
  const { t, d } = useT();
  useTitulo(t('sobre.pestana'));
  return (
    <Pagina titulo={t('sobre.titulo')} entradilla={t('sobre.entradilla')}>
      <section className="flex flex-col gap-4">
        <h2 className="font-display text-2xl font-semibold tracking-tight text-tinta">{t('sobre.queDemuestra')}</h2>
        <ul className="grid gap-4 sm:grid-cols-2">
          {d.sobre.demuestra.map((x, i) => (
            <li key={x.titulo} className={i === 0 ? 'sm:col-span-2' : ''}>
              <SpotlightCard className="flex h-full flex-col gap-3 text-linea">
                <h3 className="font-display text-2xl font-semibold leading-tight tracking-tight">{x.titulo}</h3>
                <p className="max-w-[60ch] text-sm leading-relaxed text-linea-2">{x.texto}</p>
              </SpotlightCard>
            </li>
          ))}
        </ul>
      </section>

      <section className="flex flex-col gap-4">
        <h2 className="font-display text-2xl font-semibold tracking-tight text-tinta">{t('sobre.carreraTitulo')}</h2>
        <div className="texto">
          <p>{t('sobre.carreraA')}<code>PISTA_OCUPADA</code>{t('sobre.carreraB')}<code>EXCLUDE</code>{t('sobre.carreraC')}</p>
        </div>
        <pre className="overflow-x-auto rounded-ui bg-pista p-4 text-xs leading-relaxed text-linea"><code>{t('sobre.salidaTest')}</code></pre>
      </section>

      <section className="flex flex-col gap-4">
        <h2 className="font-display text-2xl font-semibold tracking-tight text-tinta">{t('sobre.conQue')}</h2>
        <ul className="flex flex-wrap gap-2">
          {STACK.map((s) => <li key={s} className="rounded-full border border-borde-fuerte bg-superficie px-3.5 py-1.5 text-sm text-tinta">{s}</li>)}
        </ul>
        <div className="texto"><p>{t('sobre.conQueTexto')}</p></div>
        <a href={REPO_URL} target="_blank" rel="noreferrer" className={`${estilosBoton('secundario')} self-start`}>
          <GithubLogo size={18} aria-hidden="true" />{t('sobre.verCodigo')}
        </a>
      </section>
    </Pagina>
  );
}
