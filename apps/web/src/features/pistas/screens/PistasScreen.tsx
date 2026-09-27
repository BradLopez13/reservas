import { PistasView } from '../components/PistasView.tsx';
import { usePistas } from '../hooks/usePistas.ts';

export function PistasScreen() { return <PistasView {...usePistas()} />; }
