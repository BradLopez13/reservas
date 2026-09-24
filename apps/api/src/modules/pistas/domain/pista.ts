import type { Deporte } from '@reservas/contracts';

export interface Pista { id: string; nombre: string; deporte: Deporte; duracionMin: number; apertura: string; cierre: string }
