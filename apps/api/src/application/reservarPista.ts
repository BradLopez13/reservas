import { FranjaInvalida, PistaNoEncontrada, PistaOcupadaError } from '../domain/errores.ts';
import { esFranjaValida } from '../domain/franjas.ts';
import type { IdempotenciaRepository, PistaRepository, ReservaRepository } from '../domain/ports.ts';
import type { Reserva } from '../domain/reserva.ts';
import type { Db } from '../infra/db/cliente.ts';
import { ConflictoVersion } from '../infra/repositories/reservas.optimista.ts';

export interface DepsReservas { db: Db; pistas: PistaRepository; reservas: ReservaRepository; idempotencia: IdempotenciaRepository; ahora: () => Date }

const REINTENTOS_OPTIMISTA = 3;

export async function reservarPista(deps: DepsReservas, d: { usuarioId: string; pistaId: string; inicio: Date }): Promise<Reserva> {
  const ahora = deps.ahora();
  for (let intento = 1; ; intento++) {
    try {
      // READ COMMITTED (el nivel por defecto): la pesimista necesita ver, tras el
      // bloqueo, lo que otras transacciones ya han confirmado.
      return await deps.db.transaction(async (tx) => {
        const pista = await deps.pistas.buscarPorId(tx, d.pistaId);
        if (!pista) throw new PistaNoEncontrada();
        const v = esFranjaValida(pista, d.inicio, ahora);
        if (!v.ok) throw new FranjaInvalida(v.motivo);
        return deps.reservas.crear(tx, { pistaId: d.pistaId, usuarioId: d.usuarioId, periodo: v.periodo });
      });
    } catch (e) {
      if (!(e instanceof ConflictoVersion)) throw e;
      if (intento >= REINTENTOS_OPTIMISTA) throw new PistaOcupadaError();
    }
  }
}
