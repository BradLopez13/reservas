import type { ReactNode } from 'react';
import { useT } from '../../../i18n/i18n.ts';
import { LineasPista } from '../../../shared/components/LineasPista.tsx';
import { RelojMadrid } from '../../../shared/components/RelojMadrid.tsx';
import type { Foto } from '../../../shared/fotos.ts';

// Marco de las pantallas de entrar y crear cuenta: formulario a la izquierda;
// a la derecha, en escritorio, la fotografía con la esquina grande y las
// líneas de la pista encima.
export function MarcoAcceso({ titulo, subtitulo, foto, children }: { titulo: string; subtitulo: string; foto: Foto; children: ReactNode }) {
  const { t } = useT();
  return (
    <div className="grid items-center gap-12 lg:min-h-[70vh] lg:grid-cols-12">
      <div className="mx-auto flex w-full max-w-sm flex-col gap-8 lg:col-span-5 lg:col-start-2">
        <header className="flex flex-col gap-3">
          <p className="rotulo uppercase text-tinta-3">{t('app.nombre')}</p>
          <h1 className="font-display text-5xl font-semibold tracking-[-0.03em] text-tinta">{titulo}</h1>
          <p className="text-tinta-2">{subtitulo}</p>
        </header>
        {children}
      </div>
      <div className="relative hidden overflow-hidden rounded-[var(--radius-esquina)_var(--radius-ui)_var(--radius-esquina)_var(--radius-ui)] bg-pista lg:col-span-5 lg:col-start-8 lg:block">
        <img src={foto.src} alt={t(foto.alt)} loading="lazy" className="aspect-[4/5] w-full object-cover saturate-[0.85]" />
        <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-pista-2/80 via-transparent to-transparent" />
        <LineasPista className="opacity-[0.18]" />
        <RelojMadrid className="absolute bottom-6 left-6" />
      </div>
    </div>
  );
}
