import { eq, sql } from 'drizzle-orm';
import { PistaOcupadaError } from '../../domain/errores.ts';
import type { ReservaRepository } from '../../domain/ports.ts';
import { pistas } from '../db/schema.ts';
import { comunes, haySolape, insertar } from './reservas.base.ts';

// Bloqueo pesimista: se bloquea la fila de la pista y las peticiones que compiten
// esperan en fila. Al salir del bloqueo se ve lo que la anterior ha confirmado
// (READ COMMITTED), así que la comprobación de solapes es fiable.
export const reservaRepositoryPesimista: ReservaRepository = {
  ...comunes,
  async crear(tx, d) {
    await tx.execute(sql`SELECT id FROM ${pistas} WHERE ${eq(pistas.id, d.pistaId)} FOR UPDATE`);
    if (await haySolape(tx, d.pistaId, d.periodo)) throw new PistaOcupadaError();
    return insertar(tx, d);
  },
};
