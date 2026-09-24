import { Route, Routes } from 'react-router';
import { Layout } from './shared/components/Layout.tsx';
import { AjustesPage } from './features/auth/AjustesPage.tsx';
import { LoginPage } from './features/auth/LoginPage.tsx';
import { RegistroPage } from './features/auth/RegistroPage.tsx';
import { RutaPrivada } from './features/auth/RutaPrivada.tsx';
import { FranjasDia } from './features/pistas/FranjasDia.tsx';
import { PistasPage } from './features/pistas/PistasPage.tsx';
import { MisReservasPage } from './features/reservas/MisReservasPage.tsx';

export function Rutas() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<PistasPage />} />
        <Route path="/pistas/:id" element={<FranjasDia />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/registro" element={<RegistroPage />} />
        <Route path="/mis-reservas" element={<RutaPrivada><MisReservasPage /></RutaPrivada>} />
        <Route path="/ajustes" element={<RutaPrivada><AjustesPage /></RutaPrivada>} />
      </Route>
    </Routes>
  );
}
