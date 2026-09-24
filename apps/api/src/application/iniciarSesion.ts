import { CredencialesInvalidas, DemasiadosIntentos } from '../domain/errores.ts';
import { expiracion } from '../domain/sesion.ts';
import { HASH_RELLENO, verificarPassword } from '../infra/seguridad/password.ts';
import { generarToken } from '../infra/seguridad/token.ts';
import type { DepsAuth } from './deps.ts';

export const MAX_INTENTOS = 5;
export const VENTANA_MS = 15 * 60 * 1000;

export async function iniciarSesion(deps: DepsAuth, datos: { email: string; password: string; ip: string }) {
  const ahora = deps.ahora();
  const clave = `${datos.email}|${datos.ip}`;
  const { n, masAntiguo } = await deps.db.transaction((tx) => deps.intentos.contar(tx, clave, new Date(ahora.getTime() - VENTANA_MS)));
  if (n >= MAX_INTENTOS && masAntiguo) {
    throw new DemasiadosIntentos(Math.ceil((masAntiguo.getTime() + VENTANA_MS - ahora.getTime()) / 1000));
  }
  const usuario = await deps.db.transaction((tx) => deps.usuarios.buscarPorEmail(tx, datos.email));
  // Mismo coste y mismo error exista o no el email.
  const ok = await verificarPassword(usuario?.passwordHash ?? HASH_RELLENO, datos.password);
  if (!usuario || !ok) {
    await deps.db.transaction((tx) => deps.intentos.registrar(tx, clave, ahora));
    throw new CredencialesInvalidas();
  }
  // Token nuevo en cada login: nunca se reutiliza el que traiga la petición.
  const { token, hash } = generarToken();
  await deps.db.transaction(async (tx) => {
    await deps.intentos.limpiar(tx, clave);
    await deps.sesiones.crear(tx, { usuarioId: usuario.id, tokenHash: hash, expiraEn: expiracion(ahora, ahora) });
  });
  return { usuario: { id: usuario.id, email: usuario.email, nombre: usuario.nombre }, token };
}
