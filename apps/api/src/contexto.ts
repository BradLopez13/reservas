import type { Config } from './shared/config.ts';
import type { Db } from './shared/db/cliente.ts';
import type { IntentoLoginRepository, SesionRepository, UsuarioRepository } from './modules/auth/domain/ports.ts';
import { intentoLoginRepository } from './modules/auth/infra/intentosLogin.repository.ts';
import { sesionRepository } from './modules/auth/infra/sesiones.repository.ts';
import { usuarioRepository } from './modules/auth/infra/usuarios.repository.ts';
import type { PistaRepository } from './modules/pistas/domain/ports.ts';
import { pistaRepository } from './modules/pistas/infra/pistas.repository.ts';
import type { IdempotenciaRepository, ReservaRepository } from './modules/reservas/domain/ports.ts';
import { idempotenciaRepository } from './modules/reservas/infra/idempotencia.repository.ts';
import { crearReservaRepository } from './modules/reservas/infra/repository/estrategia.ts';

// Raíz de composición: el único sitio donde se decide qué implementación
// concreta recibe cada puerto. Todo lo demás depende de interfaces.
export interface Repos {
  usuarios: UsuarioRepository;
  sesiones: SesionRepository;
  intentos: IntentoLoginRepository;
  pistas: PistaRepository;
  reservas: ReservaRepository;
  idempotencia: IdempotenciaRepository;
}

export interface Contexto { config: Config; db: Db; repos: Repos; ahora: () => Date }

// Lo que necesita un caso de uso: base de datos, puertos y reloj. Nunca la config.
export type Ctx = Pick<Contexto, 'db' | 'repos' | 'ahora'>;

export function crearRepos(config: Pick<Config, 'estrategiaReservas'>): Repos {
  return {
    usuarios: usuarioRepository,
    sesiones: sesionRepository,
    intentos: intentoLoginRepository,
    pistas: pistaRepository,
    reservas: crearReservaRepository(config.estrategiaReservas),
    idempotencia: idempotenciaRepository,
  };
}

export function crearContexto(config: Config, db: Db, ahora: () => Date = () => new Date()): Contexto {
  return { config, db, repos: crearRepos(config), ahora };
}
