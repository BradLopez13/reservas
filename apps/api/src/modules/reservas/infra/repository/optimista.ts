import { and, eq, sql } from 'drizzle-orm';
import { PistaOcupadaError } from '../../domain/errores.ts';
import type { ReservaRepository } from '../../domain/ports.ts';
import { fechaLocal } from '../../domain/tiempo.ts';
import { pistaDias } from '../db/schema.ts';
import { comunes, haySolape, insertar } from './reservas.base.ts';

export class ConflictoVersion extends Error { constructor() { super('La versión del día cambió durante la reserva'); } }

// Bloqueo optimista: nadie espera. Se lee la versión del día, se comprueba, se
// inserta y solo se confirma si la versión sigue siendo la leída. En READ
// COMMITTED, el UPDATE final espera al bloqueo de fila de quien compite y
// reevalúa `version = leída`: si otro confirmó antes, afecta a 0 filas y el
// caso de uso reintenta desde cero (y entonces ve el solape).
export const reservaRepositoryOptimista: ReservaRepository = {
  ...comunes,
  async crear(tx, d) {
    const fecha = fechaLocal(d.periodo.inicio);
    await tx.insert(pistaDias).values({ pistaId: d.pistaId, fecha }).onConflictDoNothing();
    const [dia] = await tx.select({ version: pistaDias.version }).from(pistaDias).where(and(eq(pistaDias.pistaId, d.pistaId), eq(pistaDias.fecha, fecha)));
    if (await haySolape(tx, d.pistaId, d.periodo)) throw new PistaOcupadaError();
    const reserva = await insertar(tx, d);
    const actualizadas = await tx.update(pistaDias).set({ version: sql`${pistaDias.version} + 1` })
      .where(and(eq(pistaDias.pistaId, d.pistaId), eq(pistaDias.fecha, fecha), eq(pistaDias.version, dia!.version))).returning();
    if (actualizadas.length === 0) throw new ConflictoVersion();
    return reserva;
  },
};
