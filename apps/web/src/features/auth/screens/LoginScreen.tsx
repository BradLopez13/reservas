import { LoginView } from '../components/LoginView.tsx';
import { useLogin } from '../hooks/useLogin.ts';

// Controlador: une la lógica con la vista.
export function LoginScreen() { return <LoginView {...useLogin()} />; }
