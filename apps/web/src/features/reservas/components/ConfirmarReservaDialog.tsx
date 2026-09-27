import { motion } from 'motion/react';
import { useEffect, useId } from 'react';
import { Aviso } from '../../../shared/components/Aviso.tsx';
import { Boton } from '../../../shared/components/Boton.tsx';
import { useReducedMotion } from '../../../shared/hooks/useReducedMotion.ts';
import { ClickSpark } from '../../../shared/react-bits/ClickSpark.tsx';
import type { EstadoConfirmacion } from '../hooks/useConfirmarReserva.ts';

export interface ConfirmarReservaDialogProps {
  etiqueta: string; dia: string; pistaNombre: string | undefined; estado: EstadoConfirmacion;
  onConfirmar: () => void; onVerReservas: () => void; onCerrar: () => void;
}

// Capas: la barra flotante va en z-50 y este diálogo por encima, en z-60.
export function ConfirmarReservaDialog({ etiqueta, dia, pistaNombre, estado, onConfirmar, onVerReservas, onCerrar }: ConfirmarReservaDialogProps) {
  const reducido = useReducedMotion();
  const idTitulo = useId();
  const terminado = estado === 'confirmada' || estado === 'ocupada';
  const reservando = estado === 'reservando';

  // Escape cierra, salvo mientras la petición está en vuelo.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape' && !reservando) onCerrar(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onCerrar, reservando]);

  return (
    <motion.div
      initial={reducido ? false : { opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.2 }}
      className="fixed inset-0 z-[60] grid place-items-center bg-pista-2/70 p-4 backdrop-blur-md"
    >
      <motion.div
        role="dialog"
        aria-modal="true"
        aria-labelledby={idTitulo}
        initial={reducido ? false : { opacity: 0, y: 16, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ type: 'spring', stiffness: 300, damping: 26 }}
        className="bisel w-full max-w-md shadow-flotante"
      >
        <div className="flex flex-col gap-5 bg-superficie p-6">
        <h2 id={idTitulo} className="font-display text-2xl font-semibold tracking-tight text-tinta">
          {estado === 'confirmada' ? 'Reserva hecha' : 'Confirmar reserva'}
        </h2>

        <dl className="grid grid-cols-[auto_1fr] gap-x-6 gap-y-2 rounded-ui bg-superficie-2 px-4 py-3.5 text-sm">
          <dt className="text-tinta-2">Pista</dt><dd className="font-medium text-tinta">{pistaNombre ?? 'Pista'}</dd>
          <dt className="text-tinta-2">Día</dt><dd className="font-medium capitalize text-tinta">{dia}</dd>
          <dt className="text-tinta-2">Hora</dt><dd className="font-medium tabular-nums text-tinta">{etiqueta}</dd>
        </dl>

        {estado === 'ocupada' && <Aviso tipo="error">Alguien se te ha adelantado: esa franja ya está ocupada. Elige otra.</Aviso>}
        {estado === 'error' && <Aviso tipo="error">No se ha podido reservar. Vuelve a intentarlo.</Aviso>}
        {estado === 'confirmada' && <Aviso tipo="ok">Reserva confirmada.</Aviso>}

        <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <Boton variante="secundario" onClick={onCerrar} disabled={reservando}>{terminado ? 'Cerrar' : 'Cancelar'}</Boton>
          {estado === 'confirmada' && <Boton onClick={onVerReservas} autoFocus>Ver mis reservas</Boton>}
          {!terminado && (
            <ClickSpark>
              <Boton className="w-full sm:w-auto" disabled={reservando} onClick={onConfirmar} autoFocus>{reservando ? 'Reservando…' : 'Confirmar'}</Boton>
            </ClickSpark>
          )}
        </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
