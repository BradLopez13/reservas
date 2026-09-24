import cookie from '@fastify/cookie';
import type { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import type { Contexto } from '../../../contexto.ts';
import { NoAutenticado } from '../../../shared/errores.ts';
import { expiracion, TOCAR_CADA_MS } from '../domain/sesion.ts';
import { hashToken } from './token.ts';
import '../../../shared/http/request.d.ts';

// Resuelve la cookie en `req.sesion` en cada petición. Las rutas que exigen
// sesión usan `exigirSesion` como preHandler.
export async function registrarSesion(app: FastifyInstance, ctx: Contexto) {
  await app.register(cookie);
  app.decorateRequest('sesion', null);

  app.addHook('preHandler', async (req) => {
    const token = req.cookies[ctx.config.cookieName];
    if (!token) return;
    const ahora = ctx.ahora();
    const sesion = await ctx.db.transaction((tx) => ctx.repos.sesiones.buscarPorTokenHash(tx, hashToken(token)));
    if (!sesion || sesion.expiraEn <= ahora) return;
    const usuario = await ctx.db.transaction((tx) => ctx.repos.usuarios.buscarPorId(tx, sesion.usuarioId));
    if (!usuario) return;
    // Caducidad deslizante, escribiendo como mucho una vez por hora.
    if (ahora.getTime() - sesion.ultimoUso.getTime() > TOCAR_CADA_MS) {
      await ctx.db.transaction((tx) => ctx.repos.sesiones.tocar(tx, sesion.id, ahora, expiracion(sesion.creadaEn, ahora)));
    }
    req.sesion = { usuario: { id: usuario.id, email: usuario.email, nombre: usuario.nombre }, sesionId: sesion.id };
  });
}

export async function exigirSesion(req: FastifyRequest) { if (!req.sesion) throw new NoAutenticado(); }

const opciones = (ctx: Contexto) => ({ httpOnly: true, secure: ctx.config.cookieSecure, sameSite: 'lax' as const, path: '/' });

export function ponerCookie(reply: FastifyReply, ctx: Contexto, token: string) {
  reply.setCookie(ctx.config.cookieName, token, { ...opciones(ctx), maxAge: 30 * 24 * 60 * 60 });
}
export function borrarCookie(reply: FastifyReply, ctx: Contexto) {
  reply.clearCookie(ctx.config.cookieName, opciones(ctx));
}
