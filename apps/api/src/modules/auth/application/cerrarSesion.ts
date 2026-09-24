import type { Ctx } from '../../../contexto.ts';

export const cerrarSesion = (ctx: Ctx, sesionId: string) => ctx.db.transaction((tx) => ctx.repos.sesiones.borrar(tx, sesionId));
export const cerrarTodasLasSesiones = (ctx: Ctx, usuarioId: string) => ctx.db.transaction((tx) => ctx.repos.sesiones.borrarDeUsuario(tx, usuarioId));
