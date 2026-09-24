import { CredencialesInvalidas } from '../domain/errores.ts';
import { hashPassword, verificarPassword } from '../infra/seguridad/password.ts';
import type { DepsAuth } from './deps.ts';

export async function cambiarPassword(deps: DepsAuth, d: { usuarioId: string; sesionId: string; actual: string; nueva: string }) {
  const usuario = await deps.db.transaction((tx) => deps.usuarios.buscarPorId(tx, d.usuarioId));
  if (!usuario || !(await verificarPassword(usuario.passwordHash, d.actual))) throw new CredencialesInvalidas();
  const passwordHash = await hashPassword(d.nueva);
  await deps.db.transaction(async (tx) => {
    await deps.usuarios.actualizarPassword(tx, d.usuarioId, passwordHash);
    await deps.sesiones.borrarDeUsuario(tx, d.usuarioId, d.sesionId); // expulsa a las demás sesiones
  });
}
