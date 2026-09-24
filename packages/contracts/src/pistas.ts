import { z } from 'zod';

export const DeporteSchema = z.enum(['padel', 'tenis', 'futbol']);
export type Deporte = z.infer<typeof DeporteSchema>;

const hora = z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/, 'HH:MM');

export const PistaSchema = z.object({
  id: z.uuid(),
  nombre: z.string(),
  deporte: DeporteSchema,
  duracionMin: z.number().int().positive(),
  apertura: hora,
  cierre: hora,
});
export const PistasQuerySchema = z.object({ deporte: DeporteSchema.optional() });
export type Pista = z.infer<typeof PistaSchema>;
