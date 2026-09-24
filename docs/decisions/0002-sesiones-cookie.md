# ADR 0002 · Sesiones opacas en cookie `httpOnly`, no JWT

Fecha: 2026-09-24 · Estado: aceptada

## Contexto

La aplicación es una SPA en React y una API en Fastify servidas desde **el mismo origen** a través de un proxy (nginx en local, las reescrituras de Vercel en producción). Hace falta autenticación con registro, login, logout, cerrar todas las sesiones y cambiar la contraseña, y tiene que poder demostrarse con tests que resiste los ataques habituales.

## Decisión

- **Token opaco:** 32 bytes aleatorios en la cookie; en la base de datos solo se guarda su SHA-256. Quien robe la base de datos no obtiene sesiones usables.
- **Cookie `__Host-sesion`** con `HttpOnly; Secure; SameSite=Lax; Path=/` y sin `Domain`. El prefijo `__Host-` hace que el navegador la rechace si no es `Secure` o si alguien intenta fijarla desde un subdominio. En local sin TLS se llama `sesion`, porque el prefijo exige `Secure`.
- **Caducidad deslizante:** 7 días desde el último uso, con un máximo de 30 días desde el login. `ultimo_uso` se actualiza como mucho una vez por hora.
- **Rotación:** cada login genera un token nuevo. Cerrar sesión, cerrar todas o cambiar la contraseña borran filas, y el token deja de valer al instante.
- **CSRF:** `SameSite=Lax` impide que otras webs envíen la cookie en `POST`, y además la API comprueba la cabecera `Origin` en toda petición que no sea `GET`/`HEAD`/`OPTIONS`.
- **Login:** Argon2id con los parámetros de OWASP; el mismo error y el mismo coste exista o no el email (se verifica contra un hash de relleno); 5 intentos fallidos por email e IP en 15 minutos, contados en la base de datos.

## Alternativas descartadas

- **JWT en `localStorage`:** cualquier XSS lo lee y lo exfiltra, y no se puede revocar antes de que caduque.
- **JWT en cookie `httpOnly`:** resuelve el XSS, pero sigue sin poder revocarse. «Cerrar sesión en todos los dispositivos» exige una lista negra en la base de datos, que es una tabla de sesiones con más pasos.
- **`SameSite=Strict`:** más estricto que `Lax`, pero al llegar a la app desde un enlace externo el usuario aparece sin sesión hasta que recarga.
- **Contador de intentos en memoria:** en Vercel cada instancia tiene su propia memoria; el límite no se aplicaría.

## Consecuencias

- Cada petición autenticada hace una lectura de la tabla `sesiones`. Es el precio de poder revocar.
- El registro revela si un email ya existe (`EMAIL_EN_USO`). Evitarlo exige verificación por email, que queda fuera del alcance.
- Los tests HTTP cubren: opciones de la cookie, rotación, logout, caducidad, expulsión de otras sesiones al cambiar la contraseña, `Origin` ausente o ajeno, y el sexto intento de login.
