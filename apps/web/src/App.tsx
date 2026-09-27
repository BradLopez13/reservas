import { SesionProvider } from './features/auth/providers/SesionProvider.tsx';
import { Rutas } from './rutas.tsx';

export function App() {
  return <SesionProvider><Rutas /></SesionProvider>;
}
