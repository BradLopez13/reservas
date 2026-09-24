import type { Tx } from '../../../shared/db/cliente.ts';
import type { Periodo } from '../../../shared/db/schema.ts';
import type { Reserva } from './reserva.ts';

// Tres implementaciones (pesimista, optimista y EXCLUDE) que solo difieren en `crear`.
export interface ReservaRepository {
  crear(tx: Tx, datos: { pistaId: string; usuarioId: string; periodo: Periodo }): Promise<Reserva>;
  listarConfirmadas(tx: Tx, pistaId: string, dia: Periodo): Promise<Periodo[]>;
  buscarPorId(tx: Tx, id: string): Promise<Reserva | null>;
  cancelar(tx: Tx, id: string): Promise<void>;
  listarDeUsuario(tx: Tx, usuarioId: string): Promise<Reserva[]>;
}

export type ResultadoIdempotencia =
  | { estado: 'nueva' }
  | { estado: 'en_curso' }
  | { estado: 'conflicto' }
  | { estado: 'terminada'; estadoHttp: number; respuesta: unknown };

export interface IdempotenciaRepository {
  iniciar(tx: Tx, d: { usuarioId: string; clave: string; hashPeticion: string; ahora: Date }): Promise<ResultadoIdempotencia>;
  terminar(tx: Tx, d: { usuarioId: string; clave: string; estadoHttp: number; respuesta: unknown }): Promise<void>;
  abandonar(tx: Tx, d: { usuarioId: string; clave: string }): Promise<void>;
}
