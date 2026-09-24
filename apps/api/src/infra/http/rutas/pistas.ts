import type { FastifyInstance } from 'fastify';
import { FranjasQuerySchema, PistasQuerySchema } from '@reservas/contracts';
import { z } from 'zod';
import type { Dependencias } from '../../../app.ts';
import { consultarFranjas } from '../../../application/consultarFranjas.ts';

// Consultar pistas y disponibilidad no exige sesión: cualquiera puede mirar antes de registrarse.
export function rutasPistas(app: FastifyInstance, deps: Dependencias) {
  app.get('/api/pistas', async (req) => {
    const { deporte } = PistasQuerySchema.parse(req.query);
    return deps.db.transaction((tx) => deps.repos.pistas.listar(tx, deporte));
  });

  app.get('/api/pistas/:id/franjas', async (req) => {
    const { id } = z.object({ id: z.uuid() }).parse(req.params);
    const { fecha } = FranjasQuerySchema.parse(req.query);
    return consultarFranjas({ db: deps.db, pistas: deps.repos.pistas, reservas: deps.repos.reservas }, id, fecha);
  });
}
