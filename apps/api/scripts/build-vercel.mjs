// Genera .vercel/output según la Build Output API de Vercel: una única función
// `api` con la app empaquetada por esbuild, más la ruta /api/(.*) → /api?__ruta=$1
// que el adaptador (src/vercel.ts) deshace. Vercel despliega esto tal cual, sin
// detectar frameworks ni compilar nada.
import { build } from 'esbuild';
import { cpSync, mkdirSync, readFileSync, realpathSync, rmSync, writeFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { dirname, join } from 'node:path';

const raiz = join(import.meta.dirname, '..');
const salida = join(raiz, '.vercel', 'output');
const func = join(salida, 'functions', 'api.func');

rmSync(salida, { recursive: true, force: true });
mkdirSync(func, { recursive: true });

await build({
  entryPoints: [join(raiz, 'src', 'vercel.ts')],
  bundle: true,
  platform: 'node',
  target: 'node24',
  format: 'esm',
  outfile: join(func, 'index.mjs'),
  external: ['@node-rs/argon2'], // nativo: no se puede empaquetar, se copia abajo
  banner: { js: "import { createRequire } from 'node:module'; const require = createRequire(import.meta.url);" },
  logLevel: 'info',
});

// @node-rs/argon2 y su binario para la plataforma del build, con los enlaces de pnpm resueltos.
const require = createRequire(join(raiz, 'package.json'));
const paqueteArgon = dirname(realpathSync(require.resolve('@node-rs/argon2/package.json')));
cpSync(paqueteArgon, join(func, 'node_modules', '@node-rs', 'argon2'), { recursive: true, dereference: true });
const binarios = JSON.parse(readFileSync(join(paqueteArgon, 'package.json'), 'utf8')).optionalDependencies ?? {};
// El binario de la plataforma solo es resoluble desde el propio paquete argon2 (pnpm no lo eleva).
const requireDesdeArgon = createRequire(join(paqueteArgon, 'package.json'));
for (const nombre of Object.keys(binarios)) {
  try {
    const dir = dirname(realpathSync(requireDesdeArgon.resolve(`${nombre}/package.json`)));
    cpSync(dir, join(func, 'node_modules', ...nombre.split('/')), { recursive: true, dereference: true });
    console.log('copiado', nombre);
  } catch {
    // No instalado en esta plataforma (pnpm solo instala el binario que toca).
  }
}

writeFileSync(join(func, '.vc-config.json'), JSON.stringify({
  runtime: 'nodejs24.x',
  handler: 'index.mjs',
  launcherType: 'Nodejs',
  shouldAddHelpers: false,
  // Junto a la base de datos (Supabase en eu-west-1, Irlanda): cada consulta de
  // una transacción es un viaje de ida y vuelta, y desde iad1 cruzaría el Atlántico.
  regions: ['dub1'],
}, null, 2));

writeFileSync(join(salida, 'config.json'), JSON.stringify({
  version: 3,
  routes: [{ src: '/api/(.*)', dest: '/api?__ruta=$1' }],
}, null, 2));

console.log('Build Output listo en', salida);
