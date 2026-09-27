import { GithubLogo } from '@phosphor-icons/react';
import { estilosBoton } from '../../../shared/components/Boton.tsx';
import { REPO_URL } from '../../../shared/components/Layout.tsx';
import { Pagina } from '../../../shared/components/Pagina.tsx';
import { SpotlightCard } from '../../../shared/react-bits/SpotlightCard.tsx';

// Página estática: no tiene view-model.
const DEMUESTRA = [
  { titulo: 'Una pista no se vende dos veces', texto: 'Cincuenta reservas simultáneas de la misma franja contra un PostgreSQL real: exactamente una gana. Tres estrategias distintas pasan la misma prueba.' },
  { titulo: 'Sesiones sin JWT', texto: 'Token opaco en una cookie httpOnly, hash en la base de datos, rotación en cada login, caducidad deslizante y límite de intentos.' },
  { titulo: 'Un solo contrato de punta a punta', texto: 'Los esquemas Zod que valida la API son los mismos con los que el navegador valida las respuestas.' },
];

const STACK = ['TypeScript', 'Fastify', 'PostgreSQL', 'Drizzle', 'React 19', 'TanStack Query', 'Zod', 'Vite', 'Tailwind v4', 'Vitest', 'Playwright', 'Vercel', 'Supabase'];

export function SobreProyectoScreen() {
  return (
    <Pagina titulo="Sobre el proyecto" entradilla="Una app de reservas construida para responder a una pregunta concreta: qué pasa cuando cincuenta personas pulsan Reservar a la vez sobre la última hora libre.">
      <section className="flex flex-col gap-4">
        <h2 className="font-display text-2xl font-semibold tracking-tight text-tinta">Qué demuestra</h2>
        <ul className="grid gap-4 sm:grid-cols-2">
          {DEMUESTRA.map((d, i) => (
            <li key={d.titulo} className={i === 0 ? 'sm:col-span-2' : ''}>
              <SpotlightCard className="flex h-full flex-col gap-3 text-linea">
                <h3 className="font-display text-2xl font-semibold leading-tight tracking-tight">{d.titulo}</h3>
                <p className="max-w-[60ch] text-sm leading-relaxed text-linea-2">{d.texto}</p>
              </SpotlightCard>
            </li>
          ))}
        </ul>
      </section>

      <section className="flex flex-col gap-4">
        <h2 className="font-display text-2xl font-semibold tracking-tight text-tinta">La carrera de cincuenta</h2>
        <div className="texto">
          <p>
            El test lanza cincuenta peticiones a la vez por la última franja libre. Solo una recibe la reserva; las otras cuarenta y nueve reciben <code>PISTA_OCUPADA</code>.
            La misma prueba se ejecuta contra tres formas de resolver el conflicto: un bloqueo pesimista en la fila de la pista, una versión optimista por pista y día,
            y una restricción <code>EXCLUDE</code> en la propia base de datos. En producción se usa la tercera, porque sigue funcionando aunque mañana alguien añada otra ruta que inserte reservas.
          </p>
        </div>
        <pre className="overflow-x-auto rounded-ui bg-pista p-4 text-xs leading-relaxed text-linea"><code>{`✓ estrategia pesimista > 50 peticiones simultáneas por la última franja: exactamente una gana
✓ estrategia optimista > 50 peticiones simultáneas por la última franja: exactamente una gana
✓ estrategia exclude   > 50 peticiones simultáneas por la última franja: exactamente una gana`}</code></pre>
      </section>

      <section className="flex flex-col gap-4">
        <h2 className="font-display text-2xl font-semibold tracking-tight text-tinta">Con qué está hecho</h2>
        <ul className="flex flex-wrap gap-2">
          {STACK.map((s) => <li key={s} className="rounded-full border border-borde-fuerte bg-superficie px-3.5 py-1.5 text-sm text-tinta">{s}</li>)}
        </ul>
        <div className="texto">
          <p>
            Monorepo con pnpm: una API hexagonal con un módulo por funcionalidad, una web en React con la lógica de cada pantalla en un hook, y un paquete de contratos que comparten las dos.
            El código, los tests, las decisiones de arquitectura y las instrucciones para ejecutarlo en local están en el repositorio.
          </p>
        </div>
        <a href={REPO_URL} target="_blank" rel="noreferrer" className={`${estilosBoton('secundario')} self-start`}>
          <GithubLogo size={18} aria-hidden="true" />Ver el código en GitHub
        </a>
      </section>
    </Pagina>
  );
}
