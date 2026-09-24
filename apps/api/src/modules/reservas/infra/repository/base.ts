import { and, desc, eq, getTableColumns, sql } from 'drizzle-orm';
import type { ReservaRepository } from '../../domain/ports.ts';
import type { Reserva } from '../../domain/reserva.ts';
import type { Tx } from '../../../../shared/db/cliente.ts';
import { pistas, reservas, type Periodo } from '../../../../shared/db/schema.ts';

type Fila = typeof reservas.$inferSelect & { pistaNombre: string; deporte: (typeof pistas.$inferSelect)['deporte'] };
const aReserva = (f: Fila): Reserva => ({ id: f.id, pistaId: f.pistaId, pistaNombre: f.pistaNombre, deporte: f.deporte, usuarioId: f.usuarioId, periodo: f.periodo, estado: f.estado });

const seleccion = () => ({ ...getTableColumns(reservas), pistaNombre: pistas.nombre, deporte: pistas.deporte });
export const rango = (p: Periodo) => sql`tstzrange(${p.inicio.toISOString()}::timestamptz, ${p.fin.toISOString()}::timestamptz, '[)')`;

export async function haySolape(tx: Tx, pistaId: string, periodo: Periodo) {
  const [r] = await tx.select({ n: sql<number>`count(*)` }).from(reservas)
    .where(and(eq(reservas.pistaId, pistaId), eq(reservas.estado, 'confirmada'), sql`${reservas.periodo} && ${rango(periodo)}`));
  return Number(r!.n) > 0;
}

export async function insertar(tx: Tx, d: { pistaId: string; usuarioId: string; periodo: Periodo }): Promise<Reserva> {
  const [f] = await tx.insert(reservas).values(d).returning();
  return (await comunes.buscarPorId(tx, f!.id))!;
}

// Lo que comparten las tres estrategias: todo menos `crear`.
export const comunes: Omit<ReservaRepository, 'crear'> = {
  async listarConfirmadas(tx, pistaId, dia) {
    const filas = await tx.select({ periodo: reservas.periodo }).from(reservas)
      .where(and(eq(reservas.pistaId, pistaId), eq(reservas.estado, 'confirmada'), sql`${reservas.periodo} && ${rango(dia)}`));
    return filas.map((f) => f.periodo);
  },
  async buscarPorId(tx, id) {
    const [f] = await tx.select(seleccion()).from(reservas).innerJoin(pistas, eq(pistas.id, reservas.pistaId)).where(eq(reservas.id, id));
    return f ? aReserva(f) : null;
  },
  async cancelar(tx, id) { await tx.update(reservas).set({ estado: 'cancelada' }).where(eq(reservas.id, id)); },
  async listarDeUsuario(tx, usuarioId) {
    const filas = await tx.select(seleccion()).from(reservas).innerJoin(pistas, eq(pistas.id, reservas.pistaId))
      .where(eq(reservas.usuarioId, usuarioId)).orderBy(desc(reservas.periodo));
    return filas.map(aReserva);
  },
};
