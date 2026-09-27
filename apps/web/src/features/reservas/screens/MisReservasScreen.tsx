import { MisReservasView } from '../components/MisReservasView.tsx';
import { useMisReservas } from '../hooks/useMisReservas.ts';

export function MisReservasScreen() { return <MisReservasView {...useMisReservas()} />; }
