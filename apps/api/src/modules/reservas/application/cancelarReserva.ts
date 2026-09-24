import type { Ctx } from '../../../contexto.ts';
import { FueraDePlazo, ReservaNoEncontrada } from '../../../shared/errores.ts';
import { puedeCancelar } from '../domain/reglas.ts';

export async function cancelarReserva(ctx: Ctx, d: { usuarioId: string; reservaId: string }) {
  await ctx.db.transaction(async (tx) => {
    const r = await ctx.repos.reservas.buscarPorId(tx, d.reservaId);
    // 404 también para la reserva de otra persona: no se revela que existe.
    if (!r || r.usuarioId !== d.usuarioId || r.estado !== 'confirmada') throw new ReservaNoEncontrada();
    if (!puedeCancelar(r.periodo.inicio, ctx.ahora())) throw new FueraDePlazo();
    await ctx.repos.reservas.cancelar(tx, r.id);
  });
}
