import { useT } from '../../../i18n/i18n.ts';
import { REPO_URL } from '../../../shared/components/Layout.tsx';
import { Pagina } from '../../../shared/components/Pagina.tsx';
import { useTitulo } from '../../../shared/hooks/useTitulo.ts';

// Página estática: no tiene view-model. Los textos salen del diccionario.
export function PrivacidadScreen() {
  const { t, d } = useT();
  useTitulo(t('privacidad.pestana'));
  return (
    <Pagina titulo={t('privacidad.titulo')} entradilla={t('privacidad.entradilla')}>
      <div className="texto">
        <h2>{t('privacidad.queSeGuarda')}</h2>
        <ul>
          {d.privacidad.datos.map((x) => <li key={x.fuerte}><strong>{x.fuerte}</strong>{x.resto}</li>)}
        </ul>

        <h2>{t('privacidad.cookies')}</h2>
        <p>{t('privacidad.cookiesA')}<code>httpOnly</code>{t('privacidad.cookiesB')}</p>

        <h2>{t('privacidad.terceros')}</h2>
        <p>{t('privacidad.tercerosTexto')}</p>

        <h2>{t('privacidad.cuanto')}</h2>
        <p>
          {t('privacidad.cuantoA')}<a href={REPO_URL} target="_blank" rel="noreferrer">{t('privacidad.cuantoEnlace')}</a>{t('privacidad.cuantoB')}
        </p>
      </div>
    </Pagina>
  );
}
