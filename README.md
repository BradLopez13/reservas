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

En producción se usa `EXCLUDE`: es la única que sigue funcionando aunque alguien añada mañana otra ruta que inserte reservas. Los tests de las otras dos **quitan la restricción antes de correr**, para que la base de datos no les tape los fallos. Por qué estas tres y no otras: [ADR 0001](docs/decisions/0001-tres-estrategias.md).

## Sesiones

- Token opaco de 32 bytes en la cookie; en la base de datos solo su SHA-256.
- Cookie `__Host-sesion` con `HttpOnly; Secure; SameSite=Lax`, sin `Domain`: JavaScript no la lee y un subdominio no la fija.
- Token nuevo en cada login. Logout, «cerrar todas las sesiones» y cambio de contraseña revocan al instante.
- Caducidad deslizante: 7 días sin uso, máximo 30 desde el login.
- CSRF: `SameSite=Lax` más la comprobación de `Origin` en toda petición que modifica datos.
- Login con Argon2id, mismo error y mismo coste exista o no el email, y 5 intentos por email e IP cada 15 minutos.

Por qué cookie y no JWT: [ADR 0002](docs/decisions/0002-sesiones-cookie.md).

## Arquitectura

```
packages/contracts/   Esquemas Zod de lo que viaja por HTTP y códigos de error. No depende de nada.
apps/api/             Fastify + Drizzle + PostgreSQL
  src/domain/         Reglas y puertos. No importa Fastify ni Drizzle.
  src/application/    Casos de uso: abren la transacción y la pasan a los repositorios.
  src/infra/          Repositorios (las tres estrategias), rutas, sesión, migraciones.
apps/web/             React 19 + Vite + React Router + TanStack Query + Tailwind
  src/api/            Cliente axios con interceptores (Idempotency-Key, errores tipados, 401).
  src/mappers/        Contrato → modelo de vista.
  src/features/       auth, pistas, reservas.
infra/                nginx + docker compose: la app completa como en producción.
e2e/                  Playwright contra ese docker compose.
docs/decisions/       ADR.
```

Recorrido de una petición: el navegador llama a `/api/reservas` en el mismo origen → el proxy la pasa a Fastify → la ruta valida con `contracts` → el caso de uso abre la transacción → el repositorio aplica la estrategia → el mapper devuelve el contrato → el cliente web valida la respuesta con el mismo esquema y la convierte en modelo de vista. Por qué contratos y mappers y no tRPC: [ADR 0003](docs/decisions/0003-contratos-y-mappers.md).

Detalles que importan y que no se ven en una demo:

- **Idempotencia** en `POST /reservas`: la cabecera `Idempotency-Key` la genera el frontend una vez por intento. Un doble clic o un reintento de red devuelven la misma reserva; la misma clave con otro cuerpo da un 422.
- **Hora de Madrid**: las franjas se calculan en `Europe/Madrid` y se guardan en `timestamptz`. Hay un test para el último domingo de octubre.
- **`prefers-reduced-motion`**: las tres animaciones se desactivan si el sistema lo pide.

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

Dos proyectos en Vercel apuntando a este repo, `apps/web` y `apps/api`; la web reescribe `/api/*` al proyecto de la API, así que el navegador ve un solo origen y la cookie funciona igual que en local. La base de datos es PostgreSQL en Neon (plan gratuito): tras cinco minutos sin uso se suspende y la primera petición tarda alrededor de un segundo.

## Créditos

`BlurText` y `ClickSpark` vienen de [React Bits](https://reactbits.dev) (MIT + Commons Clause); el código original y la licencia están en `apps/web/src/components/react-bits/`.
