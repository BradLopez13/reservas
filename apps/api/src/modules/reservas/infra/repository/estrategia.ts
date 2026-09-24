import type { ReservaRepository } from '../../domain/ports.ts';
import { reservaRepositoryExclude } from './exclude.ts';
import { reservaRepositoryOptimista } from './optimista.ts';
import { reservaRepositoryPesimista } from './pesimista.ts';

export type Estrategia = 'pesimista' | 'optimista' | 'exclude';

export function crearReservaRepository(e: Estrategia): ReservaRepository {
  return { pesimista: reservaRepositoryPesimista, optimista: reservaRepositoryOptimista, exclude: reservaRepositoryExclude }[e];
}
