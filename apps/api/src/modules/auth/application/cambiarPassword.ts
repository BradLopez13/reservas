import type { Ctx } from '../../../contexto.ts';
import { CredencialesInvalidas } from '../../../shared/errores.ts';
import { hashPassword, verificarPassword } from '../infra/password.ts';

export async function cambiarPassword(ctx: Ctx, d: { usuarioId: string; sesionId: string; actual: string; nueva: string }) {
  const usuario = await ctx.db.transaction((tx) => ctx.repos.usuarios.buscarPorId(tx, d.usuarioId));
  if (!usuario || !(await verificarPassword(usuario.passwordHash, d.actual))) throw new CredencialesInvalidas();
  const passwordHash = await hashPassword(d.nueva);
  await ctx.db.transaction(async (tx) => {
    await ctx.repos.usuarios.actualizarPassword(tx, d.usuarioId, passwordHash);
    await ctx.repos.sesiones.borrarDeUsuario(tx, d.usuarioId, d.sesionId); // expulsa a las demás sesiones
  });
}
