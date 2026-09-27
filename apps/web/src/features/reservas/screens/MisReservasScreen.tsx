import { useMisReservasPage } from './hooks/useMisReservasPage.ts';
import { MisReservasView } from './views/MisReservasView.tsx';

export function MisReservasPage() { return <MisReservasView {...useMisReservasPage()} />; }
