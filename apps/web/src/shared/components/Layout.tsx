import { ArrowUpRight, GithubLogo, SignOut, Translate, UserCircle } from '@phosphor-icons/react';
import { useQueryClient } from '@tanstack/react-query';
import { motion } from 'motion/react';
import { useEffect, useRef, useState, type KeyboardEvent } from 'react';
import { Link, NavLink, Outlet, useLocation } from 'react-router';
import { useSesion } from '../../features/auth/providers/SesionProvider.tsx';
import { establecerIdioma, useT } from '../../i18n/i18n.ts';
import { useReducedMotion } from '../hooks/useReducedMotion.ts';
import { useRestaurarScroll } from '../hooks/useRestaurarScroll.ts';
import { Boton, estilosBoton } from './Boton.tsx';
import { LineasPista } from './LineasPista.tsx';
import { Marca } from './Marca.tsx';
import { RelojMadrid } from './RelojMadrid.tsx';

export const REPO_URL = 'https://github.com/BradLopez13/reservas';

// Capas: menú móvil 40, barra 50, diálogos 60, grano 70 (sin eventos).
// El enlace activo de la barra lleva una raya lima debajo, como la línea de una pista.
const enlaceNav = ({ isActive }: { isActive: boolean }) =>
  `relative flex h-16 items-center px-3.5 text-sm transition-colors duration-500 ease-suave after:absolute after:inset-x-3.5 after:bottom-0 after:h-0.5 after:bg-acento after:transition-transform after:duration-500 after:ease-suave ${
    isActive ? 'text-tinta after:scale-x-100' : 'text-tinta-2 after:origin-left after:scale-x-0 hover:text-tinta'
  }`;

const enlaceMovil = ({ isActive }: { isActive: boolean }) =>
  `flex items-baseline gap-4 font-display text-4xl font-semibold tracking-tight ${isActive ? 'text-acento' : 'text-tinta'}`;

const enlacePie = 'text-sm text-tinta-2 transition-colors duration-500 ease-suave hover:text-tinta';

const GRANO =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")";

const FOCABLES = 'a[href], button:not([disabled])';

export function Layout() {
  const { usuario, salir } = useSesion();
  const { t, idioma } = useT();
  const qc = useQueryClient();
  const [menuAbierto, setMenuAbierto] = useState(false);
  const { pathname } = useLocation();
  const reducido = useReducedMotion();
  const botonMenu = useRef<HTMLButtonElement>(null);
  const menu = useRef<HTMLDivElement>(null);
  useRestaurarScroll();

  // El menú móvil se cierra al cambiar de página.
  useEffect(() => setMenuAbierto(false), [pathname]);

  // Mientras está abierto es un diálogo: bloquea el scroll, recibe el foco,
  // se cierra con Escape y devuelve el foco al botón al cerrarse.
  useEffect(() => {
    document.body.style.overflow = menuAbierto ? 'hidden' : '';
    if (menuAbierto) menu.current?.querySelector<HTMLElement>(FOCABLES)?.focus();
    else if (document.activeElement && menu.current?.contains(document.activeElement)) botonMenu.current?.focus();
    return () => { document.body.style.overflow = ''; };
  }, [menuAbierto]);

  const onTeclaMenu = (e: KeyboardEvent) => {
    if (e.key === 'Escape') { e.preventDefault(); setMenuAbierto(false); botonMenu.current?.focus(); return; }
    if (e.key !== 'Tab' || !menu.current) return;
    const focables = Array.from(menu.current.querySelectorAll<HTMLElement>(FOCABLES));
    const primero = focables[0];
    const ultimo = focables[focables.length - 1];
    if (!primero || !ultimo) return;
    if (e.shiftKey && document.activeElement === primero) { e.preventDefault(); ultimo.focus(); }
    else if (!e.shiftKey && document.activeElement === ultimo) { e.preventDefault(); primero.focus(); }
  };

  // Las etiquetas de fecha y los datos ya mapeados llevan el idioma dentro:
  // al cambiarlo se vuelven a pedir.
  const cambiarIdioma = () => {
    establecerIdioma(idioma === 'es' ? 'en' : 'es');
    void qc.invalidateQueries();
  };

  // «Pistas» apunta al listado, no a la portada: desde la propia portada solo
  // cambia el ancla, así que el menú móvil se cierra al pulsar, no al cambiar de ruta.
  const rutas = [
    { a: '/#pistas', texto: t('nav.pistas'), fin: true },
    ...(usuario ? [{ a: '/mis-reservas', texto: t('nav.misReservas'), fin: false }] : []),
    { a: '/como-funciona', texto: t('nav.comoFunciona'), fin: false },
    { a: '/normas', texto: t('nav.normas'), fin: false },
  ];

  const botonIdioma = (
    <button
      type="button"
      onClick={cambiarIdioma}
      aria-label={t('idioma.cambiar')}
      lang={idioma === 'es' ? 'en' : 'es'}
      className="rotulo inline-flex h-9 items-center gap-1.5 rounded-ui px-3 text-tinta-2 transition-colors duration-500 ease-suave hover:bg-superficie-2 hover:text-tinta"
    >
      <Translate size={15} weight="light" aria-hidden="true" />{t('idioma.otro')}
    </button>
  );

  const enlacesSesion = usuario ? (
    <>
      <NavLink to="/ajustes" className={({ isActive }) => `inline-flex h-9 items-center gap-1.5 rounded-ui px-3 text-sm transition-colors duration-500 ease-suave hover:bg-superficie-2 ${isActive ? 'text-tinta' : 'text-tinta-2 hover:text-tinta'}`}>
        <UserCircle size={18} weight="light" aria-hidden="true" />{usuario.nombre}
      </NavLink>
      <Boton variante="secundario" tamano="sm" onClick={() => void salir()}><SignOut size={16} weight="light" aria-hidden="true" />{t('nav.salir')}</Boton>
    </>
  ) : (
    <>
      <NavLink to="/login" className={({ isActive }) => `inline-flex h-9 items-center rounded-ui px-3 text-sm transition-colors duration-500 ease-suave hover:bg-superficie-2 ${isActive ? 'text-tinta' : 'text-tinta-2 hover:text-tinta'}`}>{t('nav.entrar')}</NavLink>
      <Link to="/registro" className={estilosBoton('primario', 'sm')}>{t('nav.crearCuenta')}</Link>
    </>
  );

  return (
    <div className="relative flex min-h-[100dvh] w-full max-w-full flex-col overflow-x-hidden">
      {/* Ambiente: dos halos lima muy tenues y grano fijo por encima de todo. */}
      <div aria-hidden="true" className="pointer-events-none fixed inset-0 -z-10 bg-[radial-gradient(60%_50%_at_10%_0%,oklch(91%_0.19_118/0.10),transparent_60%),radial-gradient(50%_40%_at_100%_100%,oklch(91%_0.19_118/0.07),transparent_60%)]" />
      <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-[70] opacity-[0.045] mix-blend-overlay" style={{ backgroundImage: GRANO }} />

      {/* La barra es una regla: de lado a lado, con una línea debajo y la hora de Madrid siempre a la vista. */}
      <header className="fixed inset-x-0 top-0 z-50 border-b border-borde bg-fondo/75 backdrop-blur-xl">
        <nav aria-label={t('nav.principal')} className="mx-auto flex h-16 w-full max-w-[1400px] items-center gap-2 px-4 sm:px-6">
          <Link to="/" className="flex items-center gap-2.5 rounded-ui py-1.5 pr-3 font-display text-lg font-semibold tracking-tight text-tinta">
            <Marca tamano={26} className="text-acento" />{t('app.nombre')}
          </Link>
          <div className="hidden items-center lg:ml-6 lg:flex" inert={menuAbierto || undefined}>
            {rutas.map((r) => <NavLink key={r.a} to={r.a} end={r.fin} className={enlaceNav}>{r.texto}</NavLink>)}
          </div>
          <RelojMadrid className="ml-auto lg:mr-4" />
          <div className="hidden items-center gap-1.5 lg:flex">{botonIdioma}{enlacesSesion}</div>
          <button
            ref={botonMenu}
            type="button"
            onClick={() => setMenuAbierto((v) => !v)}
            aria-expanded={menuAbierto}
            aria-controls="menu-movil"
            aria-label={menuAbierto ? t('nav.cerrarMenu') : t('nav.abrirMenu')}
            className="relative ml-auto grid size-10 place-items-center rounded-ui text-tinta transition-colors hover:bg-superficie-2 sm:ml-2 lg:hidden"
          >
            <span aria-hidden="true" className={`absolute h-px w-5 bg-current transition-transform duration-500 ease-suave ${menuAbierto ? 'rotate-45' : '-translate-y-[3.5px]'}`} />
            <span aria-hidden="true" className={`absolute h-px w-5 bg-current transition-transform duration-500 ease-suave ${menuAbierto ? '-rotate-45' : 'translate-y-[3.5px]'}`} />
          </button>
        </nav>
      </header>

      {menuAbierto && (
        <div
          id="menu-movil"
          ref={menu}
          role="dialog"
          aria-modal="true"
          aria-label={t('nav.menu')}
          onKeyDown={onTeclaMenu}
          className="fixed inset-0 z-40 flex flex-col overflow-y-auto bg-fondo/85 px-6 pb-8 pt-24 backdrop-blur-3xl lg:hidden"
        >
          <nav aria-label={t('nav.menu')} className="flex flex-col gap-4">
            {rutas.map((r, i) => (
              <motion.div key={r.a} initial={reducido ? false : { opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 + i * 0.06, duration: 0.7, ease: [0.32, 0.72, 0, 1] }}>
                <NavLink to={r.a} end={r.fin} className={enlaceMovil} onClick={() => setMenuAbierto(false)}>
                  <span aria-hidden="true" className="rotulo text-tinta-3">{String(i + 1).padStart(2, '0')}</span>{r.texto}
                </NavLink>
              </motion.div>
            ))}
          </nav>
          <motion.div
            initial={reducido ? false : { opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 + rutas.length * 0.06, duration: 0.7, ease: [0.32, 0.72, 0, 1] }}
            className="mt-8 flex flex-wrap items-center gap-2 border-t border-borde pt-6"
            onClick={(e) => { if ((e.target as HTMLElement).closest('a')) setMenuAbierto(false); }}
          >
            {enlacesSesion}{botonIdioma}
          </motion.div>
        </div>
      )}

      {/* Con el menú abierto, el resto de la página queda fuera del árbol accesible y del foco. */}
      <main className="flex-1 pt-16" inert={menuAbierto || undefined}><Outlet /></main>

      <footer className="relative mt-24 overflow-hidden border-t border-borde bg-pista" inert={menuAbierto || undefined}>
        <LineasPista className="opacity-[0.07]" />
        <div className="relative mx-auto flex max-w-[1400px] flex-col gap-16 px-4 pb-6 pt-16 sm:px-6 md:pt-20">
          <div className="grid gap-10 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
            <div className="flex flex-col gap-4">
              <Link to="/" className="flex items-center gap-2 self-start font-display text-lg font-semibold tracking-tight text-tinta"><Marca className="text-acento" />{t('app.nombre')}</Link>
              <p className="max-w-[34ch] text-sm leading-relaxed text-tinta-2">{t('app.lema')}</p>
              <RelojMadrid className="mt-2" />
            </div>
            <nav aria-label={t('nav.reservar')} className="flex flex-col gap-2.5">
              <p className="rotulo uppercase text-tinta-3">{t('nav.reservar')}</p>
              <Link to="/#pistas" className={enlacePie}>{t('nav.pistas')}</Link>
              {usuario ? <Link to="/mis-reservas" className={enlacePie}>{t('nav.misReservas')}</Link> : <Link to="/login" className={enlacePie}>{t('nav.entrar')}</Link>}
              {usuario ? <Link to="/ajustes" className={enlacePie}>{t('nav.ajustes')}</Link> : <Link to="/registro" className={enlacePie}>{t('nav.crearCuenta')}</Link>}
            </nav>
            <nav aria-label={t('nav.informacion')} className="flex flex-col gap-2.5">
              <p className="rotulo uppercase text-tinta-3">{t('nav.informacion')}</p>
              <Link to="/como-funciona" className={enlacePie}>{t('nav.comoFunciona')}</Link>
              <Link to="/normas" className={enlacePie}>{t('nav.normasReserva')}</Link>
              <Link to="/sobre-el-proyecto" className={enlacePie}>{t('nav.sobreProyecto')}</Link>
              <Link to="/privacidad" className={enlacePie}>{t('nav.privacidad')}</Link>
            </nav>
            <div className="flex flex-col gap-2.5">
              <p className="rotulo uppercase text-tinta-3">{t('nav.codigo')}</p>
              <a href={REPO_URL} target="_blank" rel="noreferrer" className={`inline-flex items-center gap-1.5 ${enlacePie}`}>
                <GithubLogo size={16} weight="light" aria-hidden="true" />{t('nav.repositorio')}<ArrowUpRight size={12} weight="bold" aria-hidden="true" />
              </a>
              <a href="https://unsplash.com" target="_blank" rel="noreferrer" className={`inline-flex items-center gap-1.5 ${enlacePie}`}>{t('nav.fotos')}<ArrowUpRight size={12} weight="bold" aria-hidden="true" /></a>
            </div>
          </div>
          {/* La marca a todo el ancho, solo en contorno, recortada por abajo como si siguiera fuera de la página. */}
          <p aria-hidden="true" className="contorno -mb-[0.28em] select-none overflow-hidden font-display text-[clamp(5rem,19vw,17rem)] font-bold leading-none tracking-[-0.05em]">
            {t('app.nombre')}
          </p>
        </div>
      </footer>
    </div>
  );
}
