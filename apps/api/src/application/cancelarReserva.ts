import { FueraDePlazo, ReservaNoEncontrada } from '../domain/errores.ts';
import { puedeCancelar } from '../domain/reservas.ts';
import type { DepsReservas } from './reservarPista.ts';

export async function cancelarReserva(deps: DepsReservas, d: { usuarioId: string; reservaId: string }) {
  await deps.db.transaction(async (tx) => {
    const r = await deps.reservas.buscarPorId(tx, d.reservaId);
    // 404 también para la reserva de otra persona: no se revela que existe.
    if (!r || r.usuarioId !== d.usuarioId || r.estado !== 'confirmada') throw new ReservaNoEncontrada();
    if (!puedeCancelar(r.periodo.inicio, deps.ahora())) throw new FueraDePlazo();
    await deps.reservas.cancelar(tx, r.id);
  });
}
