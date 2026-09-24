import type { FastifyInstance } from 'fastify';
import { OrigenNoPermitido } from '../../../domain/errores.ts';

const SEGUROS = new Set(['GET', 'HEAD', 'OPTIONS']);

// Segunda defensa CSRF, además de SameSite=Lax: toda petición que modifica datos
// tiene que venir de la propia app.
export function registrarOrigen(app: FastifyInstance, appOrigin: string) {
  app.addHook('onRequest', async (req) => {
    if (SEGUROS.has(req.method)) return;
    if (req.headers.origin !== appOrigin) throw new OrigenNoPermitido();
  });
}
