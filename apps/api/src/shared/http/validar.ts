import type { FastifyRequest } from 'fastify';
import { z, type ZodType } from 'zod';

// Toda la entrada HTTP se valida con los esquemas de `contracts` antes de tocar
// el dominio. Un fallo lanza ZodError, que el plugin de errores convierte en 422.
export const entrada = {
  body: <T>(req: FastifyRequest, schema: ZodType<T>): T => schema.parse(req.body),
  query: <T>(req: FastifyRequest, schema: ZodType<T>): T => schema.parse(req.query),
  params: <T>(req: FastifyRequest, schema: ZodType<T>): T => schema.parse(req.params),
};

const IdParam = z.object({ id: z.uuid() });
export const idDeRuta = (req: FastifyRequest) => entrada.params(req, IdParam).id;
