import type { FastifyInstance } from 'fastify';
import { ZodError } from 'zod';
import { CodigoError } from '@reservas/contracts';
import { DemasiadosIntentos, ErrorDominio } from '../../../domain/errores.ts';

export function registrarErrores(app: FastifyInstance) {
  app.setNotFoundHandler((_req, reply) => {
    reply.status(404).send({ error: { code: CodigoError.ERROR_INTERNO, message: 'Ruta no encontrada' } });
  });
  app.setErrorHandler((err, _req, reply) => {
    if (err instanceof ZodError) {
      return reply.status(422).send({ error: { code: CodigoError.VALIDACION, message: 'Datos no válidos', details: err.issues } });
    }
    if (err instanceof ErrorDominio) {
      if (err instanceof DemasiadosIntentos) reply.header('retry-after', String(err.retryAfterSeg));
      return reply.status(err.status).send({ error: { code: err.code, message: err.message, details: err.details } });
    }
    app.log.error(err);
    return reply.status(500).send({ error: { code: CodigoError.ERROR_INTERNO, message: 'Error interno' } });
  });
}
