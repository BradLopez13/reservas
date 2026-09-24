import { useRegistroPage } from './hooks/useRegistroPage.ts';
import { RegistroView } from './views/RegistroView.tsx';

export function RegistroPage() { return <RegistroView {...useRegistroPage()} />; }
