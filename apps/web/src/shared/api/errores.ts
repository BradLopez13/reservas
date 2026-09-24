import type { CodigoError } from '@reservas/contracts';

// Todo error HTTP llega a los componentes como ApiError, con el `code` del contrato.
export class ApiError extends Error {
  constructor(readonly code: CodigoError, readonly status: number, message: string, readonly details?: unknown) {
    super(message);
    this.name = 'ApiError';
  }
}
