# ADR 0001 · Tres estrategias contra la sobreventa, y `EXCLUDE` en producción

Fecha: 2026-09-24 · Estado: aceptada

## Contexto

Dos personas pulsan «Reservar» a la vez sobre la última franja libre de una pista. Las dos peticiones leen que está libre, las dos insertan, y la pista queda vendida dos veces. Es el problema central de este proyecto: el invariante «una pista nunca tiene dos reservas confirmadas que se solapen» tiene que aguantar bajo carga real, no solo en una demo con un usuario.

Además, el proyecto es un portfolio: el objetivo no es solo que el invariante se cumpla, sino poder explicar en una entrevista **cómo** se cumple y qué alternativas hay.

## Decisión

`ReservaRepository` tiene tres implementaciones que solo difieren en `crear()`, se eligen por configuración (`RESERVAS_ESTRATEGIA`) y pasan **la misma batería de tests**, incluida una carrera de 50 peticiones simultáneas por la misma franja:

| Estrategia | Cómo | Quién espera |
|---|---|---|
| Pesimista | `SELECT … FROM pistas WHERE id = $1 FOR UPDATE`, comprobar solapes, insertar | Las peticiones que compiten esperan en fila por el bloqueo de la pista |
| Optimista | Leer `pista_dias.version`, comprobar, insertar, `UPDATE … WHERE version = leída`; si afecta a 0 filas, reintentar | Nadie espera; quien pierde repite desde cero (hasta 3 veces) |
| `EXCLUDE` | `EXCLUDE USING gist (pista_id WITH =, periodo WITH &&) WHERE (estado = 'confirmada')`; la segunda inserción falla con `23P01` | Nadie: lo decide PostgreSQL al insertar |

**En producción se usa `EXCLUDE`.** Es la única que no depende de que el código de la aplicación haga las cosas en el orden correcto: aunque mañana alguien añada otra ruta que inserte reservas, la base de datos sigue impidiendo el solape.

Las transacciones van en `READ COMMITTED` (el nivel por defecto). La pesimista lo necesita: tras obtener el bloqueo, la comprobación de solapes tiene que ver lo que la transacción anterior acaba de confirmar, y con `REPEATABLE READ` leería una foto anterior al bloqueo.

## Alternativas descartadas

- **Comprobar solo en la aplicación**, sin bloqueo ni restricción: es lo que hacía la primera versión y es exactamente lo que falla. Entre el `SELECT` y el `INSERT` de una petición cabe el `INSERT` de otra.
- **`SERIALIZABLE` para toda la aplicación**: resuelve el problema, pero obliga a reintentar cualquier transacción de cualquier ruta por un conflicto que solo existe en una tabla.
- **Un mutex en memoria en Node**: funciona con una instancia. En Vercel cada petición puede caer en una instancia distinta, y el mutex no las ve.

## Consecuencias

- Hace falta la extensión `btree_gist` (migración `0001`).
- La tabla `pista_dias` existe solo para la estrategia optimista.
- Los tests de la pesimista y la optimista **quitan la restricción `EXCLUDE`** antes de correr, para que la base de datos no les tape los fallos. Si una de las dos estuviera mal, su test lo diría.
- Mantener tres implementaciones cuesta más que una. Se acepta porque la comparación es el valor del proyecto.
