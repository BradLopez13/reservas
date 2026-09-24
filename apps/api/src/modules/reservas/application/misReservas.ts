import type { Ctx } from '../../../contexto.ts';

export const misReservas = (ctx: Ctx, usuarioId: string) => ctx.db.transaction((tx) => ctx.repos.reservas.listarDeUsuario(tx, usuarioId));
