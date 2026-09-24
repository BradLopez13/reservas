import { CodigoError } from '@reservas/contracts';

export class ErrorDominio extends Error {
  constructor(readonly code: CodigoError, readonly status: number, message: string, readonly details?: unknown) {
    super(message);
    this.name = new.target.name;
  }
}
export class ErrorValidacion extends ErrorDominio { constructor(details?: unknown) { super(CodigoError.VALIDACION, 422, 'Datos no válidos', details); } }
export class NoAutenticado extends ErrorDominio { constructor() { super(CodigoError.NO_AUTENTICADO, 401, 'Hace falta iniciar sesión'); } }
export class OrigenNoPermitido extends ErrorDominio { constructor() { super(CodigoError.ORIGEN_NO_PERMITIDO, 403, 'Origen no permitido'); } }
export class CredencialesInvalidas extends ErrorDominio { constructor() { super(CodigoError.CREDENCIALES_INVALIDAS, 401, 'Email o contraseña incorrectos'); } }
export class DemasiadosIntentos extends ErrorDominio { constructor(readonly retryAfterSeg: number) { super(CodigoError.DEMASIADOS_INTENTOS, 429, 'Demasiados intentos, espera antes de volver a probar'); } }
export class EmailEnUso extends ErrorDominio { constructor() { super(CodigoError.EMAIL_EN_USO, 409, 'Ya existe una cuenta con ese email'); } }
export class PistaNoEncontrada extends ErrorDominio { constructor() { super(CodigoError.PISTA_NO_ENCONTRADA, 404, 'Pista no encontrada'); } }
export class FranjaInvalida extends ErrorDominio { constructor(motivo: string) { super(CodigoError.FRANJA_INVALIDA, 422, motivo); } }
export class PistaOcupadaError extends ErrorDominio { constructor() { super(CodigoError.PISTA_OCUPADA, 409, 'Esa franja ya está reservada'); } }
export class ReservaNoEncontrada extends ErrorDominio { constructor() { super(CodigoError.RESERVA_NO_ENCONTRADA, 404, 'Reserva no encontrada'); } }
export class FueraDePlazo extends ErrorDominio { constructor() { super(CodigoError.FUERA_DE_PLAZO, 409, 'Solo se puede cancelar hasta 2 horas antes'); } }
export class IdempotenciaEnCurso extends ErrorDominio { constructor() { super(CodigoError.IDEMPOTENCIA_EN_CURSO, 409, 'Esa petición todavía se está procesando'); } }
export class IdempotenciaConflicto extends ErrorDominio { constructor() { super(CodigoError.IDEMPOTENCIA_CONFLICTO, 422, 'La clave de idempotencia ya se usó con otros datos'); } }
