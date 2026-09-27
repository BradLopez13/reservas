import { Route, Routes } from 'react-router';
import { RutaPrivada } from './features/auth/components/RutaPrivada.tsx';
import { AjustesScreen } from './features/auth/screens/AjustesScreen.tsx';
import { LoginScreen } from './features/auth/screens/LoginScreen.tsx';
import { RegistroScreen } from './features/auth/screens/RegistroScreen.tsx';
import { ComoFuncionaScreen } from './features/info/screens/ComoFuncionaScreen.tsx';
import { NoEncontradaScreen } from './features/info/screens/NoEncontradaScreen.tsx';
import { NormasScreen } from './features/info/screens/NormasScreen.tsx';
import { PrivacidadScreen } from './features/info/screens/PrivacidadScreen.tsx';
import { SobreProyectoScreen } from './features/info/screens/SobreProyectoScreen.tsx';
import { FranjasDiaScreen } from './features/pistas/screens/FranjasDiaScreen.tsx';
import { PistasScreen } from './features/pistas/screens/PistasScreen.tsx';
import { MisReservasScreen } from './features/reservas/screens/MisReservasScreen.tsx';
import { Contenedor } from './shared/components/Contenedor.tsx';
import { Layout } from './shared/components/Layout.tsx';

export function Rutas() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<PistasScreen />} />
        <Route path="/pistas/:id" element={<Contenedor><FranjasDiaScreen /></Contenedor>} />
        <Route path="/login" element={<Contenedor><LoginScreen /></Contenedor>} />
        <Route path="/registro" element={<Contenedor><RegistroScreen /></Contenedor>} />
        <Route path="/mis-reservas" element={<Contenedor><RutaPrivada><MisReservasScreen /></RutaPrivada></Contenedor>} />
        <Route path="/ajustes" element={<Contenedor><RutaPrivada><AjustesScreen /></RutaPrivada></Contenedor>} />
        <Route path="/como-funciona" element={<Contenedor><ComoFuncionaScreen /></Contenedor>} />
        <Route path="/normas" element={<Contenedor><NormasScreen /></Contenedor>} />
        <Route path="/sobre-el-proyecto" element={<Contenedor><SobreProyectoScreen /></Contenedor>} />
        <Route path="/privacidad" element={<Contenedor><PrivacidadScreen /></Contenedor>} />
        <Route path="*" element={<Contenedor><NoEncontradaScreen /></Contenedor>} />
      </Route>
    </Routes>
  );
}
