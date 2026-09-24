import { UsuarioSchema, type CambiarPassword, type Login, type Registro } from '@reservas/contracts';
import { cliente } from './cliente.ts';

export const registro = async (d: Registro) => UsuarioSchema.parse((await cliente.post('/auth/registro', d)).data);
export const login = async (d: Login) => { await cliente.post('/auth/login', d); };
export const logout = async () => { await cliente.post('/auth/logout'); };
export const yo = async () => UsuarioSchema.parse((await cliente.get('/auth/yo')).data);
export const cerrarSesiones = async () => { await cliente.post('/auth/cerrar-sesiones'); };
export const cambiarPassword = async (d: CambiarPassword) => { await cliente.put('/auth/password', d); };
