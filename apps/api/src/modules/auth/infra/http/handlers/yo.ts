import type { RouteHandlerMethod } from 'fastify';

// La sesión ya la resolvió el plugin; aquí solo se devuelve.
export const yo = (): RouteHandlerMethod => async (req) => req.sesion!.usuario;
