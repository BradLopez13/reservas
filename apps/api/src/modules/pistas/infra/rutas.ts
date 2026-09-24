import type { FastifyInstance } from 'fastify';
import { FranjasQuerySchema, PistasQuerySchema } from '@reservas/contracts';
import type { Contexto } from '../../../contexto.ts';
import { entrada, idDeRuta } from '../../../shared/http/validar.ts';
import { consultarFranjas } from '../application/consultarFranjas.ts';

// Consultar pistas y disponibilidad no exige sesión: cualquiera puede mirar antes de registrarse.
export function rutasPistas(app: FastifyInstance, ctx: Contexto) {
  app.get('/api/pistas', async (req) => {
    const { deporte } = entrada.query(req, PistasQuerySchema);
    return ctx.db.transaction((tx) => ctx.repos.pistas.listar(tx, deporte));
  });

  app.get('/api/pistas/:id/franjas', async (req) => {
    const { fecha } = entrada.query(req, FranjasQuerySchema);
    return consultarFranjas(ctx, idDeRuta(req), fecha);
  });
}
