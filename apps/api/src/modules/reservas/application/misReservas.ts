import type { DepsReservas } from './reservarPista.ts';

export const misReservas = (deps: DepsReservas, usuarioId: string) => deps.db.transaction((tx) => deps.reservas.listarDeUsuario(tx, usuarioId));
