import { motion } from 'motion/react';
import { useEffect, useId } from 'react';
import { useT } from '../../../i18n/i18n.ts';
import { Aviso } from '../../../shared/components/Aviso.tsx';
import { Boton } from '../../../shared/components/Boton.tsx';
import { useReducedMotion } from '../../../shared/hooks/useReducedMotion.ts';
import { ClickSpark } from '../../../shared/react-bits/ClickSpark.tsx';
import type { EstadoConfirmacion } from '../hooks/useConfirmarReserva.ts';

export interface ConfirmarReservaDialogProps {
  etiqueta: string; dia: string; pistaNombre: string | undefined; estado: EstadoConfirmacion;
  onConfirmar: () => void; onVerReservas: () => void; onCerrar: () => void;
}

// Capas: la barra va en z-50 y este diálogo por encima, en z-60. El resumen
// de la reserva tiene la forma de la entrada que va a ser.
export function ConfirmarReservaDialog({ etiqueta, dia, pistaNombre, estado, onConfirmar, onVerReservas, onCerrar }: ConfirmarReservaDialogProps) {
  const { t } = useT();
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
        <div className="flex flex-col gap-6 bg-superficie p-6">
          <div className="flex flex-col gap-2">
            <p className="rotulo uppercase text-tinta-3">{t('misReservas.entrada')}</p>
            <h2 id={idTitulo} className="font-display text-3xl font-semibold tracking-tight text-tinta">
              {estado === 'confirmada' ? t('confirmar.hecha') : t('confirmar.titulo')}
            </h2>
          </div>

          <dl className="tablon grid grid-cols-[1fr_1fr]">
            <div className="col-span-2 flex flex-col gap-1 px-4 py-3.5">
              <dt className="rotulo uppercase text-tinta-3">{t('confirmar.pista')}</dt>
              <dd className="font-display text-xl font-semibold tracking-tight text-tinta">{pistaNombre ?? t('pista.generico')}</dd>
            </div>
            <div className="flex flex-col gap-1 px-4 py-3.5">
              <dt className="rotulo uppercase text-tinta-3">{t('confirmar.dia')}</dt>
              <dd className="cifra capitalize text-tinta">{dia}</dd>
            </div>
            <div className="flex flex-col gap-1 px-4 py-3.5">
              <dt className="rotulo uppercase text-tinta-3">{t('confirmar.hora')}</dt>
              <dd className="cifra text-tinta">{etiqueta}</dd>
            </div>
          </dl>

          {estado === 'ocupada' && <Aviso tipo="error">{t('confirmar.ocupada')}</Aviso>}
          {estado === 'error' && <Aviso tipo="error">{t('confirmar.error')}</Aviso>}
          {estado === 'confirmada' && <Aviso tipo="ok">{t('confirmar.confirmada')}</Aviso>}

          <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
            <Boton variante="secundario" onClick={onCerrar} disabled={reservando}>{terminado ? t('confirmar.cerrar') : t('confirmar.cancelar')}</Boton>
            {estado === 'confirmada' && <Boton onClick={onVerReservas} autoFocus>{t('confirmar.verMisReservas')}</Boton>}
            {!terminado && (
              <ClickSpark>
                <Boton className="w-full sm:w-auto" disabled={reservando} onClick={onConfirmar} autoFocus>{reservando ? t('confirmar.reservando') : t('confirmar.confirmar')}</Boton>
              </ClickSpark>
            )}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
