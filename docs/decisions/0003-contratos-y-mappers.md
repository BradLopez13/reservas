# ADR 0003 · Contratos Zod compartidos, con mappers en cada frontera

Fecha: 2026-09-24 · Estado: aceptada

## Contexto

Frontend y backend están en TypeScript en el mismo monorepo. Queremos que un cambio en la API que rompa al frontend **no compile** en lugar de fallar en producción, sin que eso acople la base de datos al navegador ni esconda el HTTP que el proyecto quiere enseñar (códigos 409, cabecera `Idempotency-Key`, cookies).

## Decisión

- El paquete **`@reservas/contracts`** contiene los esquemas Zod de todo lo que viaja por HTTP (cuerpos, respuestas, parámetros de consulta) y el enum de códigos de error. No importa nada del resto del repo.
- **La API valida la entrada** con esos esquemas y **el cliente web valida la respuesta** con los mismos. Los tipos se derivan de los esquemas: una sola fuente de verdad.
- **Mappers en cada frontera**, para que el contrato no se filtre:
  - Fila de base de datos ↔ entidad de dominio, en los repositorios.
  - Entidad → contrato, en las rutas (`aDto`).
  - Contrato → modelo de vista, en el frontend (`aFranjaVista`, `aReservaVista`), donde las fechas ISO pasan a `Date` y aparecen las etiquetas como «18:00–19:30».
- **Interceptores de axios** para lo transversal: la cabecera `Idempotency-Key`, la conversión de errores HTTP en `ApiError` tipado con el código del contrato, y la reacción a un 401.

## Alternativas descartadas

- **tRPC:** la mejor experiencia de tipos, pero esconde el HTTP. Las respuestas 409, las cabeceras y las cookies son justo lo que se quiere enseñar, y además ata el frontend al servidor.
- **OpenAPI y un cliente generado:** documentación navegable gratis, pero una herramienta más que mantener y un paso de generación que se desincroniza.
- **Compartir los tipos de Drizzle** con el frontend: el esquema de la base de datos acabaría en el navegador, y cambiar una columna rompería pantallas.

## Consecuencias

- Cambiar un campo obliga a tocar tres sitios: el contrato, el mapper de la API y el mapper de la web. A cambio, nada compila hasta que todo encaja.
- Validar las respuestas en el cliente cuesta unos milisegundos por petición y detecta al momento cualquier desviación del contrato.
- El código de la base de datos y el de la interfaz pueden cambiar por separado mientras el contrato se mantenga.
