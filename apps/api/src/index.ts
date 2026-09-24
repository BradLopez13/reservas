import { crearApp } from './app.ts';
import { leerConfig } from './config.ts';
import { crearDb } from './infra/db/cliente.ts';
import { crearRepos } from './infra/repositories/index.ts';

const config = leerConfig();
const { db } = crearDb(config.databaseUrl);
const app = await crearApp({ config, db, repos: crearRepos(config), ahora: () => new Date() });
app.listen({ port: Number(process.env.PORT ?? 3000), host: '0.0.0.0' }).catch((err) => {
  app.log.error(err);
  process.exit(1);
});
