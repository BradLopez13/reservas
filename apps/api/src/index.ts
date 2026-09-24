import { crearApp } from './app.ts';
import { crearContexto } from './contexto.ts';
import { leerConfig } from './shared/config.ts';
import { crearDb } from './shared/db/cliente.ts';

const config = leerConfig();
const { db } = crearDb(config.databaseUrl);
const app = await crearApp(crearContexto(config, db));
app.listen({ port: Number(process.env.PORT ?? 3000), host: '0.0.0.0' }).catch((err) => {
  app.log.error(err);
  process.exit(1);
});
