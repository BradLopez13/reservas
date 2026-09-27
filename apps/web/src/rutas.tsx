import { Route, Routes } from 'react-router';
import { RutaPrivada } from './features/auth/components/RutaPrivada.tsx';
import { AjustesScreen } from './features/auth/screens/AjustesScreen.tsx';
import { LoginScreen } from './features/auth/screens/LoginScreen.tsx';
import { RegistroScreen } from './features/auth/screens/RegistroScreen.tsx';
import { FranjasDiaScreen } from './features/pistas/screens/FranjasDiaScreen.tsx';
import { PistasScreen } from './features/pistas/screens/PistasScreen.tsx';
import { MisReservasScreen } from './features/reservas/screens/MisReservasScreen.tsx';
import { Layout } from './shared/components/Layout.tsx';

export function Rutas() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<PistasScreen />} />
        <Route path="/pistas/:id" element={<FranjasDiaScreen />} />
        <Route path="/login" element={<LoginScreen />} />
        <Route path="/registro" element={<RegistroScreen />} />
        <Route path="/mis-reservas" element={<RutaPrivada><MisReservasScreen /></RutaPrivada>} />
        <Route path="/ajustes" element={<RutaPrivada><AjustesScreen /></RutaPrivada>} />
      </Route>
    </Routes>
  );
}
