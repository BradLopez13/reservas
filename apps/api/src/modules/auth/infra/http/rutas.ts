import type { FastifyInstance } from 'fastify';
import type { Contexto } from '../../../../contexto.ts';
import { cambiarPassword } from './handlers/cambiarPassword.ts';
import { cerrarSesiones } from './handlers/cerrarSesiones.ts';
import { login } from './handlers/login.ts';
import { logout } from './handlers/logout.ts';
import { registro } from './handlers/registro.ts';
import { yo } from './handlers/yo.ts';
import { exigirSesion } from './sesion.plugin.ts';

// Controlador: solo une cada ruta con su handler y su guard.
export function rutasAuth(app: FastifyInstance, ctx: Contexto) {
  const privada = { preHandler: exigirSesion };
  app.post('/api/auth/registro', registro(ctx));
  app.post('/api/auth/login', login(ctx));
  app.post('/api/auth/logout', logout(ctx));
  app.get('/api/auth/yo', privada, yo());
  app.post('/api/auth/cerrar-sesiones', privada, cerrarSesiones(ctx));
  app.put('/api/auth/password', privada, cambiarPassword(ctx));
}
