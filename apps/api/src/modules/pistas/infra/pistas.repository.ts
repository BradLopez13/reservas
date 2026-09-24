import { eq } from 'drizzle-orm';
import type { PistaRepository } from '../domain/ports.ts';
import { pistas } from '../../../shared/db/schema.ts';

// PostgreSQL devuelve `time` como "09:00:00"; el dominio trabaja con "09:00".
const aPista = (f: typeof pistas.$inferSelect) => ({ id: f.id, nombre: f.nombre, deporte: f.deporte, duracionMin: f.duracionMin, apertura: f.apertura.slice(0, 5), cierre: f.cierre.slice(0, 5) });

export const pistaRepository: PistaRepository = {
  async listar(tx, deporte) {
    const filas = await tx.select().from(pistas).where(deporte ? eq(pistas.deporte, deporte) : undefined).orderBy(pistas.nombre);
    return filas.map(aPista);
  },
  async buscarPorId(tx, id) { const f = await tx.query.pistas.findFirst({ where: eq(pistas.id, id) }); return f ? aPista(f) : null; },
};
