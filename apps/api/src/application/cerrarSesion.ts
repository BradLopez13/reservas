import type { DepsAuth } from './deps.ts';

export const cerrarSesion = (deps: DepsAuth, sesionId: string) => deps.db.transaction((tx) => deps.sesiones.borrar(tx, sesionId));
export const cerrarTodasLasSesiones = (deps: DepsAuth, usuarioId: string) => deps.db.transaction((tx) => deps.sesiones.borrarDeUsuario(tx, usuarioId));
