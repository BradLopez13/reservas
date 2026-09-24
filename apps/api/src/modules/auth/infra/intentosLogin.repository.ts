import { and, count, eq, gte, min } from 'drizzle-orm';
import type { IntentoLoginRepository } from '../domain/ports.ts';
import { intentosLogin } from '../../../shared/db/schema.ts';

// Los intentos viven en la base de datos y no en memoria: en Vercel cada
// instancia de la función tiene su propia memoria.
export const intentoLoginRepository: IntentoLoginRepository = {
  async contar(tx, clave, desde) {
    const [r] = await tx.select({ n: count(), masAntiguo: min(intentosLogin.intentoEn) }).from(intentosLogin)
      .where(and(eq(intentosLogin.clave, clave), gte(intentosLogin.intentoEn, desde)));
    return { n: Number(r!.n), masAntiguo: r!.masAntiguo };
  },
  async registrar(tx, clave, intentoEn) { await tx.insert(intentosLogin).values({ clave, intentoEn }); },
  async limpiar(tx, clave) { await tx.delete(intentosLogin).where(eq(intentosLogin.clave, clave)); },
};
