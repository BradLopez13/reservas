import { ArrowLeft, CalendarBlank } from '@phosphor-icons/react';
import type { ReactNode } from 'react';
import { Link } from 'react-router';
import type { Pista } from '@reservas/contracts';
import { Campo } from '../../../shared/components/Campo.tsx';
import { Cargando, Esqueleto } from '../../../shared/components/Esqueleto.tsx';
import { LineasPista } from '../../../shared/components/LineasPista.tsx';
import { Vacio } from '../../../shared/components/Vacio.tsx';
import { diaCorto, fechaLocal, ZONA } from '../../../shared/fechas.ts';
import { fotoDePista, NOMBRE_DEPORTE } from '../../../shared/fotos.ts';
import { AnimatedList } from '../../../shared/react-bits/AnimatedList.tsx';
import type { FranjaVista } from '../mappers/franja.mapper.ts';
import { FranjaItem, type EstadoFranja } from './FranjaItem.tsx';

export interface FranjasDiaViewProps {
  pista: Pista | undefined; fecha: string; minFecha: string; franjas: FranjaVista[]; cargando: boolean;
  onCambiarFecha: (fecha: string) => void; onElegir: (f: FranjaVista) => void;
  confirmacion?: ReactNode;
}

const DIA_MS = 86_400_000;

const diaSemana = (d: Date) => d.toLocaleDateString('es-ES', { timeZone: ZONA, weekday: 'short' }).replace('.', '');
const diaMes = (d: Date) => d.toLocaleDateString('es-ES', { timeZone: ZONA, day: 'numeric' });

// Los siete próximos días como atajos, además del selector de fecha libre.
const atajos = () => Array.from({ length: 7 }, (_, n) => {
  const d = new Date(Date.now() + n * DIA_MS);
  return { fecha: fechaLocal(d), semana: n === 0 ? 'Hoy' : n === 1 ? 'Mañana' : diaSemana(d), numero: diaMes(d) };
});

const estadoDe = (f: FranjaVista, ahora: Date): EstadoFranja => (!f.libre ? 'ocupada' : f.inicio <= ahora ? 'pasada' : 'libre');

export function FranjasDiaView({ pista, fecha, minFecha, franjas, cargando, onCambiarFecha, onElegir, confirmacion }: FranjasDiaViewProps) {
  const ahora = new Date();
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
              <ArrowLeft size={16} weight="light" aria-hidden="true" />Todas las pistas
            </Link>
            <div className="flex flex-col gap-3">
              <p className="text-sm font-medium text-acento">{pista ? NOMBRE_DEPORTE[pista.deporte] : 'Pista'}</p>
              <h1 className="font-display text-6xl font-bold leading-none tracking-[-0.035em] text-tinta sm:text-7xl">{pista?.nombre ?? 'Pista'}</h1>
              {pista && (
                <p className="text-base text-tinta-2">
                  Abre de <span className="tabular-nums">{pista.apertura}</span> a <span className="tabular-nums">{pista.cierre}</span>, en franjas de {pista.duracionMin} minutos
                </p>
              )}
            </div>
          </div>
        </div>
      </header>

      <div className="grid gap-6 md:grid-cols-[1fr_auto] md:items-end">
        <div className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 sm:mx-0 sm:px-0" role="group" aria-label="Atajos de fecha">
          {atajos().map((a) => {
            const activo = a.fecha === fecha;
            return (
              <button
                key={a.fecha}
                type="button"
                onClick={() => onCambiarFecha(a.fecha)}
                aria-pressed={activo}
                className={`flex w-[72px] shrink-0 flex-col items-center gap-1 rounded-[1.25rem] border py-3 transition-[background-color,border-color,color,transform] duration-500 ease-suave active:scale-[0.98] ${
                  activo ? 'border-acento bg-acento text-sobre-acento' : 'border-borde bg-superficie text-tinta-2 hover:border-borde-fuerte hover:text-tinta'
                }`}
              >
                <span className="text-[11px] font-medium capitalize">{a.semana}</span>
                <span className={`font-display text-2xl font-semibold leading-none tabular-nums ${activo ? 'text-sobre-acento' : 'text-tinta'}`}>{a.numero}</span>
              </button>
            );
          })}
        </div>
        <div className="w-full md:w-48">
          <Campo etiqueta="Día" type="date" value={fecha} min={minFecha} onChange={(e) => onCambiarFecha(e.target.value)} />
        </div>
      </div>

      <section className="flex flex-col gap-5">
        <div className="flex items-baseline justify-between gap-4">
          <h2 className="font-display text-2xl font-semibold tracking-tight text-tinta capitalize">{diaCorto(new Date(`${fecha}T12:00:00`))}</h2>
          {!cargando && franjas.length > 0 && <p className="text-sm text-tinta-2">{libres === 0 ? 'Sin horas libres' : libres === 1 ? '1 hora libre' : `${libres} horas libres`}</p>}
        </div>
        {cargando ? (
          <>
            <Cargando que="franjas" />
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4" aria-hidden="true">
              {Array.from({ length: 8 }, (_, i) => <Esqueleto key={i} className="h-[62px]" />)}
            </div>
          </>
        ) : franjas.length === 0 ? (
          <Vacio Icono={CalendarBlank} titulo="Esta pista no abre ese día">Prueba con otra fecha.</Vacio>
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
