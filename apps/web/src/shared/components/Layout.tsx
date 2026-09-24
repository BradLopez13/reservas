import { Link, NavLink, Outlet } from 'react-router';
import { useSesion } from '../../features/auth/SesionProvider.tsx';

export function Layout() {
  const { usuario, salir } = useSesion();
  const enlace = ({ isActive }: { isActive: boolean }) => (isActive ? 'font-semibold text-emerald-700' : 'text-neutral-600 hover:text-neutral-900');
  return (
    <div className="min-h-screen bg-neutral-50 text-neutral-900">
      <header className="border-b bg-white">
        <nav className="mx-auto flex max-w-4xl items-center gap-6 px-4 py-3">
          <Link to="/" className="text-lg font-bold">Reservas</Link>
          <NavLink to="/" end className={enlace}>Pistas</NavLink>
          {usuario && <NavLink to="/mis-reservas" className={enlace}>Mis reservas</NavLink>}
          <span className="ml-auto flex items-center gap-4 text-sm">
            {usuario ? (
              <>
                <NavLink to="/ajustes" className={enlace}>{usuario.nombre}</NavLink>
                <button onClick={() => void salir()} className="text-neutral-600 hover:text-neutral-900">Salir</button>
              </>
            ) : (
              <>
                <NavLink to="/login" className={enlace}>Entrar</NavLink>
                <NavLink to="/registro" className={enlace}>Crear cuenta</NavLink>
              </>
            )}
          </span>
        </nav>
      </header>
      <main className="mx-auto max-w-4xl px-4 py-6"><Outlet /></main>
    </div>
  );
}
