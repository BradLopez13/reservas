import { useState, type FormEvent } from 'react';
import { cambiarPassword, cerrarSesiones } from '../../api/auth.ts';
import { Aviso } from '../../components/Aviso.tsx';
import { useSesion } from './SesionProvider.tsx';

export function AjustesPage() {
  const { usuario, salir } = useSesion();
  const [msg, setMsg] = useState<{ tipo: 'ok' | 'error'; texto: string } | null>(null);

  async function cambiar(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const f = new FormData(form);
    try {
      await cambiarPassword({ actual: String(f.get('actual')), nueva: String(f.get('nueva')) });
      setMsg({ tipo: 'ok', texto: 'Contraseña cambiada. Las demás sesiones se han cerrado.' });
      form.reset();
    } catch {
      setMsg({ tipo: 'error', texto: 'La contraseña actual no es correcta o la nueva es demasiado corta.' });
    }
  }

  return (
    <div className="mx-auto flex max-w-sm flex-col gap-6">
      <h1 className="text-2xl font-bold">Cuenta de {usuario?.nombre}</h1>
      {msg && <Aviso tipo={msg.tipo}>{msg.texto}</Aviso>}
      <form onSubmit={cambiar} className="flex flex-col gap-3">
        <h2 className="font-semibold">Cambiar contraseña</h2>
        <input name="actual" type="password" required placeholder="Actual" autoComplete="current-password" className="rounded border px-3 py-2" />
        <input name="nueva" type="password" required minLength={10} placeholder="Nueva (mínimo 10)" autoComplete="new-password" className="rounded border px-3 py-2" />
        <button className="rounded bg-emerald-700 px-4 py-2 font-medium text-white">Cambiar</button>
      </form>
      <div className="flex flex-col gap-2">
        <h2 className="font-semibold">Sesiones</h2>
        <button onClick={async () => { await cerrarSesiones(); await salir(); }} className="rounded border px-4 py-2 text-left hover:bg-neutral-100">
          Cerrar sesión en todos los dispositivos
        </button>
      </div>
    </div>
  );
}
