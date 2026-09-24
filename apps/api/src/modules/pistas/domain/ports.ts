import type { Deporte } from '@reservas/contracts';
import type { Tx } from '../../../shared/db/cliente.ts';
import type { Pista } from './pista.ts';

export interface PistaRepository {
  listar(tx: Tx, deporte?: Deporte): Promise<Pista[]>;
  buscarPorId(tx: Tx, id: string): Promise<Pista | null>;
}
