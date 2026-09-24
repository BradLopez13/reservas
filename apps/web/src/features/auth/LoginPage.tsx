import { useLoginPage } from './hooks/useLoginPage.ts';
import { LoginView } from './views/LoginView.tsx';

export function LoginPage() { return <LoginView {...useLoginPage()} />; }
