import { Link } from 'react-router';
import { estilosBoton } from '../../../shared/components/Boton.tsx';
import { Pagina } from '../../../shared/components/Pagina.tsx';
import { FOTO_COMO_FUNCIONA } from '../../../shared/fotos.ts';

// Página estática: no tiene view-model.
const PASOS = [
  { titulo: 'Elige la pista', texto: 'Pádel, tenis o fútbol. Cada pista muestra su horario y cuánto dura cada franja.' },
  { titulo: 'Mira el día', texto: 'Las horas libres y las ocupadas, en hora de Madrid. Puedes reservar desde hoy en adelante.' },
  { titulo: 'Confirma', texto: 'Necesitas una cuenta. Si alguien reserva la misma hora un instante antes que tú, lo verás al momento y podrás elegir otra.' },
  { titulo: 'Gestiona tus reservas', texto: 'Todas aparecen en Mis reservas. Puedes cancelar hasta dos horas antes de que empiece.' },
];

const PREGUNTAS = [
  { p: '¿Cuesta algo?', r: 'No. Es una aplicación de demostración: no hay pagos ni cuotas, y las reservas no dan acceso a ninguna pista real.' },
  { p: '¿Puedo reservar más de una hora?', r: 'Sí. Cada reserva es una franja; reserva la siguiente igual que la primera.' },
  { p: '¿Qué pasa si dos personas reservan a la vez?', r: 'Solo una consigue la hora. La otra recibe un aviso al instante y la franja aparece como ocupada.' },
  { p: '¿En qué hora se muestran las franjas?', r: 'Siempre en hora de Madrid, que es donde están las pistas, aunque consultes desde otro lugar.' },
];

export function ComoFuncionaScreen() {
  return (
    <Pagina titulo="Cómo funciona" entradilla="Reservar una pista lleva menos de un minuto. Estos son los cuatro pasos." foto={FOTO_COMO_FUNCIONA}>
      <ol className="grid gap-4 sm:grid-cols-2">
        {PASOS.map((paso, i) => (
          <li key={paso.titulo} className="flex gap-4 rounded-tarjeta border border-borde bg-superficie p-5">
            <span className="grid size-9 shrink-0 place-items-center rounded-full bg-acento-suave font-display text-sm font-semibold text-acento">{i + 1}</span>
            <div className="flex flex-col gap-1">
              <h2 className="font-display text-lg font-semibold tracking-tight text-tinta">{paso.titulo}</h2>
              <p className="text-sm leading-relaxed text-tinta-2">{paso.texto}</p>
            </div>
          </li>
        ))}
      </ol>

      <section className="flex flex-col gap-4">
        <h2 className="font-display text-2xl font-semibold tracking-tight text-tinta">Preguntas frecuentes</h2>
        <div className="divide-y divide-borde border-y border-borde">
          {PREGUNTAS.map((q) => (
            <details key={q.p} className="group py-4">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-medium text-tinta marker:hidden [&::-webkit-details-marker]:hidden">
                {q.p}
                <span aria-hidden="true" className="text-tinta-3 transition-transform duration-200 group-open:rotate-45">+</span>
              </summary>
              <p className="pt-3 text-sm leading-relaxed text-tinta-2">{q.r}</p>
            </details>
          ))}
        </div>
      </section>

      <Link to="/" className={`${estilosBoton('primario')} self-start`}>Ver pistas</Link>
    </Pagina>
  );
}
