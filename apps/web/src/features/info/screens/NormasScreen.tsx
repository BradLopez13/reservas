import { CalendarCheck, Clock, Prohibit, ShieldCheck, XCircle } from '@phosphor-icons/react';
import type { Icon } from '@phosphor-icons/react';
import { Pagina } from '../../../shared/components/Pagina.tsx';
import { FOTO_NORMAS } from '../../../shared/fotos.ts';

// Página estática: no tiene view-model.
const NORMAS: { Icono: Icon; titulo: string; texto: string }[] = [
  { Icono: Clock, titulo: 'Horarios', texto: 'Cada pista tiene su horario de apertura y su duración de franja. Los dos aparecen en su ficha y en la lista de pistas.' },
  { Icono: CalendarCheck, titulo: 'Antelación', texto: 'Se puede reservar desde hoy en adelante, sin límite de días. No se puede reservar una franja que ya ha empezado.' },
  { Icono: XCircle, titulo: 'Cancelaciones', texto: 'Hasta dos horas antes del inicio. La reserva queda como cancelada en tu historial y la hora vuelve a estar libre para los demás.' },
  { Icono: ShieldCheck, titulo: 'Cuenta', texto: 'Una cuenta por email, con una contraseña de al menos diez caracteres. Desde Ajustes puedes cambiarla o cerrar la sesión en todos los dispositivos.' },
  { Icono: Prohibit, titulo: 'Uso', texto: 'Es una aplicación de demostración. No hay pagos y las reservas no dan acceso a ninguna instalación real. Los datos de prueba pueden borrarse en cualquier momento.' },
];

export function NormasScreen() {
  return (
    <Pagina titulo="Normas de reserva" entradilla="Pocas y claras. Lo que puedes hacer con una reserva y hasta cuándo." foto={FOTO_NORMAS}>
      <ul className="grid gap-4 sm:grid-cols-2">
        {NORMAS.map(({ Icono, titulo, texto }, i) => (
          <li key={titulo} className={`flex flex-col gap-3 rounded-tarjeta border border-borde bg-superficie p-5 ${i === NORMAS.length - 1 ? 'sm:col-span-2' : ''}`}>
            <span className="grid size-10 place-items-center rounded-ui bg-acento-suave text-acento"><Icono size={20} weight="duotone" aria-hidden="true" /></span>
            <h2 className="font-display text-lg font-semibold tracking-tight text-tinta">{titulo}</h2>
            <p className="text-sm leading-relaxed text-tinta-2">{texto}</p>
          </li>
        ))}
      </ul>
    </Pagina>
  );
}
