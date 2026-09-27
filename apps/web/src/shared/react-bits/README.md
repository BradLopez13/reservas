# Componentes de React Bits

Los ficheros `*.bits.tsx` son copias de [React Bits](https://reactbits.dev) (variante TS + Tailwind), de David Haz, bajo licencia MIT + Commons Clause (ver `LICENSE`). El único cambio es la primera línea, `// @ts-nocheck`, porque este proyecto compila con opciones más estrictas que las de React Bits.

| Copia | Dónde se usa |
|---|---|
| `BlurText` | El titular de la portada |
| `ClickSpark` | Chispas al confirmar una reserva |
| `Magnet` | El botón principal de la portada se acerca al cursor |
| `GlareHover` | Reflejo sobre la foto de cada pista al pasar el ratón |
| `CountUp` | El 50 y el 1 de la carrera de cincuenta |
| `SpotlightCard` | Las tres tarjetas de «Sobre el proyecto» |

Los demás ficheros de esta carpeta son propios: envoltorios que mantienen la misma interfaz, aplican los tokens de la app y desactivan la animación cuando el sistema tiene activado `prefers-reduced-motion`. `AnimatedList` es una implementación propia sobre `motion`, porque la de React Bits está pensada para listas de texto con scroll y no acepta elementos arbitrarios con clave. Las dos animaciones ligadas al scroll de la portada (`TextoRevelado` e `ImagenEscala`, en `shared/components/`) son propias, sobre GSAP y ScrollTrigger.
