import type { Deporte } from '@reservas/contracts';
import type { Tx } from '../infra/db/cliente.ts';
import type { Periodo } from '../infra/db/schema.ts';
import type { Pista } from './pista.ts';
import type { Reserva } from './reserva.ts';
import type { Sesion } from './sesion.ts';
import type { Usuario } from './usuario.ts';

export interface PistaRepository {
  listar(tx: Tx, deporte?: Deporte): Promise<Pista[]>;
  buscarPorId(tx: Tx, id: string): Promise<Pista | null>;
}

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

export interface UsuarioRepository {
  crear(tx: Tx, datos: { email: string; passwordHash: string; nombre: string }): Promise<Usuario>;
  buscarPorEmail(tx: Tx, email: string): Promise<(Usuario & { passwordHash: string }) | null>;
  buscarPorId(tx: Tx, id: string): Promise<(Usuario & { passwordHash: string }) | null>;
  actualizarPassword(tx: Tx, id: string, passwordHash: string): Promise<void>;
}

export interface SesionRepository {
  crear(tx: Tx, datos: { usuarioId: string; tokenHash: string; creadaEn: Date; expiraEn: Date }): Promise<Sesion>;
  buscarPorTokenHash(tx: Tx, tokenHash: string): Promise<Sesion | null>;
  tocar(tx: Tx, id: string, ultimoUso: Date, expiraEn: Date): Promise<void>;
  borrar(tx: Tx, id: string): Promise<void>;
  borrarDeUsuario(tx: Tx, usuarioId: string, exceptoId?: string): Promise<void>;
}

export interface IntentoLoginRepository {
  contar(tx: Tx, clave: string, desde: Date): Promise<{ n: number; masAntiguo: Date | null }>;
  registrar(tx: Tx, clave: string, intentoEn: Date): Promise<void>;
  limpiar(tx: Tx, clave: string): Promise<void>;
}
