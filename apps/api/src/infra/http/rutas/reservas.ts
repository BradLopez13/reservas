import { createHash } from 'node:crypto';
import type { FastifyInstance } from 'fastify';
import { CrearReservaBodySchema, type Reserva as ReservaDto } from '@reservas/contracts';
import { z } from 'zod';
import type { Dependencias } from '../../../app.ts';
import { cancelarReserva } from '../../../application/cancelarReserva.ts';
import { misReservas } from '../../../application/misReservas.ts';
import { reservarPista } from '../../../application/reservarPista.ts';
import { ErrorDominio, IdempotenciaConflicto, IdempotenciaEnCurso } from '../../../domain/errores.ts';
import type { Reserva } from '../../../domain/reserva.ts';
import { exigirSesion } from '../plugins/sesion.ts';

// Entidad → contrato.
export const aDto = (r: Reserva): ReservaDto => ({
  id: r.id, pistaId: r.pistaId, pistaNombre: r.pistaNombre, deporte: r.deporte,
  inicio: r.periodo.inicio.toISOString(), fin: r.periodo.fin.toISOString(), estado: r.estado,
});

export function rutasReservas(app: FastifyInstance, deps: Dependencias) {
  const uc = { db: deps.db, pistas: deps.repos.pistas, reservas: deps.repos.reservas, idempotencia: deps.repos.idempotencia, ahora: deps.ahora };

  app.post('/api/reservas', { preHandler: exigirSesion }, async (req, reply) => {
    const clave = z.uuid().parse(req.headers['idempotency-key']);
    const body = CrearReservaBodySchema.parse(req.body);
    const usuarioId = req.sesion!.usuario.id;
    const hashPeticion = createHash('sha256').update(JSON.stringify(body)).digest('hex');

    // La marca "en curso" se confirma en su propia transacción, para que las
    // peticiones concurrentes con la misma clave la vean.
    const inicio = await deps.db.transaction((tx) => deps.repos.idempotencia.iniciar(tx, { usuarioId, clave, hashPeticion, ahora: deps.ahora() }));
    if (inicio.estado === 'en_curso') throw new IdempotenciaEnCurso();
    if (inicio.estado === 'conflicto') throw new IdempotenciaConflicto();
    if (inicio.estado === 'terminada') return reply.status(inicio.estadoHttp).send(inicio.respuesta);

    try {
      const reserva = aDto(await reservarPista(uc, { usuarioId, pistaId: body.pistaId, inicio: new Date(body.inicio) }));
      await deps.db.transaction((tx) => deps.repos.idempotencia.terminar(tx, { usuarioId, clave, estadoHttp: 201, respuesta: reserva }));
      return reply.status(201).send(reserva);
    } catch (e) {
      if (e instanceof ErrorDominio) {
        // Un 409 o un 422 también es una respuesta definitiva: repetir la clave devuelve lo mismo.
        await deps.db.transaction((tx) => deps.repos.idempotencia.terminar(tx, { usuarioId, clave, estadoHttp: e.status, respuesta: { error: { code: e.code, message: e.message } } }));
      } else {
        await deps.db.transaction((tx) => deps.repos.idempotencia.abandonar(tx, { usuarioId, clave }));
      }
      throw e;
    }
  });

  app.get('/api/reservas/mias', { preHandler: exigirSesion }, async (req) => (await misReservas(uc, req.sesion!.usuario.id)).map(aDto));

  app.delete('/api/reservas/:id', { preHandler: exigirSesion }, async (req, reply) => {
    const { id } = z.object({ id: z.uuid() }).parse(req.params);
    await cancelarReserva(uc, { usuarioId: req.sesion!.usuario.id, reservaId: id });
    return reply.status(204).send();
  });
}
