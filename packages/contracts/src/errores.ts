import { z } from 'zod';

export const CodigoError = {
  VALIDACION: 'VALIDACION',
  NO_AUTENTICADO: 'NO_AUTENTICADO',
  ORIGEN_NO_PERMITIDO: 'ORIGEN_NO_PERMITIDO',
  CREDENCIALES_INVALIDAS: 'CREDENCIALES_INVALIDAS',
  DEMASIADOS_INTENTOS: 'DEMASIADOS_INTENTOS',
  EMAIL_EN_USO: 'EMAIL_EN_USO',
  PISTA_NO_ENCONTRADA: 'PISTA_NO_ENCONTRADA',
  FRANJA_INVALIDA: 'FRANJA_INVALIDA',
  PISTA_OCUPADA: 'PISTA_OCUPADA',
  RESERVA_NO_ENCONTRADA: 'RESERVA_NO_ENCONTRADA',
  FUERA_DE_PLAZO: 'FUERA_DE_PLAZO',
  IDEMPOTENCIA_EN_CURSO: 'IDEMPOTENCIA_EN_CURSO',
  IDEMPOTENCIA_CONFLICTO: 'IDEMPOTENCIA_CONFLICTO',
  ERROR_INTERNO: 'ERROR_INTERNO',
} as const;
export type CodigoError = (typeof CodigoError)[keyof typeof CodigoError];

export const ErrorRespuestaSchema = z.object({
  error: z.object({
    code: z.enum(Object.values(CodigoError) as [CodigoError, ...CodigoError[]]),
    message: z.string(),
    details: z.unknown().optional(),
  }),
});
export type ErrorRespuesta = z.infer<typeof ErrorRespuestaSchema>;
