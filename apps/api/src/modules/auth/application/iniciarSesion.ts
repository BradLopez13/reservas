import type { Ctx } from '../../../contexto.ts';
import { CredencialesInvalidas, DemasiadosIntentos } from '../../../shared/errores.ts';
import { expiracion } from '../domain/sesion.ts';
import { HASH_RELLENO, verificarPassword } from '../infra/password.ts';
import { generarToken } from '../infra/token.ts';

export const MAX_INTENTOS = 5;
export const VENTANA_MS = 15 * 60 * 1000;

export async function iniciarSesion(ctx: Ctx, datos: { email: string; password: string; ip: string }) {
  const ahora = ctx.ahora();
  const clave = `${datos.email}|${datos.ip}`;
  const { n, masAntiguo } = await ctx.db.transaction((tx) => ctx.repos.intentos.contar(tx, clave, new Date(ahora.getTime() - VENTANA_MS)));
  if (n >= MAX_INTENTOS && masAntiguo) {
    throw new DemasiadosIntentos(Math.ceil((masAntiguo.getTime() + VENTANA_MS - ahora.getTime()) / 1000));
  }
  const usuario = await ctx.db.transaction((tx) => ctx.repos.usuarios.buscarPorEmail(tx, datos.email));
  // Mismo coste y mismo error exista o no el email.
  const ok = await verificarPassword(usuario?.passwordHash ?? HASH_RELLENO, datos.password);
  if (!usuario || !ok) {
    await ctx.db.transaction((tx) => ctx.repos.intentos.registrar(tx, clave, ahora));
    throw new CredencialesInvalidas();
  }
  // Token nuevo en cada login: nunca se reutiliza el que traiga la petición.
  const { token, hash } = generarToken();
  await ctx.db.transaction(async (tx) => {
    await ctx.repos.intentos.limpiar(tx, clave);
    await ctx.repos.sesiones.crear(tx, { usuarioId: usuario.id, tokenHash: hash, creadaEn: ahora, expiraEn: expiracion(ahora, ahora) });
  });
  return { usuario: { id: usuario.id, email: usuario.email, nombre: usuario.nombre }, token };
}
