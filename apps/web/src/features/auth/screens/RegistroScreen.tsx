import { RegistroView } from '../components/RegistroView.tsx';
import { useRegistro } from '../hooks/useRegistro.ts';

export function RegistroScreen() { return <RegistroView {...useRegistro()} />; }
