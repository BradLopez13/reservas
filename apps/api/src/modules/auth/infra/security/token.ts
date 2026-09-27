import { createHash, randomBytes } from 'node:crypto';

// El token viaja en la cookie; en la base de datos solo se guarda su hash.
export function hashToken(token: string) { return createHash('sha256').update(token).digest('hex'); }
export function generarToken() { const token = randomBytes(32).toString('base64url'); return { token, hash: hashToken(token) }; }
