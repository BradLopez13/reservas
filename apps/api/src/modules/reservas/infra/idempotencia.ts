import { createHash } from 'node:crypto';
import type { FastifyReply, FastifyRequest, RouteHandlerMethod } from 'fastify';
import { z } from 'zod';
import type { Ctx } from '../../../contexto.ts';
import { ErrorDominio, IdempotenciaConflicto, IdempotenciaEnCurso } from '../../../shared/errores.ts';

interface Resultado { status: number; body: unknown }
type Manejador = (req: FastifyRequest, reply: FastifyReply) => Promise<Resultado>;

// Decorador: envuelve un handler para que repetir la misma petición (misma
// `Idempotency-Key` y mismo cuerpo) devuelva la misma respuesta sin volver a
// ejecutarlo. La marca "en curso" se confirma en su propia transacción, para
// que las peticiones concurrentes con la misma clave la vean.
export function conIdempotencia(ctx: Ctx, manejador: Manejador): RouteHandlerMethod {
  return async (req, reply) => {
    const clave = z.uuid().parse(req.headers['idempotency-key']);
    const usuarioId = req.sesion!.usuario.id;
    const hashPeticion = createHash('sha256').update(JSON.stringify(req.body)).digest('hex');
    const registro = { usuarioId, clave };

    const inicio = await ctx.db.transaction((tx) => ctx.repos.idempotencia.iniciar(tx, { ...registro, hashPeticion, ahora: ctx.ahora() }));
    if (inicio.estado === 'en_curso') throw new IdempotenciaEnCurso();
    if (inicio.estado === 'conflicto') throw new IdempotenciaConflicto();
    if (inicio.estado === 'terminada') return reply.status(inicio.estadoHttp).send(inicio.respuesta);

    try {
      const { status, body } = await manejador(req, reply);
      await ctx.db.transaction((tx) => ctx.repos.idempotencia.terminar(tx, { ...registro, estadoHttp: status, respuesta: body }));
      return reply.status(status).send(body);
    } catch (e) {
      if (e instanceof ErrorDominio) {
        // Un 409 o un 422 también es una respuesta definitiva: repetir la clave devuelve lo mismo.
        await ctx.db.transaction((tx) => ctx.repos.idempotencia.terminar(tx, { ...registro, estadoHttp: e.status, respuesta: { error: { code: e.code, message: e.message } } }));
      } else {
        await ctx.db.transaction((tx) => ctx.repos.idempotencia.abandonar(tx, registro));
      }
      throw e;
    }
  };
}
