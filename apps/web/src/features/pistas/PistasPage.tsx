import { usePistasPage } from './hooks/usePistasPage.ts';
import { PistasView } from './views/PistasView.tsx';

export function PistasPage() { return <PistasView {...usePistasPage()} />; }
