import { ArrowDown, ArrowRight, MagnifyingGlass } from '@phosphor-icons/react';
import { Link } from 'react-router';
import type { Deporte } from '@reservas/contracts';
import { estilosBoton, IconoBoton } from '../../../shared/components/Boton.tsx';
import { Cargando, Esqueleto } from '../../../shared/components/Esqueleto.tsx';
import { ImagenEscala } from '../../../shared/components/ImagenEscala.tsx';
import { LineasPista } from '../../../shared/components/LineasPista.tsx';
import { TextoRevelado } from '../../../shared/components/TextoRevelado.tsx';
import { Vacio } from '../../../shared/components/Vacio.tsx';
import { FOTO_CARRERA, FOTO_PORTADA_ANCHA } from '../../../shared/fotos.ts';
import { BlurText } from '../../../shared/react-bits/BlurText.tsx';
import { CountUp } from '../../../shared/react-bits/CountUp.tsx';
import { Magnet } from '../../../shared/react-bits/Magnet.tsx';
import type { PistaVista } from '../hooks/usePistas.ts';
import { FiltroDeporte } from './FiltroDeporte.tsx';
import { PistaCard } from './PistaCard.tsx';

export interface PistasViewProps {
  deporte: Deporte | undefined;
  filtros: { valor: Deporte | undefined; texto: string }[];
  pistas: PistaVista[];
  cargando: boolean;
  conSesion: boolean;
  onFiltrar: (d: Deporte | undefined) => void;
}

// Bento de 12 columnas sin huecos. Cada bloque de cinco pistas cierra tres
// filas exactas ([8×2, 4, 4, 6, 6]: 8+4, 8 (sigue)+4, 6+6) y el resto, de
// una a cuatro pistas, usa su propio patrón cerrado.
const PATRONES: Record<number, string[]> = {
  1: ['md:col-span-12 md:row-span-2'],
  2: ['md:col-span-7 md:row-span-2', 'md:col-span-5 md:row-span-2'],
  3: ['md:col-span-8 md:row-span-2', 'md:col-span-4', 'md:col-span-4'],
  4: ['md:col-span-8 md:row-span-2', 'md:col-span-4', 'md:col-span-4', 'md:col-span-12'],
  5: ['md:col-span-8 md:row-span-2', 'md:col-span-4', 'md:col-span-4', 'md:col-span-6', 'md:col-span-6'],
};
export function claseCelda(i: number, n: number) {
  const resto = n % 5;
  const inicioResto = n - resto;
  return i < inicioResto ? PATRONES[5]![i % 5]! : PATRONES[resto]![i - inicioResto]!;
}

export function PistasView({ deporte, filtros, pistas, cargando, conSesion, onFiltrar }: PistasViewProps) {
  return (
    <div className="flex flex-col">
      {/* Atención: la pista a sangre, con las líneas dibujadas sobre la foto. */}
      <section className="relative -mt-24 flex min-h-[100dvh] items-center justify-center overflow-hidden px-4 pb-24 pt-32">
        <img src={FOTO_PORTADA_ANCHA.src} alt="" fetchPriority="high" className="absolute inset-0 size-full object-cover object-[50%_35%] saturate-[0.85]" />
        <div aria-hidden="true" className="absolute inset-0 bg-[radial-gradient(70%_60%_at_50%_45%,oklch(19%_0.045_160/0.55),oklch(19%_0.045_160/0.9))]" />
        <div aria-hidden="true" className="absolute inset-x-0 bottom-0 h-64 bg-gradient-to-t from-fondo to-transparent" />
        <LineasPista className="opacity-[0.16]" />
        <div className="relative mx-auto flex w-full max-w-5xl flex-col items-center gap-8 text-center">
          {/* El titular animado es decorativo; el h1 real es el que leen los lectores de pantalla. */}
          <h1 className="sr-only">Tu próximo partido empieza aquí</h1>
          <div aria-hidden="true">
            <BlurText
              text="Tu próximo partido empieza aquí."
              className="justify-center font-display text-[clamp(3rem,7.2vw,6.25rem)] font-bold leading-[0.95] tracking-[-0.035em] text-tinta"
            />
          </div>
          <p className="max-w-[44ch] text-lg leading-relaxed text-tinta-2 sm:text-xl">
            Pádel, tenis y fútbol en Madrid. Elige el día, mira las horas libres y reserva en dos clics.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Magnet>
              <a href="#pistas" className={estilosBoton('primario')}>Ver pistas<IconoBoton><ArrowDown size={16} weight="bold" /></IconoBoton></a>
            </Magnet>
            {!conSesion && <Link to="/registro" className={estilosBoton('secundario')}>Crear cuenta</Link>}
          </div>
        </div>
      </section>

      {/* Interés: las pistas en un bento sin huecos. */}
      <section id="pistas" className="mx-auto w-full max-w-6xl scroll-mt-28 px-4 py-24 sm:px-6 md:py-32">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <h2 className="font-display text-4xl font-semibold tracking-tight text-tinta sm:text-5xl">Pistas</h2>
          <FiltroDeporte valor={deporte} opciones={filtros} onCambiar={onFiltrar} />
        </div>
        {cargando ? (
          <>
            <Cargando que="pistas" />
            <div className="grid grid-flow-dense grid-cols-1 gap-4 md:auto-rows-[220px] md:grid-cols-12" aria-hidden="true">
              {[0, 1, 2, 3, 4].map((i) => <Esqueleto key={i} className={`h-56 rounded-tarjeta md:h-auto ${claseCelda(i, 5)}`} />)}
            </div>
          </>
        ) : pistas.length === 0 ? (
          <Vacio Icono={MagnifyingGlass} titulo="No hay pistas de ese deporte">
            Prueba con otro filtro o mira todas las pistas.
          </Vacio>
        ) : (
          <ul className="grid grid-flow-dense grid-cols-1 gap-4 md:auto-rows-[220px] md:grid-cols-12">
            {pistas.map((p, i) => (
              <li key={p.id} className={`h-72 md:h-auto ${claseCelda(i, pistas.length)}`}>
                <PistaCard pista={p} indice={i} grande={claseCelda(i, pistas.length).includes('row-span-2')} />
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* Deseo: la carrera de cincuenta, contada al ritmo del scroll. */}
      <section className="mx-auto grid w-full max-w-6xl items-center gap-12 px-4 py-24 sm:px-6 md:py-40 lg:grid-cols-12 lg:gap-16">
        <div className="flex flex-col gap-8 lg:col-span-7">
          <p className="font-display text-[6rem] font-bold leading-none tracking-[-0.04em] text-tinta sm:text-[9rem]">
            <CountUp hasta={50} className="tabular-nums" />
            <span className="mx-3 text-tinta-3 sm:mx-5" aria-hidden="true">/</span>
            <CountUp hasta={1} className="tabular-nums text-acento" />
          </p>
          <TextoRevelado
            texto="Cincuenta personas pulsan Reservar a la vez sobre la última hora libre. Una consigue la pista. Las otras cuarenta y nueve lo saben al instante y ven la franja como ocupada. Esta app existe para demostrar cómo se construye eso, y el test que lo comprueba corre contra una base de datos real."
            className="max-w-[40ch] font-display text-2xl font-medium leading-snug tracking-tight text-tinta sm:text-3xl"
          />
          <Link to="/sobre-el-proyecto" className={`${estilosBoton('secundario')} self-start`}>
            Sobre el proyecto<IconoBoton><ArrowRight size={16} weight="bold" /></IconoBoton>
          </Link>
        </div>
        <ImagenEscala src={FOTO_CARRERA.src} alt={FOTO_CARRERA.alt} className="lg:col-span-5" />
      </section>

      {/* Acción: una sola llamada, grande. */}
      <section className="mx-auto w-full max-w-6xl px-4 pb-8 sm:px-6">
        <div className="bisel">
          <div className="relative overflow-hidden bg-pista px-6 py-20 text-center sm:px-10 md:py-28">
            <LineasPista className="opacity-[0.09]" />
            <div className="relative mx-auto flex max-w-3xl flex-col items-center gap-8">
              <h2 className="font-display text-4xl font-bold leading-[0.98] tracking-[-0.03em] text-tinta sm:text-6xl">
                {conSesion ? 'Mismas pistas, más partidos.' : 'Tu primera reserva, en un minuto.'}
              </h2>
              <p className="max-w-[40ch] text-lg text-tinta-2">
                {conSesion ? 'Todas tus reservas, en un sitio. Cancela hasta dos horas antes.' : 'Sin pagos ni cuotas: una cuenta, una pista y una hora.'}
              </p>
              <Link to={conSesion ? '/mis-reservas' : '/registro'} className={estilosBoton('primario')}>
                {conSesion ? 'Mis reservas' : 'Crear cuenta'}<IconoBoton><ArrowRight size={16} weight="bold" /></IconoBoton>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
