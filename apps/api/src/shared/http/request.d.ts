import type { Usuario } from '../../modules/auth/domain/usuario.ts';

declare module 'fastify' {
  interface FastifyRequest { sesion: { usuario: Usuario; sesionId: string } | null }
}
