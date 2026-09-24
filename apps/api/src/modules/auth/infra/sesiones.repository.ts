import { and, eq, ne } from 'drizzle-orm';
import type { SesionRepository } from '../domain/ports.ts';
import { sesiones } from '../../../shared/db/schema.ts';

const aSesion = (f: typeof sesiones.$inferSelect) => ({ id: f.id, usuarioId: f.usuarioId, creadaEn: f.creadaEn, ultimoUso: f.ultimoUso, expiraEn: f.expiraEn });

export const sesionRepository: SesionRepository = {
  async crear(tx, d) { const [f] = await tx.insert(sesiones).values({ ...d, ultimoUso: d.creadaEn }).returning(); return aSesion(f!); },
  async buscarPorTokenHash(tx, tokenHash) { const f = await tx.query.sesiones.findFirst({ where: eq(sesiones.tokenHash, tokenHash) }); return f ? aSesion(f) : null; },
  async tocar(tx, id, ultimoUso, expiraEn) { await tx.update(sesiones).set({ ultimoUso, expiraEn }).where(eq(sesiones.id, id)); },
  async borrar(tx, id) { await tx.delete(sesiones).where(eq(sesiones.id, id)); },
  async borrarDeUsuario(tx, usuarioId, exceptoId) {
    await tx.delete(sesiones).where(exceptoId ? and(eq(sesiones.usuarioId, usuarioId), ne(sesiones.id, exceptoId)) : eq(sesiones.usuarioId, usuarioId));
  },
};
