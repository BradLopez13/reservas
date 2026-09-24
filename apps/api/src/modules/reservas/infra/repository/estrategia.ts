import type { ReservaRepository } from '../../domain/ports.ts';
import { reservaRepositoryExclude } from './reservas.exclude.ts';
import { reservaRepositoryOptimista } from './reservas.optimista.ts';
import { reservaRepositoryPesimista } from './reservas.pesimista.ts';

export type Estrategia = 'pesimista' | 'optimista' | 'exclude';

export function crearReservaRepository(e: Estrategia): ReservaRepository {
  return { pesimista: reservaRepositoryPesimista, optimista: reservaRepositoryOptimista, exclude: reservaRepositoryExclude }[e];
}
