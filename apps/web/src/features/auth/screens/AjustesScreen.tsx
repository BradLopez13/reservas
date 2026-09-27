import { AjustesView } from '../components/AjustesView.tsx';
import { useAjustes } from '../hooks/useAjustes.ts';

export function AjustesScreen() { return <AjustesView {...useAjustes()} />; }
