import type { Franja } from '@reservas/contracts';
import { PistaNoEncontrada } from '../domain/errores.ts';
import { generarFranjas } from '../domain/franjas.ts';
import type { PistaRepository, ReservaRepository } from '../domain/ports.ts';
import type { Db } from '../infra/db/cliente.ts';

export interface DepsFranjas { db: Db; pistas: PistaRepository; reservas: Pick<ReservaRepository, 'listarConfirmadas'> }

export async function consultarFranjas(deps: DepsFranjas, pistaId: string, fecha: string): Promise<Franja[]> {
  return deps.db.transaction(async (tx) => {
    const pista = await deps.pistas.buscarPorId(tx, pistaId);
    if (!pista) throw new PistaNoEncontrada();
    const franjas = generarFranjas(pista, fecha);
    if (franjas.length === 0) return [];
    const dia = { inicio: franjas[0]!.inicio, fin: franjas.at(-1)!.fin };
    const ocupadas = await deps.reservas.listarConfirmadas(tx, pistaId, dia);
    return franjas.map((f) => ({
      inicio: f.inicio.toISOString(), fin: f.fin.toISOString(),
      libre: !ocupadas.some((o) => o.inicio < f.fin && f.inicio < o.fin),
    }));
  });
}
