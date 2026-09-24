import type { IntentoLoginRepository, SesionRepository, UsuarioRepository } from '../domain/ports.ts';
import type { Db } from '../infra/db/cliente.ts';

export interface DepsAuth { db: Db; usuarios: UsuarioRepository; sesiones: SesionRepository; intentos: IntentoLoginRepository; ahora: () => Date }
