import { FranjaSchema, PistaSchema, type Deporte } from '@reservas/contracts';
import { z } from 'zod';
import { cliente } from '../../shared/api/cliente.ts';

export const listarPistas = async (deporte?: Deporte) =>
  z.array(PistaSchema).parse((await cliente.get('/pistas', { params: deporte ? { deporte } : {} })).data);

export const franjasDe = async (pistaId: string, fecha: string) =>
  z.array(FranjaSchema).parse((await cliente.get(`/pistas/${pistaId}/franjas`, { params: { fecha } })).data);
