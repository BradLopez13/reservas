import { Compass } from '@phosphor-icons/react';
import { Link } from 'react-router';
import { estilosBoton } from '../../../shared/components/Boton.tsx';
import { Vacio } from '../../../shared/components/Vacio.tsx';

export function NoEncontradaScreen() {
  return (
    <div className="mx-auto max-w-xl py-10">
      <Vacio Icono={Compass} titulo="Esta página no existe" accion={<Link to="/" className={estilosBoton('primario', 'sm')}>Ver pistas</Link>}>
        Puede que el enlace esté mal escrito o que la página haya cambiado de sitio.
      </Vacio>
    </div>
  );
}
