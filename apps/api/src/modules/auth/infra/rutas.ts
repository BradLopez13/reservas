import type { FastifyInstance } from 'fastify';
import { CambiarPasswordBodySchema, LoginBodySchema, RegistroBodySchema } from '@reservas/contracts';
import type { Contexto } from '../../../contexto.ts';
import { entrada } from '../../../shared/http/validar.ts';
import { cambiarPassword } from '../application/cambiarPassword.ts';
import { cerrarSesion, cerrarTodasLasSesiones } from '../application/cerrarSesion.ts';
import { iniciarSesion } from '../application/iniciarSesion.ts';
import { registrar } from '../application/registrar.ts';
import { borrarCookie, exigirSesion, ponerCookie } from './sesion.plugin.ts';

export function rutasAuth(app: FastifyInstance, ctx: Contexto) {
  app.post('/api/auth/registro', async (req, reply) => {
    const { usuario, token } = await registrar(ctx, entrada.body(req, RegistroBodySchema));
    ponerCookie(reply, ctx, token);
    return reply.status(201).send(usuario);
  });

  app.post('/api/auth/login', async (req, reply) => {
    const { token } = await iniciarSesion(ctx, { ...entrada.body(req, LoginBodySchema), ip: req.ip });
    ponerCookie(reply, ctx, token);
    return reply.status(204).send();
  });

  app.post('/api/auth/logout', async (req, reply) => {
    if (req.sesion) await cerrarSesion(ctx, req.sesion.sesionId);
    borrarCookie(reply, ctx);
    return reply.status(204).send();
  });

  app.get('/api/auth/yo', { preHandler: exigirSesion }, async (req) => req.sesion!.usuario);

  app.post('/api/auth/cerrar-sesiones', { preHandler: exigirSesion }, async (req, reply) => {
    await cerrarTodasLasSesiones(ctx, req.sesion!.usuario.id);
    borrarCookie(reply, ctx);
    return reply.status(204).send();
  });

  app.put('/api/auth/password', { preHandler: exigirSesion }, async (req, reply) => {
    const b = entrada.body(req, CambiarPasswordBodySchema);
    await cambiarPassword(ctx, { usuarioId: req.sesion!.usuario.id, sesionId: req.sesion!.sesionId, actual: b.actual, nueva: b.nueva });
    return reply.status(204).send();
  });
}
