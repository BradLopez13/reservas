import type { Franja } from '@reservas/contracts';
import type { Ctx } from '../../../contexto.ts';
import { PistaNoEncontrada } from '../../../shared/errores.ts';
import { generarFranjas } from '../domain/franjas.ts';

export async function consultarFranjas(ctx: Ctx, pistaId: string, fecha: string): Promise<Franja[]> {
  return ctx.db.transaction(async (tx) => {
    const pista = await ctx.repos.pistas.buscarPorId(tx, pistaId);
    if (!pista) throw new PistaNoEncontrada();
    const franjas = generarFranjas(pista, fecha);
    if (franjas.length === 0) return [];
    const dia = { inicio: franjas[0]!.inicio, fin: franjas.at(-1)!.fin };
    const ocupadas = await ctx.repos.reservas.listarConfirmadas(tx, pistaId, dia);
    return franjas.map((f) => ({
      inicio: f.inicio.toISOString(), fin: f.fin.toISOString(),
      libre: !ocupadas.some((o) => o.inicio < f.fin && f.inicio < o.fin),
    }));
  });
}
