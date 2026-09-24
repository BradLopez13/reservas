import { EmailEnUso } from '../domain/errores.ts';
import { expiracion } from '../domain/sesion.ts';
import { hashPassword } from '../infra/seguridad/password.ts';
import { generarToken } from '../infra/seguridad/token.ts';
import type { DepsAuth } from './deps.ts';

export async function registrar(deps: DepsAuth, datos: { email: string; password: string; nombre: string }) {
  const passwordHash = await hashPassword(datos.password);
  const { token, hash } = generarToken();
  const ahora = deps.ahora();
  return deps.db.transaction(async (tx) => {
    if (await deps.usuarios.buscarPorEmail(tx, datos.email)) throw new EmailEnUso();
    const usuario = await deps.usuarios.crear(tx, { email: datos.email, passwordHash, nombre: datos.nombre });
    await deps.sesiones.crear(tx, { usuarioId: usuario.id, tokenHash: hash, expiraEn: expiracion(ahora, ahora) });
    return { usuario, token };
  });
}
