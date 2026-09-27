import { useAjustesPage } from './hooks/useAjustesPage.ts';
import { AjustesView } from './views/AjustesView.tsx';

export function AjustesPage() { return <AjustesView {...useAjustesPage()} />; }
