import { and, eq, lt } from 'drizzle-orm';
import type { IdempotenciaRepository } from '../domain/ports.ts';
import { idempotencia } from '../../../shared/db/schema.ts';

const CADUCIDAD_MS = 24 * 60 * 60 * 1000;

export const idempotenciaRepository: IdempotenciaRepository = {
  async iniciar(tx, d) {
    await tx.delete(idempotencia).where(and(eq(idempotencia.usuarioId, d.usuarioId), lt(idempotencia.creadaEn, new Date(d.ahora.getTime() - CADUCIDAD_MS))));
    // La fila con respuesta nula es la marca de "en curso"; el INSERT atómico decide quién procesa.
    const insertadas = await tx.insert(idempotencia).values({ usuarioId: d.usuarioId, clave: d.clave, hashPeticion: d.hashPeticion, creadaEn: d.ahora }).onConflictDoNothing().returning();
    if (insertadas.length === 1) return { estado: 'nueva' };
    const fila = await tx.query.idempotencia.findFirst({ where: and(eq(idempotencia.usuarioId, d.usuarioId), eq(idempotencia.clave, d.clave)) });
    if (!fila) return { estado: 'en_curso' };
    if (fila.hashPeticion !== d.hashPeticion) return { estado: 'conflicto' };
    if (fila.estadoHttp === null) return { estado: 'en_curso' };
    return { estado: 'terminada', estadoHttp: fila.estadoHttp, respuesta: fila.respuesta };
  },
  async terminar(tx, d) {
    await tx.update(idempotencia).set({ estadoHttp: d.estadoHttp, respuesta: d.respuesta }).where(and(eq(idempotencia.usuarioId, d.usuarioId), eq(idempotencia.clave, d.clave)));
  },
  async abandonar(tx, d) {
    await tx.delete(idempotencia).where(and(eq(idempotencia.usuarioId, d.usuarioId), eq(idempotencia.clave, d.clave)));
  },
};
