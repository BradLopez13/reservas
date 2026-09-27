import type { FastifyInstance } from 'fastify';
import type { Contexto } from '../../../../contexto.ts';
import { franjasDeUnDia } from './handlers/franjasDeUnDia.ts';
import { listarPistas } from './handlers/listarPistas.ts';

// Consultar pistas y disponibilidad no exige sesión: cualquiera puede mirar antes de registrarse.
export function rutasPistas(app: FastifyInstance, ctx: Contexto) {
  app.get('/api/pistas', listarPistas(ctx));
  app.get('/api/pistas/:id/franjas', franjasDeUnDia(ctx));
}
