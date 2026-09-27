# Reservas

Reservas de pistas de pádel, tenis y fútbol, construidas para responder a una pregunta concreta: **¿qué pasa cuando cincuenta personas pulsan «Reservar» a la vez sobre la última franja libre?** Full-stack en TypeScript: API Fastify con PostgreSQL y frontend React, conectados por contratos Zod compartidos.

[![CI](https://github.com/BradLopez13/reservas/actions/workflows/ci.yml/badge.svg)](https://github.com/BradLopez13/reservas/actions/workflows/ci.yml)

## Por qué existe

Para demostrar dos cosas que se pueden comprobar, no solo contar: que una pista no se vende dos veces bajo carga, y que una sesión web se puede hacer bien sin JWT. Todo lo demás (pantallas, despliegue, animaciones) está al servicio de esas dos.

## La carrera de 50

Cincuenta reservas simultáneas de la misma franja, contra un PostgreSQL real levantado con Testcontainers. Exactamente una gana; las otras 49 reciben `PISTA_OCUPADA`. El mismo test corre contra las tres estrategias:

```
$ pnpm --filter @reservas/api exec vitest run estrategias

✓ estrategia pesimista > crea una reserva confirmada
✓ estrategia pesimista > rechaza una segunda reserva de la misma franja
✓ estrategia pesimista > deja libre la franja cuando la reserva está cancelada
✓ estrategia pesimista > 50 peticiones simultáneas por la última franja: exactamente una gana
✓ estrategia optimista > crea una reserva confirmada
✓ estrategia optimista > rechaza una segunda reserva de la misma franja
✓ estrategia optimista > deja libre la franja cuando la reserva está cancelada
✓ estrategia optimista > 50 peticiones simultáneas por la última franja: exactamente una gana
✓ estrategia exclude > crea una reserva confirmada
✓ estrategia exclude > rechaza una segunda reserva de la misma franja
✓ estrategia exclude > deja libre la franja cuando la reserva está cancelada
✓ estrategia exclude > 50 peticiones simultáneas por la última franja: exactamente una gana
Test Files  1 passed (1)
Tests  12 passed (12)
Duration  20.30s
```

## Las tres estrategias

`ReservaRepository` tiene tres implementaciones que solo difieren en `crear()` y se eligen con `RESERVAS_ESTRATEGIA`. Las tres pasan la misma batería de tests.

| Estrategia | Cómo | Con 50 peticiones | Fichero |
|---|---|---|---|
| Pesimista | `SELECT … FOR UPDATE` sobre la pista, comprobar solapes, insertar | Las 49 perdedoras esperan en fila por el bloqueo y luego ven la franja ocupada | `reservas.pesimista.ts` |
| Optimista | Leer una versión por pista y día, comprobar, insertar, `UPDATE … WHERE version = leída` | Nadie espera; quien pierde el `UPDATE` reintenta y ve el solape | `reservas.optimista.ts` |
| `EXCLUDE` | Restricción `EXCLUDE USING gist (pista_id WITH =, periodo WITH &&)` en la base de datos | La segunda inserción falla con `23P01`; PostgreSQL decide | `reservas.exclude.ts` |

En producción se usa `EXCLUDE`: es la única que sigue funcionando aunque alguien añada mañana otra ruta que inserte reservas. Los tests de las otras dos **quitan la restricción antes de correr**, para que la base de datos no les tape los fallos.

## Sesiones

- Token opaco de 32 bytes en la cookie; en la base de datos solo su SHA-256.
- Cookie `__Host-sesion` con `HttpOnly; Secure; SameSite=Lax`, sin `Domain`: JavaScript no la lee y un subdominio no la fija.
- Token nuevo en cada login. Logout, «cerrar todas las sesiones» y cambio de contraseña revocan al instante.
- Caducidad deslizante: 7 días sin uso, máximo 30 desde el login.
- CSRF: `SameSite=Lax` más la comprobación de `Origin` en toda petición que modifica datos.
- Login con Argon2id, mismo error y mismo coste exista o no el email, y 5 intentos por email e IP cada 15 minutos.

## Arquitectura

```
packages/contracts/       Esquemas Zod de lo que viaja por HTTP y códigos de error. No depende de nada.

apps/api/src/                             (hexagonal, un módulo vertical por funcionalidad)
  contexto.ts                             raíz de composición: qué implementación recibe cada puerto
  shared/                                 config, errores de dominio, tiempo, base de datos, plugins HTTP
  modules/<feature>/
    domain/                               entidades, reglas y puertos (interfaces). Sin Fastify ni Drizzle
    application/commands/                 casos de uso que escriben (reservarPista, cancelarReserva…)
    application/queries/                  casos de uso que leen (misReservas, consultarFranjas…)
    infra/http/rutas.ts                   controlador: solo une ruta → handler → guard
    infra/http/handlers/                  un handler por endpoint
    infra/http/dto.ts                     entidad → contrato
    infra/persistence/                    repositorios (las tres estrategias, idempotencia, sesiones…)

apps/web/src/                             (MVVM: pantalla → hook → vista; carpetas solo TS o solo TSX)
  shared/                                 api (axios + interceptores), components, hooks, fechas, fotos, react-bits
  features/<feature>/
    api/                        TS        un cliente por recurso de la API
    mappers/                    TS        contrato → modelo de vista
    queries/                    TS        claves de caché + useQuery: los datos no se piden dos veces
    mutations/                  TS        useMutation con sus invalidaciones
    hooks/                      TS        la lógica de cada pantalla (view-model), con sus funciones puras
    providers/                  TSX       contextos (solo auth)
    components/                 TSX       vistas y piezas propias de la feature
    screens/                    TSX       controladores: <Vista {...useHook()} />

infra/                    nginx + docker compose: la app completa como en producción.
e2e/                      Playwright contra ese docker compose.
```

Las páginas informativas (cómo funciona, normas, sobre el proyecto y privacidad) viven en `features/info/screens/` y no tienen view-model: son solo vista.

Recorrido de una petición: el navegador llama a `/api/reservas` en el mismo origen → el proxy la pasa a Fastify → el decorador de idempotencia decide si ya se procesó → la ruta valida con `contracts` → el caso de uso abre la transacción → el repositorio aplica la estrategia → el mapper devuelve el contrato → el cliente web valida la respuesta con el mismo esquema y la convierte en modelo de vista.

Patrones que sostienen eso. En la API: **puertos y adaptadores** (los casos de uso solo ven interfaces), **comandos y consultas** separados, **raíz de composición** (`contexto.ts` es el único sitio que conoce las implementaciones), **estrategia** (las tres formas de crear una reserva), **decorador** (la idempotencia envuelve al handler sin que la ruta sepa de ella) y **mappers** en cada frontera. En la web no hay hexagonal, porque no hay dominio que proteger: hay **MVVM** (la pantalla es el controlador, el hook es el view-model, la vista es tonta) y una **capa de datos con caché** (queries y mutations) para no volver a pedir lo mismo.

Detalles que importan y que no se ven en una demo:

- **Idempotencia** en `POST /reservas`: la cabecera `Idempotency-Key` la genera el frontend una vez por intento. Un doble clic o un reintento de red devuelven la misma reserva; la misma clave con otro cuerpo da un 422.
- **Hora de Madrid**: las franjas se calculan en `Europe/Madrid` y se guardan en `timestamptz`. Hay un test para el último domingo de octubre.
- **`prefers-reduced-motion`**: todas las animaciones (las de React Bits, la entrada del diálogo de confirmación y las transiciones CSS) se desactivan si el sistema lo pide.
- **Un solo tema, el de la pista**: verde profundo de fondo y lima de la bola como único acento, definidos como tokens semánticos en `index.css`. Las dos animaciones ligadas al scroll de la portada usan GSAP con ScrollTrigger y también se apagan con `prefers-reduced-motion`.

## Ejecutar en local

La app completa, como en producción (nginx + API + PostgreSQL), en `http://localhost:8080`:

```bash
docker compose -f infra/docker-compose.yml up --build
```

En modo desarrollo, con recarga en caliente:

```bash
docker compose -f infra/docker-compose.dev.yml up -d     # solo PostgreSQL
cp apps/api/.env.example apps/api/.env                   # y pon COOKIE_SECURE=false, APP_ORIGIN=http://localhost:5173
pnpm --filter @reservas/api db:migrate
pnpm --filter @reservas/api db:seed
pnpm --filter @reservas/api dev                          # API en :3000
pnpm --filter @reservas/web dev                          # web en :5173, con proxy a /api
```

Requiere Node 24, pnpm y Docker.

## Tests

| Nivel | Qué prueba | Comando |
|---|---|---|
| Contratos | Los esquemas Zod | `pnpm --filter @reservas/contracts test` |
| Dominio | Franjas, cambio de hora, plazo de cancelación | `pnpm --filter @reservas/api exec vitest run domain` |
| Estrategias | La misma batería para las tres, con la carrera de 50 | `pnpm --filter @reservas/api exec vitest run estrategias` |
| HTTP | Cookie, rotación, caducidad, `Origin`, límite de intentos, idempotencia | `pnpm --filter @reservas/api exec vitest run rutas` |
| Web | Mappers, interceptores, sesión caducada, `prefers-reduced-motion` | `pnpm --filter @reservas/web test` |
| De punta a punta | Registro → reservar → mis reservas → cancelar, en Chromium contra el `docker compose` | `pnpm e2e` |

`pnpm test` ejecuta todos menos el e2e. Los de la API levantan un PostgreSQL 17 con Testcontainers.

## Despliegue

Vercel compila la API con su propio TypeScript (sin `strict`, lib ES2020). `apps/api/tsconfig.vercel.json` imita esa configuración y `pnpm typecheck` la ejecuta además de la estricta, así que lo que pasa la CI despliega.

Dos proyectos en Vercel apuntando a este repo, `apps/web` y `apps/api`; la web reescribe `/api/*` al proyecto de la API, así que el navegador ve un solo origen y la cookie funciona igual que en local. La base de datos es PostgreSQL en Supabase (plan gratuito), a través de su pooler en modo transacción; por eso el cliente usa `prepare: false`. Supabase pausa el proyecto tras una semana sin actividad y hay que reanudarlo desde su panel.

## Créditos

`BlurText`, `ClickSpark`, `Magnet`, `GlareHover`, `CountUp` y `SpotlightCard` vienen de [React Bits](https://reactbits.dev) (MIT + Commons Clause); el código original, la licencia y dónde se usa cada uno están en `apps/web/src/shared/react-bits/`. Las tipografías son [Geist](https://vercel.com/font) y [Bricolage Grotesque](https://github.com/ateliertriay/bricolage) (OFL, servidas desde Fontsource), los iconos son de [Phosphor](https://phosphoricons.com) (MIT) y las fotografías, de [Unsplash](https://unsplash.com) (licencia Unsplash); sus URL están en `apps/web/src/shared/fotos.ts`.
