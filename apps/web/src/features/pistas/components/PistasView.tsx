import { ArrowDown, ArrowRight, MagnifyingGlass } from '@phosphor-icons/react';
import { Link } from 'react-router';
import type { Deporte } from '@reservas/contracts';
import { useT } from '../../../i18n/i18n.ts';
import { estilosBoton, IconoBoton } from '../../../shared/components/Boton.tsx';
import { Cargando, Esqueleto } from '../../../shared/components/Esqueleto.tsx';
import { ImagenEscala } from '../../../shared/components/ImagenEscala.tsx';
import { LineasPista } from '../../../shared/components/LineasPista.tsx';
import { Marquesina } from '../../../shared/components/Marquesina.tsx';
import { TextoRevelado } from '../../../shared/components/TextoRevelado.tsx';
import { TituloAnimado } from '../../../shared/components/TituloAnimado.tsx';
import { Vacio } from '../../../shared/components/Vacio.tsx';
import { FOTO_CARRERA, FOTO_PORTADA } from '../../../shared/fotos.ts';
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

// La esquina grande de la foto de portada: arriba a la izquierda y abajo a la derecha.
const ESQUINAS = 'rounded-[var(--radius-esquina)_var(--radius-ui)_var(--radius-esquina)_var(--radius-ui)]';

export function PistasView({ deporte, filtros, pistas, cargando, conSesion, onFiltrar }: PistasViewProps) {
  const { t, plural, nombreDeporte } = useT();
  // La pista con hueco más cercano va la primera de la lista, así que es la de la ficha del hero.
  const proxima = pistas.find((p) => p.disponibilidad?.hayHueco);
  const rotulos = pistas.filter((p) => p.disponibilidad).map((p) => (
    <span key={p.id} className="rotulo flex items-center gap-3 text-tinta-2">
      <span className="text-tinta">{p.nombre}</span>
      <span className={p.disponibilidad!.hayHueco ? 'text-acento' : 'text-tinta-3'}>{p.disponibilidad!.texto}</span>
    </span>
  ));

  return (
    <div className="flex flex-col">
      {/* Atención: el titular a la izquierda pisa la foto, que va recortada con una esquina grande. */}
      <section className="relative -mt-16 flex min-h-[100dvh] flex-col justify-end overflow-hidden pt-28">
        <LineasPista className="opacity-[0.05]" />
        <div className="relative mx-auto grid w-full max-w-[1400px] flex-1 items-center gap-10 px-4 sm:px-6 lg:grid-cols-12 lg:gap-0">
          <div className="relative z-10 flex min-w-0 flex-col gap-7 lg:col-span-7 lg:col-start-1 lg:row-start-1">
            <p className="rotulo flex items-center gap-3 uppercase text-tinta-2">
              <span aria-hidden="true" className="size-1.5 rounded-full bg-acento motion-safe:animate-latido" />
              {t('portada.eyebrow')}
            </p>
            <h1 className="font-display text-[clamp(3rem,8.4vw,7.5rem)] font-bold leading-[0.92] tracking-[-0.04em] text-tinta lg:-mr-40">
              <TituloAnimado texto={t('portada.titulo')} />
            </h1>
            <p className="max-w-[42ch] text-lg leading-relaxed text-tinta-2 sm:text-xl">{t('portada.subtitulo')}</p>
            <div className="flex flex-wrap items-center gap-3">
              <Magnet>
                <a href="#pistas" className={estilosBoton('primario')}>{t('portada.verPistas')}<IconoBoton><ArrowDown size={16} weight="bold" /></IconoBoton></a>
              </Magnet>
              {!conSesion && <Link to="/registro" className={estilosBoton('secundario')}>{t('nav.crearCuenta')}</Link>}
            </div>
          </div>

          <div className="relative min-w-0 lg:col-span-6 lg:col-start-7 lg:row-start-1">
            <div className={`relative overflow-hidden bg-pista ${ESQUINAS}`}>
              <img src={FOTO_PORTADA.src} alt="" fetchPriority="high" className="aspect-[4/5] w-full object-cover object-[50%_35%] saturate-[0.85] sm:aspect-[4/3] lg:aspect-[6/5]" />
              <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-pista-2/80 via-transparent to-pista-2/30" />
              <LineasPista className="opacity-[0.22]" />
            </div>
            {/* La ficha de la próxima hora libre, colgada del borde inferior de la foto. */}
            <div className="relative z-10 -mt-12 ml-4 inline-flex max-w-[calc(100%-2rem)] flex-col gap-1.5 rounded-ui bg-acento px-5 py-4 text-sobre-acento shadow-tarjeta sm:ml-8">
              <span className="rotulo uppercase text-sobre-lima-2">{t('portada.proximaLibre')}</span>
              {cargando || !proxima ? (
                <span className="cifra text-xl font-medium">{cargando ? '— : —' : t('portada.tablonVacio')}</span>
              ) : (
                <span className="flex flex-wrap items-baseline gap-x-3 gap-y-0.5">
                  <span className="font-display text-2xl font-semibold tracking-tight">{proxima.nombre}</span>
                  <span className="cifra text-base text-sobre-lima-2">{nombreDeporte(proxima.deporte)} · {proxima.disponibilidad!.texto}</span>
                </span>
              )}
            </div>
          </div>
        </div>

        {/* El marcador que corre por el borde inferior: cada pista y su próximo hueco. */}
        <div className="relative mt-12 border-t border-borde py-4">
          {cargando ? <div className="h-4" aria-hidden="true" /> : <Marquesina elementos={rotulos} />}
        </div>
      </section>

      {/* Interés: las pistas en un bento sin huecos. */}
      <section id="pistas" className="mx-auto w-full max-w-[1400px] scroll-mt-20 px-4 py-24 sm:px-6 md:py-32">
        <div className="mb-10 grid gap-6 md:grid-cols-12 md:items-end">
          <div className="flex flex-col gap-3 md:col-span-7">
            <p className="rotulo uppercase text-tinta-3">{cargando ? t('portada.cargandoPistas') : plural('portada.pistasRotulo', pistas.length)}</p>
            <h2 className="font-display text-5xl font-semibold tracking-[-0.03em] text-tinta sm:text-6xl">{t('portada.pistas')}</h2>
          </div>
          <div className="md:col-span-5 md:justify-self-end">
            <FiltroDeporte valor={deporte} opciones={filtros} onCambiar={onFiltrar} />
          </div>
        </div>
        {cargando ? (
          <>
            <Cargando que={t('portada.cargandoPistas')} />
            <div className="grid grid-flow-dense grid-cols-1 gap-3 md:auto-rows-[230px] md:grid-cols-12" aria-hidden="true">
              {[0, 1, 2, 3, 4].map((i) => <Esqueleto key={i} className={`h-56 rounded-tarjeta md:h-auto ${claseCelda(i, 5)}`} />)}
            </div>
          </>
        ) : pistas.length === 0 ? (
          <Vacio Icono={MagnifyingGlass} titulo={t('portada.sinPistasTitulo')}>{t('portada.sinPistasTexto')}</Vacio>
        ) : (
          <ul className="grid grid-flow-dense grid-cols-1 gap-3 md:auto-rows-[230px] md:grid-cols-12">
            {pistas.map((p, i) => (
              <li key={p.id} className={`h-72 md:h-auto ${claseCelda(i, pistas.length)}`}>
                <PistaCard pista={p} indice={i} grande={claseCelda(i, pistas.length).includes('row-span-2')} />
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* Deseo: la carrera de cincuenta, en la segunda variante de la marca: verde sobre lima. */}
      <section className="lima relative overflow-hidden bg-acento text-sobre-lima">
        <LineasPista className="text-fondo opacity-[0.10]" />
        <div className="relative mx-auto grid w-full max-w-[1400px] items-center gap-12 px-4 py-24 sm:px-6 md:py-36 lg:grid-cols-12 lg:gap-16">
          <div className="flex flex-col gap-8 lg:col-span-7">
            <p className="rotulo uppercase text-sobre-lima-2">{t('portada.carreraRotulo')}</p>
            {/* Los números animados empiezan en 0 y solo ilustran el párrafo de abajo: fuera del árbol de accesibilidad. */}
            <p aria-hidden="true" className="cifra flex items-baseline text-[clamp(6rem,16vw,13rem)] font-medium leading-none text-fondo">
              <CountUp hasta={50} />
              <span className="mx-3 font-display text-[0.35em] font-light text-sobre-lima-2 sm:mx-6">→</span>
              <CountUp hasta={1} />
            </p>
            <TextoRevelado texto={t('portada.carrera')} className="max-w-[40ch] font-display text-2xl font-medium leading-snug tracking-tight text-fondo sm:text-3xl" />
            <Link to="/sobre-el-proyecto" className={`${estilosBoton('inverso')} self-start`}>
              {t('portada.sobreProyecto')}<IconoBoton><ArrowRight size={16} weight="bold" /></IconoBoton>
            </Link>
          </div>
          <ImagenEscala src={FOTO_CARRERA.src} alt={t(FOTO_CARRERA.alt)} className="lg:col-span-5 lg:translate-y-10" />
        </div>
      </section>

      {/* Acción: una sola llamada, a la izquierda, con el botón enfrente. */}
      <section className="mx-auto w-full max-w-[1400px] px-4 pt-24 sm:px-6 md:pt-32">
        <div className={`relative overflow-hidden bg-pista ${ESQUINAS}`}>
          <LineasPista className="opacity-[0.09]" />
          <div className="relative grid gap-8 px-6 py-16 sm:px-10 md:grid-cols-12 md:items-end md:py-24 lg:px-16">
            <div className="flex flex-col gap-5 md:col-span-8">
              <h2 className="font-display text-4xl font-bold leading-[0.98] tracking-[-0.03em] text-tinta sm:text-6xl">
                {conSesion ? t('portada.bandaTituloSesion') : t('portada.bandaTitulo')}
              </h2>
              <p className="max-w-[40ch] text-lg text-tinta-2">{conSesion ? t('portada.bandaTextoSesion') : t('portada.bandaTexto')}</p>
            </div>
            <div className="md:col-span-4 md:justify-self-end">
              <Link to={conSesion ? '/mis-reservas' : '/registro'} className={estilosBoton('primario')}>
                {conSesion ? t('nav.misReservas') : t('nav.crearCuenta')}<IconoBoton><ArrowRight size={16} weight="bold" /></IconoBoton>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
