import type { Config } from '../../config.ts';
import { crearReservaRepository } from './estrategia.ts';
import { idempotenciaRepository } from './idempotencia.ts';
import { intentoLoginRepository } from './intentosLogin.ts';
import { pistaRepository } from './pistas.ts';
import { sesionRepository } from './sesiones.ts';
import { usuarioRepository } from './usuarios.ts';

export const crearRepos = (config: Pick<Config, 'estrategiaReservas'>) => ({
  usuarios: usuarioRepository,
  sesiones: sesionRepository,
  intentos: intentoLoginRepository,
  pistas: pistaRepository,
  reservas: crearReservaRepository(config.estrategiaReservas),
  idempotencia: idempotenciaRepository,
});
