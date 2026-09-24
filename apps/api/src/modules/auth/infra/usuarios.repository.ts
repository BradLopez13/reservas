import { eq } from 'drizzle-orm';
import type { UsuarioRepository } from '../domain/ports.ts';
import { usuarios } from '../../../shared/db/schema.ts';

const aUsuario = (f: typeof usuarios.$inferSelect) => ({ id: f.id, email: f.email, nombre: f.nombre, passwordHash: f.passwordHash });

export const usuarioRepository: UsuarioRepository = {
  async crear(tx, d) {
    const [f] = await tx.insert(usuarios).values(d).returning();
    return { id: f!.id, email: f!.email, nombre: f!.nombre };
  },
  async buscarPorEmail(tx, email) { const f = await tx.query.usuarios.findFirst({ where: eq(usuarios.email, email) }); return f ? aUsuario(f) : null; },
  async buscarPorId(tx, id) { const f = await tx.query.usuarios.findFirst({ where: eq(usuarios.id, id) }); return f ? aUsuario(f) : null; },
  async actualizarPassword(tx, id, passwordHash) { await tx.update(usuarios).set({ passwordHash }).where(eq(usuarios.id, id)); },
};
