import { and, count, eq, gte, inArray, min } from 'drizzle-orm';
import type { IntentoLoginRepository } from '../../domain/ports.ts';
import { intentosLogin } from '../../../../shared/db/schema.ts';

// Los intentos viven en la base de datos y no en memoria: en Vercel cada
// instancia de la función tiene su propia memoria.
export const intentoLoginRepository: IntentoLoginRepository = {
  async registrar(tx, claves, intentoEn) {
    const filas = await tx.insert(intentosLogin).values(claves.map((clave) => ({ clave, intentoEn }))).returning({ id: intentosLogin.id });
    return filas.map((f) => f.id);
  },
  async contar(tx, clave, desde) {
    const [r] = await tx.select({ n: count(), masAntiguo: min(intentosLogin.intentoEn) }).from(intentosLogin)
      .where(and(eq(intentosLogin.clave, clave), gte(intentosLogin.intentoEn, desde)));
    return { n: Number(r!.n), masAntiguo: r!.masAntiguo };
  },
  async borrar(tx, ids) { await tx.delete(intentosLogin).where(inArray(intentosLogin.id, ids)); },
  async limpiar(tx, claves) { await tx.delete(intentosLogin).where(inArray(intentosLogin.clave, claves)); },
};
