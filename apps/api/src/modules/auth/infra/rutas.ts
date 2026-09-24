import type { FastifyInstance } from 'fastify';
import { CambiarPasswordBodySchema, LoginBodySchema, RegistroBodySchema } from '@reservas/contracts';
import type { Dependencias } from '../../../app.ts';
import { cambiarPassword } from '../../../application/cambiarPassword.ts';
import { cerrarSesion, cerrarTodasLasSesiones } from '../../../application/cerrarSesion.ts';
import { iniciarSesion } from '../../../application/iniciarSesion.ts';
import { registrar } from '../../../application/registrar.ts';
import { borrarCookie, exigirSesion, ponerCookie } from '../plugins/sesion.ts';

export function rutasAuth(app: FastifyInstance, deps: Dependencias) {
  const auth = { db: deps.db, usuarios: deps.repos.usuarios, sesiones: deps.repos.sesiones, intentos: deps.repos.intentos, ahora: deps.ahora };

  app.post('/api/auth/registro', async (req, reply) => {
    const { usuario, token } = await registrar(auth, RegistroBodySchema.parse(req.body));
    ponerCookie(reply, deps, token);
    return reply.status(201).send(usuario);
  });

  app.post('/api/auth/login', async (req, reply) => {
    const { token } = await iniciarSesion(auth, { ...LoginBodySchema.parse(req.body), ip: req.ip });
    ponerCookie(reply, deps, token);
    return reply.status(204).send();
  });

  app.post('/api/auth/logout', async (req, reply) => {
    if (req.sesion) await cerrarSesion(auth, req.sesion.sesionId);
    borrarCookie(reply, deps);
    return reply.status(204).send();
  });

  app.get('/api/auth/yo', { preHandler: exigirSesion }, async (req) => req.sesion!.usuario);

  app.post('/api/auth/cerrar-sesiones', { preHandler: exigirSesion }, async (req, reply) => {
    await cerrarTodasLasSesiones(auth, req.sesion!.usuario.id);
    borrarCookie(reply, deps);
    return reply.status(204).send();
  });

  app.put('/api/auth/password', { preHandler: exigirSesion }, async (req, reply) => {
    const b = CambiarPasswordBodySchema.parse(req.body);
    await cambiarPassword(auth, { usuarioId: req.sesion!.usuario.id, sesionId: req.sesion!.sesionId, actual: b.actual, nueva: b.nueva });
    return reply.status(204).send();
  });
}
