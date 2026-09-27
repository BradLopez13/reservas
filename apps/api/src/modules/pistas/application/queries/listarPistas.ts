import type { Deporte } from '@reservas/contracts';
import type { Ctx } from '../../../../contexto.ts';

export const listarPistas = (ctx: Ctx, deporte?: Deporte) => ctx.db.transaction((tx) => ctx.repos.pistas.listar(tx, deporte));
