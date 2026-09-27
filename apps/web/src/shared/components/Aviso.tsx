import { CheckCircle, Info, WarningCircle } from '@phosphor-icons/react';
import type { ReactNode } from 'react';

const ESTILOS = {
  error: { clase: 'bg-error-suave text-error', Icono: WarningCircle },
  ok: { clase: 'bg-ok-suave text-ok', Icono: CheckCircle },
  info: { clase: 'bg-info-suave text-info', Icono: Info },
} as const;

export function Aviso({ tipo, children }: { tipo: 'error' | 'ok' | 'info'; children: ReactNode }) {
  const { clase, Icono } = ESTILOS[tipo];
  return (
    <div role={tipo === 'error' ? 'alert' : 'status'} className={`flex items-start gap-2.5 rounded-ui px-3.5 py-3 text-sm font-medium ${clase}`}>
      <Icono size={20} weight="fill" className="mt-px shrink-0" aria-hidden="true" />
      <span>{children}</span>
    </div>
  );
}
