import type { Ctx } from '../../../../contexto.ts';
import { Contencion, FranjaInvalida, PistaNoEncontrada } from '../../../../shared/errores.ts';
import { esFranjaValida } from '../../../pistas/domain/franjas.ts';
import type { Reserva } from '../../domain/reserva.ts';
import { ConflictoVersion } from '../../infra/persistence/reservas/optimista.ts';

const REINTENTOS_OPTIMISTA = 3;

export async function reservarPista(ctx: Ctx, d: { usuarioId: string; pistaId: string; inicio: Date }): Promise<Reserva> {
  const ahora = ctx.ahora();
  for (let intento = 1; ; intento++) {
    try {
      // READ COMMITTED (el nivel por defecto): la pesimista necesita ver, tras el
      // bloqueo, lo que otras transacciones ya han confirmado.
      return await ctx.db.transaction(async (tx) => {
        const pista = await ctx.repos.pistas.buscarPorId(tx, d.pistaId);
        if (!pista) throw new PistaNoEncontrada();
        const v = esFranjaValida(pista, d.inicio, ahora);
        if (!v.ok) throw new FranjaInvalida(v.motivo);
        return ctx.repos.reservas.crear(tx, { pistaId: d.pistaId, usuarioId: d.usuarioId, periodo: v.periodo });
      });
    } catch (e) {
      if (!(e instanceof ConflictoVersion)) throw e;
      // Agotar los reintentos no dice nada de esta franja: la versión es por pista
      // y día, así que la pudo mover una reserva de otra franja.
      if (intento >= REINTENTOS_OPTIMISTA) throw new Contencion();
    }
  }
}
