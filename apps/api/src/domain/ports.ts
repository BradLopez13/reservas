import type { Tx } from '../infra/db/cliente.ts';
import type { Sesion } from './sesion.ts';
import type { Usuario } from './usuario.ts';

export interface UsuarioRepository {
  crear(tx: Tx, datos: { email: string; passwordHash: string; nombre: string }): Promise<Usuario>;
  buscarPorEmail(tx: Tx, email: string): Promise<(Usuario & { passwordHash: string }) | null>;
  buscarPorId(tx: Tx, id: string): Promise<(Usuario & { passwordHash: string }) | null>;
  actualizarPassword(tx: Tx, id: string, passwordHash: string): Promise<void>;
}

export interface SesionRepository {
  crear(tx: Tx, datos: { usuarioId: string; tokenHash: string; expiraEn: Date }): Promise<Sesion>;
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
