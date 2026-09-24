import { PistaOcupadaError } from '../../domain/errores.ts';
import type { ReservaRepository } from '../../domain/ports.ts';
import { codigoPg } from '../db/errores.ts';
import { comunes, insertar } from './reservas.base.ts';

// La base de datos garantiza el invariante con la restricción EXCLUDE (migración
// 0001): la segunda inserción solapada falla con 23P01 = exclusion_violation.
export const reservaRepositoryExclude: ReservaRepository = {
  ...comunes,
  async crear(tx, d) {
    try {
      return await insertar(tx, d);
    } catch (e) {
      if (codigoPg(e) === '23P01') throw new PistaOcupadaError();
      throw e;
    }
  },
};
