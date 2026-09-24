import { useQueryClient } from '@tanstack/react-query';
import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from 'react';
import { useLocation, useNavigate } from 'react-router';
import type { Usuario } from '@reservas/contracts';
import { logout, yo } from '../../api/auth.ts';
import { alExpirarSesion } from '../../api/cliente.ts';

interface Sesion { usuario: Usuario | null; cargando: boolean; refrescar(): Promise<void>; salir(): Promise<void> }
const Ctx = createContext<Sesion | null>(null);

export function SesionProvider({ children }: { children: ReactNode }) {
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [cargando, setCargando] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();
  const qc = useQueryClient();

  const refrescar = useCallback(async () => {
    try { setUsuario(await yo()); } catch { setUsuario(null); } finally { setCargando(false); }
  }, []);

  useEffect(() => { void refrescar(); }, [refrescar]);

  // Un 401 en cualquier petición manda al login y guarda a dónde volver.
  useEffect(() => {
    alExpirarSesion(() => {
      setUsuario(null);
      qc.clear();
      if (location.pathname !== '/login') navigate('/login', { state: { volverA: location.pathname } });
    });
  }, [navigate, location.pathname, qc]);

  const salir = useCallback(async () => { await logout(); setUsuario(null); qc.clear(); navigate('/login'); }, [navigate, qc]);

  return <Ctx.Provider value={{ usuario, cargando, refrescar, salir }}>{children}</Ctx.Provider>;
}

export function useSesion() {
  const s = useContext(Ctx);
  if (!s) throw new Error('useSesion fuera de SesionProvider');
  return s;
}
