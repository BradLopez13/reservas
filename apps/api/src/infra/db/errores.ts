// Drizzle envuelve los errores del driver en DrizzleQueryError; el SQLSTATE de
// PostgreSQL (p. ej. 23P01 = exclusion_violation) queda en `cause`.
export function codigoPg(e: unknown): string | undefined {
  const err = e as { code?: unknown; cause?: { code?: unknown } } | null;
  const code = err?.cause?.code ?? err?.code;
  return typeof code === 'string' ? code : undefined;
}
