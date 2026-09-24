import type { Ctx } from '../../../contexto.ts';
import { EmailEnUso } from '../../../shared/errores.ts';
import { expiracion } from '../domain/sesion.ts';
import { hashPassword } from '../infra/password.ts';
import { generarToken } from '../infra/token.ts';

export async function registrar(ctx: Ctx, datos: { email: string; password: string; nombre: string }) {
  const passwordHash = await hashPassword(datos.password);
  const { token, hash } = generarToken();
  const ahora = ctx.ahora();
  return ctx.db.transaction(async (tx) => {
    if (await ctx.repos.usuarios.buscarPorEmail(tx, datos.email)) throw new EmailEnUso();
    const usuario = await ctx.repos.usuarios.crear(tx, { email: datos.email, passwordHash, nombre: datos.nombre });
    await ctx.repos.sesiones.crear(tx, { usuarioId: usuario.id, tokenHash: hash, creadaEn: ahora, expiraEn: expiracion(ahora, ahora) });
    return { usuario, token };
  });
}
