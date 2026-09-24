import type { Usuario } from '../../domain/usuario.ts';

declare module 'fastify' {
  interface FastifyRequest { sesion: { usuario: Usuario; sesionId: string } | null }
}
