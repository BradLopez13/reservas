import { z } from 'zod';

const email = z.email().max(254).transform((v) => v.trim().toLowerCase());
const password = z.string().min(10).max(128);

export const RegistroBodySchema = z.object({ email, password, nombre: z.string().trim().min(1).max(60) });
export const LoginBodySchema = z.object({ email, password: z.string().min(1).max(128) });
export const CambiarPasswordBodySchema = z.object({ actual: z.string().min(1).max(128), nueva: password });
export const UsuarioSchema = z.object({ id: z.uuid(), email: z.email(), nombre: z.string() });

export type Registro = z.infer<typeof RegistroBodySchema>;
export type Login = z.infer<typeof LoginBodySchema>;
export type CambiarPassword = z.infer<typeof CambiarPasswordBodySchema>;
export type Usuario = z.infer<typeof UsuarioSchema>;
