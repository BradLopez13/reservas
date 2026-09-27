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
          accion={<Link to="/" className={estilosBoton('primario', 'sm')}>{t('pista.volverAPistas')}</Link>}
        >
          {sinRed ? t('pista.errorTexto') : t('pista.noExisteTexto')}
        </Vacio>
      </div>
    );
  }

  const libres = franjas.filter((f) => estadoDe(f, ahora) === 'libre').length;
  const foto = pista ? fotoDePista(pista.deporte, 0) : null;
  return (
    <div className="flex flex-col gap-10">
      {/* Cabecera: la foto de la pista dentro de una bandeja con bisel. */}
      <header className="bisel">
        <div className="relative overflow-hidden bg-pista">
          {foto && <img src={foto.src} alt="" className="absolute inset-0 size-full object-cover opacity-40 saturate-[0.85]" />}
          <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-r from-pista via-pista/80 to-pista/20" />
          <LineasPista className="opacity-[0.12]" />
          <div className="relative flex min-h-[320px] flex-col justify-between gap-10 p-6 sm:p-10">
            <Link to="/" className="inline-flex items-center gap-1.5 self-start text-sm text-tinta-2 transition-colors hover:text-tinta">
              <ArrowLeft size={16} weight="light" aria-hidden="true" />{t('pista.todasLasPistas')}
            </Link>
            <div className="flex flex-col gap-3">
              <p className="text-sm font-medium text-acento">{pista ? nombreDeporte(pista.deporte) : <span className="sr-only">{t('pista.generico')}</span>}</p>
              {pista ? (
                <h1 className="font-display text-6xl font-bold leading-none tracking-[-0.035em] text-tinta sm:text-7xl">{pista.nombre}</h1>
              ) : (
                <Esqueleto className="h-14 w-64" />
              )}
              {pista && (
                <p className="text-base tabular-nums text-tinta-2">{t('pista.horarioLargo', { apertura: pista.apertura, cierre: pista.cierre, duracion: pista.duracionMin })}</p>
              )}
            </div>
          </div>
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
                  <span className="text-[11px] font-medium capitalize">{a.semana}</span>
                  <span className="font-display text-2xl font-semibold leading-none tabular-nums">{a.numero}</span>
                </>
              ),
            }))}
            className="tira -mx-4 flex gap-2 overflow-x-auto px-4 pb-1 pr-16 [mask-image:linear-gradient(to_right,transparent,black_1rem,black_calc(100%-4rem),transparent)] sm:mx-0 sm:pl-0 sm:pr-24 sm:[mask-image:linear-gradient(to_right,transparent,black_1rem,black_calc(100%-6rem),transparent)]"
            claseOpcion={(activa) =>
              `flex w-[72px] shrink-0 flex-col items-center gap-1 rounded-[1.25rem] border py-3 transition-[background-color,border-color,color,transform] duration-500 ease-suave active:scale-[0.98] ${
                activa ? 'border-acento bg-acento text-sobre-acento' : 'border-borde bg-superficie text-tinta-2 hover:border-borde-fuerte hover:text-tinta'
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

      <section className="flex flex-col gap-5">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <h2 className="font-display text-2xl font-semibold tracking-tight text-tinta capitalize">{diaCorto(new Date(`${fecha}T12:00:00`))}</h2>
          {!cargando && franjas.length > 0 && (
            libres === 0 ? (
              <Boton variante="secundario" tamano="sm" onClick={() => onCambiarFecha(sumarDias(fecha, 1))}>
                {t('pista.sinHorasLibres')}<ArrowRight size={14} weight="bold" aria-hidden="true" />
              </Boton>
            ) : (
              <p className="text-sm text-tinta-2">{plural('pista.horasLibres', libres)}</p>
            )
          )}
        </div>
        {cargando ? (
          <>
            <Cargando que={t('pista.cargandoFranjas')} />
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4" aria-hidden="true">
              {Array.from({ length: 8 }, (_, i) => <Esqueleto key={i} className="h-[62px]" />)}
            </div>
          </>
        ) : franjas.length === 0 ? (
          <Vacio Icono={CalendarBlank} titulo={t('pista.noAbreTitulo')} accion={<Boton variante="secundario" tamano="sm" onClick={() => onCambiarFecha(sumarDias(fecha, 1))}>{t('pista.verDiaSiguiente')}</Boton>}>
            {t('pista.noAbreTexto')}
          </Vacio>
        ) : (
          <AnimatedList
            className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4"
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
