import { crearApp } from './app.ts';
import { leerConfig } from './config.ts';
import { crearDb } from './infra/db/cliente.ts';
import { intentoLoginRepository } from './infra/repositories/intentosLogin.ts';
import { pistaRepository } from './infra/repositories/pistas.ts';
import { sesionRepository } from './infra/repositories/sesiones.ts';
import { usuarioRepository } from './infra/repositories/usuarios.ts';

const config = leerConfig();
const { db } = crearDb(config.databaseUrl);
const app = await crearApp({
  config, db, ahora: () => new Date(),
  repos: { usuarios: usuarioRepository, sesiones: sesionRepository, intentos: intentoLoginRepository, pistas: pistaRepository, reservas: { listarConfirmadas: async () => [] } },
});
app.listen({ port: Number(process.env.PORT ?? 3000), host: '0.0.0.0' }).catch((err) => {
  app.log.error(err);
  process.exit(1);
});
