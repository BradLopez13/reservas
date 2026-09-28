import { ArrowLeft, ArrowRight, CalendarBlank, CaretLeft, CaretRight, MapPinLine, WifiSlash } from '@phosphor-icons/react';
import { useRef, type ReactNode } from 'react';
import { Link } from 'react-router';
import type { Pista } from '@reservas/contracts';
import { LOCALE, useT } from '../../../i18n/i18n.ts';
import { Boton, estilosBoton } from '../../../shared/components/Boton.tsx';
import { Campo } from '../../../shared/components/Campo.tsx';
import { Cargando, Esqueleto } from '../../../shared/components/Esqueleto.tsx';
import { GrupoOpciones } from '../../../shared/components/GrupoOpciones.tsx';
import { LineasPista } from '../../../shared/components/LineasPista.tsx';
import { Vacio } from '../../../shared/components/Vacio.tsx';
import { diaCorto, fechaLocal, ZONA } from '../../../shared/fechas.ts';
import { fotoDePista } from '../../../shared/fotos.ts';
import { AnimatedList } from '../../../shared/react-bits/AnimatedList.tsx';
import type { EstadoPista } from '../hooks/useFranjasDia.ts';
import type { FranjaVista } from '../mappers/franja.mapper.ts';
import { FranjaItem, type EstadoFranja } from './FranjaItem.tsx';

export interface FranjasDiaViewProps {
  pista: Pista | undefined; estado: EstadoPista; fecha: string; minFecha: string; franjas: FranjaVista[]; cargando: boolean;
  onCambiarFecha: (fecha: string) => void; onElegir: (f: FranjaVista) => void;
  confirmacion?: ReactNode;
}

const DIA_MS = 86_400_000;

const diaSemana = (d: Date, locale: string) => d.toLocaleDateString(locale, { timeZone: ZONA, weekday: 'short' }).replace('.', '');
const diaMes = (d: Date, locale: string) => d.toLocaleDateString(locale, { timeZone: ZONA, day: 'numeric' });
const sumarDias = (fecha: string, n: number) => fechaLocal(new Date(new Date(`${fecha}T12:00:00`).getTime() + n * DIA_MS));

// Los catorce próximos días como atajos, además del selector de fecha libre.
const atajos = (locale: string, hoy: string, manana: string) => Array.from({ length: 14 }, (_, n) => {
  const d = new Date(Date.now() + n * DIA_MS);
  return { fecha: fechaLocal(d), semana: n === 0 ? hoy : n === 1 ? manana : diaSemana(d, locale), numero: diaMes(d, locale) };
});

const estadoDe = (f: FranjaVista, ahora: Date): EstadoFranja => (!f.libre ? 'ocupada' : f.inicio <= ahora ? 'pasada' : 'libre');

const TABLON = 'tablon grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4';

export function FranjasDiaView({ pista, estado, fecha, minFecha, franjas, cargando, onCambiarFecha, onElegir, confirmacion }: FranjasDiaViewProps) {
  const { t, plural, idioma, nombreDeporte } = useT();
  const ahora = new Date();
  const tira = useRef<HTMLDivElement>(null);
  const desplazar = (n: number) => tira.current?.scrollBy({ left: n * 240, behavior: 'smooth' });

  if (estado === 'no-encontrada' || estado === 'error') {
    const sinRed = estado === 'error';
    return (
      <div className="mx-auto max-w-xl py-10">
        <Vacio
          Icono={sinRed ? WifiSlash : MapPinLine}
          titulo={sinRed ? t('pista.errorTitulo') : t('pista.noExisteTitulo')}
          accion={<Link to="/#pistas" className={estilosBoton('primario', 'sm')}>{t('pista.volverAPistas')}</Link>}
        >
          {sinRed ? t('pista.errorTexto') : t('pista.noExisteTexto')}
        </Vacio>
      </div>
    );
  }

  const libres = franjas.filter((f) => estadoDe(f, ahora) === 'libre').length;
  const foto = pista ? fotoDePista(pista.deporte, 0) : null;
  return (
    <div className="flex flex-col gap-12">
      {/* Cabecera partida: el nombre a la izquierda, enorme; la foto a la derecha con la esquina grande. */}
      <header className="grid gap-8 lg:grid-cols-12 lg:items-end">
        <div className="flex flex-col gap-6 lg:col-span-7">
          <Link to="/" className="inline-flex items-center gap-1.5 self-start text-sm text-tinta-2 transition-colors hover:text-tinta">
            <ArrowLeft size={16} weight="light" aria-hidden="true" />{t('pista.todasLasPistas')}
          </Link>
          <div className="flex flex-col gap-4">
            <p className="rotulo uppercase text-acento">{pista ? nombreDeporte(pista.deporte) : <span className="sr-only">{t('pista.generico')}</span>}</p>
            {pista ? (
              <h1 className="font-display text-6xl font-bold leading-[0.92] tracking-[-0.04em] text-tinta sm:text-7xl lg:text-8xl">{pista.nombre}</h1>
            ) : (
              <Esqueleto className="h-16 w-72" />
            )}
            {pista && (
              <p className="cifra text-base text-tinta-2">{t('pista.horarioLargo', { apertura: pista.apertura, cierre: pista.cierre, duracion: pista.duracionMin })}</p>
            )}
          </div>
        </div>
        <div className="relative overflow-hidden rounded-[var(--radius-ui)_var(--radius-esquina)_var(--radius-ui)_var(--radius-esquina)] bg-pista lg:col-span-5">
          {foto && <img src={foto.src} alt="" className="aspect-[16/9] w-full object-cover opacity-70 saturate-[0.85] lg:aspect-[5/4]" />}
          <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-pista-2/70 to-transparent" />
          <LineasPista className="opacity-[0.16]" />
        </div>
      </header>

      <div className="grid gap-6 md:grid-cols-[minmax(0,1fr)_auto] md:items-end">
        <div className="relative min-w-0">
          <GrupoOpciones
            ref={tira}
            etiqueta={t('pista.proximosDias')}
            valor={fecha}
            onCambiar={onCambiarFecha}
            opciones={atajos(LOCALE[idioma], t('pista.hoy'), t('pista.manana')).map((a) => ({
              valor: a.fecha,
              clave: a.fecha,
              contenido: (
                <>
                  <span className="rotulo capitalize">{a.semana}</span>
                  <span className="cifra text-2xl leading-none">{a.numero}</span>
                </>
              ),
            }))}
            className="tira -mx-4 flex gap-1.5 overflow-x-auto px-4 pb-1 pr-16 [mask-image:linear-gradient(to_right,transparent,black_1rem,black_calc(100%-4rem),transparent)] sm:mx-0 sm:pl-0 sm:pr-24 sm:[mask-image:linear-gradient(to_right,transparent,black_1rem,black_calc(100%-6rem),transparent)]"
            claseOpcion={(activa) =>
              `flex w-[72px] shrink-0 flex-col items-center gap-1.5 rounded-ui border py-3 transition-[background-color,border-color,color,transform] duration-500 ease-suave active:scale-[0.98] ${
                activa ? 'border-acento bg-acento text-sobre-acento' : 'border-borde bg-superficie/50 text-tinta-2 hover:border-borde-fuerte hover:text-tinta'
              }`}
          />
          {/* En móvil, una flecha discreta dice que la tira sigue; en escritorio, botones. */}
          <span aria-hidden="true" className="pointer-events-none absolute inset-y-0 -right-2 flex items-center pb-1 text-tinta-2 sm:hidden">
            <CaretRight size={18} weight="bold" />
          </span>
          <div className="pointer-events-none absolute inset-y-0 right-0 hidden items-center gap-1 pb-1 sm:flex">
            <Boton variante="secundario" tamano="sm" className="pointer-events-auto size-9 px-0!" aria-label={t('pista.diasAnteriores')} onClick={() => desplazar(-1)}><CaretLeft size={16} weight="bold" /></Boton>
            <Boton variante="secundario" tamano="sm" className="pointer-events-auto size-9 px-0!" aria-label={t('pista.diasSiguientes')} onClick={() => desplazar(1)}><CaretRight size={16} weight="bold" /></Boton>
          </div>
        </div>
        <div className="w-full md:w-48">
          <Campo etiqueta={t('pista.dia')} type="date" value={fecha} min={minFecha} onChange={(e) => onCambiarFecha(e.target.value)} />
        </div>
      </div>

      {/* El tablón horario: celdas sin huecos separadas por líneas, como un panel de salidas. */}
      <section className="flex flex-col gap-5">
        <div className="flex flex-wrap items-end justify-between gap-4 border-b border-borde pb-4">
          <div className="flex flex-col gap-1.5">
            <p className="rotulo uppercase text-tinta-3">{t('pista.tablon')}</p>
            <h2 className="font-display text-3xl font-semibold tracking-tight text-tinta capitalize">{diaCorto(new Date(`${fecha}T12:00:00`))}</h2>
          </div>
          {!cargando && franjas.length > 0 && (
            libres === 0 ? (
              <Boton variante="secundario" tamano="sm" onClick={() => onCambiarFecha(sumarDias(fecha, 1))}>
                {t('pista.sinHorasLibres')}<ArrowRight size={14} weight="bold" aria-hidden="true" />
              </Boton>
            ) : (
              <p className="cifra text-sm text-acento">{plural('pista.horasLibres', libres)}</p>
            )
          )}
        </div>
        {cargando ? (
          <>
            <Cargando que={t('pista.cargandoFranjas')} />
            <div className={TABLON} aria-hidden="true">
              {Array.from({ length: 8 }, (_, i) => <div key={i} className="p-4"><Esqueleto className="h-14" /></div>)}
            </div>
          </>
        ) : franjas.length === 0 ? (
          <Vacio Icono={CalendarBlank} titulo={t('pista.noAbreTitulo')} accion={<Boton variante="secundario" tamano="sm" onClick={() => onCambiarFecha(sumarDias(fecha, 1))}>{t('pista.verDiaSiguiente')}</Boton>}>
            {t('pista.noAbreTexto')}
          </Vacio>
        ) : (
          <AnimatedList
            className={TABLON}
            items={franjas}
            keyOf={(f) => f.inicio.toISOString()}
            render={(f) => <FranjaItem franja={f} estado={estadoDe(f, ahora)} onElegir={onElegir} />}
          />
        )}
      </section>
      {confirmacion}
    </div>
  );
}
