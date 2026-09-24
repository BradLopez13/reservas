import cookie from '@fastify/cookie';
import type { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import type { Dependencias } from '../../../app.ts';
import { NoAutenticado } from '../../../domain/errores.ts';
import { expiracion, TOCAR_CADA_MS } from '../../../domain/sesion.ts';
import { hashToken } from '../../seguridad/token.ts';
import '../contexto.ts';

export async function registrarSesion(app: FastifyInstance, deps: Dependencias) {
  await app.register(cookie);
  app.decorateRequest('sesion', null);

  app.addHook('preHandler', async (req) => {
    const token = req.cookies[deps.config.cookieName];
    if (!token) return;
    const ahora = deps.ahora();
    const sesion = await deps.db.transaction((tx) => deps.repos.sesiones.buscarPorTokenHash(tx, hashToken(token)));
    if (!sesion || sesion.expiraEn <= ahora) return;
    const usuario = await deps.db.transaction((tx) => deps.repos.usuarios.buscarPorId(tx, sesion.usuarioId));
    if (!usuario) return;
    // Caducidad deslizante, escribiendo como mucho una vez por hora.
    if (ahora.getTime() - sesion.ultimoUso.getTime() > TOCAR_CADA_MS) {
      await deps.db.transaction((tx) => deps.repos.sesiones.tocar(tx, sesion.id, ahora, expiracion(sesion.creadaEn, ahora)));
    }
    req.sesion = { usuario: { id: usuario.id, email: usuario.email, nombre: usuario.nombre }, sesionId: sesion.id };
  });
}

export async function exigirSesion(req: FastifyRequest) { if (!req.sesion) throw new NoAutenticado(); }

const opciones = (deps: Dependencias) => ({ httpOnly: true, secure: deps.config.cookieSecure, sameSite: 'lax' as const, path: '/' });

export function ponerCookie(reply: FastifyReply, deps: Dependencias, token: string) {
  reply.setCookie(deps.config.cookieName, token, { ...opciones(deps), maxAge: 30 * 24 * 60 * 60 });
}
export function borrarCookie(reply: FastifyReply, deps: Dependencias) {
  reply.clearCookie(deps.config.cookieName, opciones(deps));
}
