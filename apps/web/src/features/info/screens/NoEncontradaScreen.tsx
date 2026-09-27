import { Compass } from '@phosphor-icons/react';
import { Link } from 'react-router';
import { useT } from '../../../i18n/i18n.ts';
import { estilosBoton } from '../../../shared/components/Boton.tsx';
import { Vacio } from '../../../shared/components/Vacio.tsx';
import { useTitulo } from '../../../shared/hooks/useTitulo.ts';

export function NoEncontradaScreen() {
  const { t } = useT();
  useTitulo(t('noEncontrada.pestana'));
  return (
    <div className="mx-auto max-w-xl py-10">
      <Vacio Icono={Compass} titulo={t('noEncontrada.titulo')} accion={<Link to="/" className={estilosBoton('primario', 'sm')}>{t('noEncontrada.verPistas')}</Link>}>
        {t('noEncontrada.texto')}
      </Vacio>
    </div>
  );
}
