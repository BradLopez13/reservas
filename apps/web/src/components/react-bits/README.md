# Componentes de React Bits

`BlurText.bits.tsx` y `ClickSpark.bits.tsx` son copias de [React Bits](https://reactbits.dev) (variante TS + Tailwind), de David Haz, bajo licencia MIT + Commons Clause (ver `LICENSE`). El único cambio es la primera línea, `// @ts-nocheck`, porque este proyecto compila con opciones más estrictas que las de React Bits.

Los demás ficheros de esta carpeta son propios: envoltorios que mantienen la misma interfaz y desactivan la animación cuando el sistema tiene activado `prefers-reduced-motion`. `AnimatedList` es una implementación propia sobre `motion`, porque la de React Bits está pensada para listas de texto con scroll y no acepta elementos arbitrarios con clave.
