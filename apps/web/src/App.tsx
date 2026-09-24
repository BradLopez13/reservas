import { SesionProvider } from './features/auth/SesionProvider.tsx';
import { Rutas } from './rutas.tsx';

export function App() {
  return <SesionProvider><Rutas /></SesionProvider>;
}
