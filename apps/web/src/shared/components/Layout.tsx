import { GithubLogo, SignOut, UserCircle } from '@phosphor-icons/react';
import { motion } from 'motion/react';
import { useEffect, useState } from 'react';
import { Link, NavLink, Outlet, useLocation } from 'react-router';
import { useSesion } from '../../features/auth/providers/SesionProvider.tsx';
import { useReducedMotion } from '../hooks/useReducedMotion.ts';
import { Boton, estilosBoton } from './Boton.tsx';
import { LineasPista } from './LineasPista.tsx';
import { Marca } from './Marca.tsx';

export const REPO_URL = 'https://github.com/BradLopez13/reservas';

// Capas: menú móvil 40, barra flotante 50, diálogos 60, grano 70 (sin eventos).
const enlaceNav = ({ isActive }: { isActive: boolean }) =>
  `rounded-full px-3.5 py-2 text-sm transition-colors duration-500 ease-suave ${isActive ? 'bg-superficie-2 text-tinta' : 'text-tinta-2 hover:text-tinta'}`;

const enlaceMovil = ({ isActive }: { isActive: boolean }) =>
  `block font-display text-4xl font-semibold tracking-tight ${isActive ? 'text-acento' : 'text-tinta'}`;

const enlacePie = 'text-sm text-tinta-2 transition-colors duration-500 ease-suave hover:text-tinta';

const GRANO =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")";

export function Layout() {
  const { usuario, salir } = useSesion();
  const [menuAbierto, setMenuAbierto] = useState(false);
  const { pathname } = useLocation();
  const reducido = useReducedMotion();

  // El menú móvil se cierra al cambiar de página y bloquea el scroll mientras está abierto.
  useEffect(() => setMenuAbierto(false), [pathname]);
  useEffect(() => {
    document.body.style.overflow = menuAbierto ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [menuAbierto]);

  const rutas = [
    { a: '/', texto: 'Pistas', fin: true },
    ...(usuario ? [{ a: '/mis-reservas', texto: 'Mis reservas', fin: false }] : []),
    { a: '/como-funciona', texto: 'Cómo funciona', fin: false },
    { a: '/normas', texto: 'Normas', fin: false },
  ];

  const enlacesSesion = usuario ? (
    <>
      <NavLink to="/ajustes" className={enlaceNav}>
        <span className="inline-flex items-center gap-1.5"><UserCircle size={18} weight="light" aria-hidden="true" />{usuario.nombre}</span>
      </NavLink>
      <Boton variante="secundario" tamano="sm" onClick={() => void salir()}><SignOut size={16} weight="light" aria-hidden="true" />Salir</Boton>
    </>
  ) : (
    <>
      <NavLink to="/login" className={enlaceNav}>Entrar</NavLink>
      <Link to="/registro" className={estilosBoton('primario', 'sm')}>Crear cuenta</Link>
    </>
  );

  return (
    <div className="relative flex min-h-[100dvh] w-full max-w-full flex-col overflow-x-hidden">
      {/* Ambiente: dos halos lima muy tenues y grano fijo por encima de todo. */}
      <div aria-hidden="true" className="pointer-events-none fixed inset-0 -z-10 bg-[radial-gradient(60%_50%_at_10%_0%,oklch(91%_0.19_118/0.10),transparent_60%),radial-gradient(50%_40%_at_100%_100%,oklch(91%_0.19_118/0.07),transparent_60%)]" />
      <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-[70] opacity-[0.045] mix-blend-overlay" style={{ backgroundImage: GRANO }} />

      <header className="fixed inset-x-0 top-4 z-50 flex justify-center px-4">
        <nav aria-label="Principal" className="flex h-14 w-full max-w-4xl items-center gap-1 rounded-full border border-borde bg-fondo/70 pl-2 pr-2 shadow-tarjeta backdrop-blur-xl lg:w-max">
          <Link to="/" className="flex items-center gap-2.5 rounded-full py-1.5 pl-1.5 pr-3 font-display text-lg font-semibold tracking-tight text-tinta">
            <Marca tamano={26} />Reservas
          </Link>
          <div className="hidden items-center gap-0.5 lg:flex">
            {rutas.map((r) => <NavLink key={r.a} to={r.a} end={r.fin} className={enlaceNav}>{r.texto}</NavLink>)}
          </div>
          <div className="ml-auto hidden items-center gap-1 lg:flex lg:pl-4">{enlacesSesion}</div>
          <button
            type="button"
            onClick={() => setMenuAbierto((v) => !v)}
            aria-expanded={menuAbierto}
            aria-controls="menu-movil"
            aria-label={menuAbierto ? 'Cerrar menú' : 'Abrir menú'}
            className="relative ml-auto grid size-10 place-items-center rounded-full text-tinta transition-colors hover:bg-superficie-2 lg:hidden"
          >
            <span aria-hidden="true" className={`absolute h-px w-5 bg-current transition-transform duration-500 ease-suave ${menuAbierto ? 'rotate-45' : '-translate-y-[3.5px]'}`} />
            <span aria-hidden="true" className={`absolute h-px w-5 bg-current transition-transform duration-500 ease-suave ${menuAbierto ? '-rotate-45' : 'translate-y-[3.5px]'}`} />
          </button>
        </nav>
      </header>

      {menuAbierto && (
        <div id="menu-movil" className="fixed inset-0 z-40 flex flex-col justify-end bg-fondo/85 px-6 pb-12 pt-24 backdrop-blur-3xl lg:hidden">
          <nav aria-label="Menú" className="flex flex-col gap-5">
            {rutas.map((r, i) => (
              <motion.div key={r.a} initial={reducido ? false : { opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 + i * 0.06, duration: 0.7, ease: [0.32, 0.72, 0, 1] }}>
                <NavLink to={r.a} end={r.fin} className={enlaceMovil}>{r.texto}</NavLink>
              </motion.div>
            ))}
          </nav>
          <motion.div
            initial={reducido ? false : { opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 + rutas.length * 0.06, duration: 0.7, ease: [0.32, 0.72, 0, 1] }}
            className="mt-10 flex items-center gap-2 border-t border-borde pt-6"
          >
            {enlacesSesion}
          </motion.div>
        </div>
      )}

      <main className="flex-1 pt-24"><Outlet /></main>

      <footer className="relative mt-24 overflow-hidden border-t border-borde bg-pista">
        <LineasPista className="opacity-[0.07]" />
        <div className="relative mx-auto grid max-w-6xl gap-10 px-4 py-20 sm:px-6 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div className="flex flex-col gap-3">
            <Link to="/" className="flex items-center gap-2.5 font-display text-lg font-semibold tracking-tight text-tinta"><Marca />Reservas</Link>
            <p className="max-w-[34ch] text-sm leading-relaxed text-tinta-2">
              Pistas de pádel, tenis y fútbol por franjas. Un proyecto de portfolio de Brad López con el código abierto.
            </p>
          </div>
          <nav aria-label="Reservar" className="flex flex-col gap-2.5">
            <p className="text-sm font-semibold text-tinta">Reservar</p>
            <Link to="/" className={enlacePie}>Pistas</Link>
            {usuario ? <Link to="/mis-reservas" className={enlacePie}>Mis reservas</Link> : <Link to="/login" className={enlacePie}>Entrar</Link>}
            {usuario ? <Link to="/ajustes" className={enlacePie}>Ajustes</Link> : <Link to="/registro" className={enlacePie}>Crear cuenta</Link>}
          </nav>
          <nav aria-label="Información" className="flex flex-col gap-2.5">
            <p className="text-sm font-semibold text-tinta">Información</p>
            <Link to="/como-funciona" className={enlacePie}>Cómo funciona</Link>
            <Link to="/normas" className={enlacePie}>Normas de reserva</Link>
            <Link to="/sobre-el-proyecto" className={enlacePie}>Sobre el proyecto</Link>
            <Link to="/privacidad" className={enlacePie}>Privacidad</Link>
          </nav>
          <div className="flex flex-col gap-2.5">
            <p className="text-sm font-semibold text-tinta">Código</p>
            <a href={REPO_URL} target="_blank" rel="noreferrer" className={`inline-flex items-center gap-1.5 ${enlacePie}`}>
              <GithubLogo size={16} weight="light" aria-hidden="true" />Repositorio en GitHub
            </a>
            <a href="https://unsplash.com" target="_blank" rel="noreferrer" className={enlacePie}>Fotos de Unsplash</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
