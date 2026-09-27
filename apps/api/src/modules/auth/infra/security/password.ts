import { hash, verify } from '@node-rs/argon2';

const OPCIONES = { memoryCost: 19_456, timeCost: 2, parallelism: 1 }; // OWASP 2024 para Argon2id

export function hashPassword(p: string) { return hash(p, OPCIONES); }
export async function verificarPassword(h: string, p: string) { try { return await verify(h, p, OPCIONES); } catch { return false; } }

// Se verifica contra este hash cuando el email no existe, para que el tiempo de
// respuesta sea el mismo y no se pueda averiguar qué emails están registrados.
export const HASH_RELLENO = await hash('relleno-anti-enumeracion', OPCIONES);
