import type { ReactNode } from 'react';

export function Aviso({ tipo, children }: { tipo: 'error' | 'ok' | 'info'; children: ReactNode }) {
  const estilo = {
    error: 'border-red-300 bg-red-50 text-red-800',
    ok: 'border-emerald-300 bg-emerald-50 text-emerald-800',
    info: 'border-sky-300 bg-sky-50 text-sky-800',
  }[tipo];
  return <div role={tipo === 'error' ? 'alert' : 'status'} className={`rounded border px-3 py-2 text-sm ${estilo}`}>{children}</div>;
}
