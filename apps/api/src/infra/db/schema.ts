import { customType, date, index, integer, jsonb, pgEnum, pgTable, primaryKey, text, time, timestamp, uniqueIndex, uuid } from 'drizzle-orm/pg-core';

export interface Periodo { inicio: Date; fin: Date }

// postgres.js devuelve los rangos como texto: ["2026-10-25 08:00:00+00","2026-10-25 09:30:00+00")
const RANGO = /^[[(]"?([^",]+)"?,"?([^")\]]+)"?[)\]]$/;
export const tstzrange = customType<{ data: Periodo; driverData: string }>({
  dataType: () => 'tstzrange',
  toDriver: (p) => `[${p.inicio.toISOString()},${p.fin.toISOString()})`,
  fromDriver: (v) => {
    const m = RANGO.exec(v);
    if (!m) throw new Error(`tstzrange no reconocido: ${v}`);
    return { inicio: new Date(m[1]!), fin: new Date(m[2]!) };
  },
});

export const deporteEnum = pgEnum('deporte', ['padel', 'tenis', 'futbol']);
export const estadoReservaEnum = pgEnum('estado_reserva', ['confirmada', 'cancelada']);

export const usuarios = pgTable('usuarios', {
  id: uuid('id').primaryKey().defaultRandom(),
  email: text('email').notNull(),
  passwordHash: text('password_hash').notNull(),
  nombre: text('nombre').notNull(),
  creadoEn: timestamp('creado_en', { withTimezone: true }).notNull().defaultNow(),
}, (t) => [uniqueIndex('usuarios_email_unico').on(t.email)]);

export const sesiones = pgTable('sesiones', {
  id: uuid('id').primaryKey().defaultRandom(),
  usuarioId: uuid('usuario_id').notNull().references(() => usuarios.id, { onDelete: 'cascade' }),
  tokenHash: text('token_hash').notNull().unique(),
  creadaEn: timestamp('creada_en', { withTimezone: true }).notNull().defaultNow(),
  ultimoUso: timestamp('ultimo_uso', { withTimezone: true }).notNull().defaultNow(),
  expiraEn: timestamp('expira_en', { withTimezone: true }).notNull(),
});

export const intentosLogin = pgTable('intentos_login', {
  id: uuid('id').primaryKey().defaultRandom(),
  clave: text('clave').notNull(),
  intentoEn: timestamp('intento_en', { withTimezone: true }).notNull().defaultNow(),
}, (t) => [index('intentos_login_clave').on(t.clave, t.intentoEn)]);

export const pistas = pgTable('pistas', {
  id: uuid('id').primaryKey().defaultRandom(),
  nombre: text('nombre').notNull(),
  deporte: deporteEnum('deporte').notNull(),
  duracionMin: integer('duracion_min').notNull(),
  apertura: time('apertura').notNull(),
  cierre: time('cierre').notNull(),
});

// Solo la usa la estrategia optimista: un contador de versión por pista y día.
export const pistaDias = pgTable('pista_dias', {
  pistaId: uuid('pista_id').notNull().references(() => pistas.id),
  fecha: date('fecha').notNull(),
  version: integer('version').notNull().default(0),
}, (t) => [primaryKey({ columns: [t.pistaId, t.fecha] })]);

export const reservas = pgTable('reservas', {
  id: uuid('id').primaryKey().defaultRandom(),
  pistaId: uuid('pista_id').notNull().references(() => pistas.id),
  usuarioId: uuid('usuario_id').notNull().references(() => usuarios.id),
  periodo: tstzrange('periodo').notNull(),
  estado: estadoReservaEnum('estado').notNull().default('confirmada'),
  creadaEn: timestamp('creada_en', { withTimezone: true }).notNull().defaultNow(),
}, (t) => [index('reservas_pista').on(t.pistaId), index('reservas_usuario').on(t.usuarioId)]);

export const idempotencia = pgTable('idempotencia', {
  usuarioId: uuid('usuario_id').notNull().references(() => usuarios.id, { onDelete: 'cascade' }),
  clave: uuid('clave').notNull(),
  hashPeticion: text('hash_peticion').notNull(),
  estadoHttp: integer('estado_http'),
  respuesta: jsonb('respuesta'),
  creadaEn: timestamp('creada_en', { withTimezone: true }).notNull().defaultNow(),
}, (t) => [primaryKey({ columns: [t.usuarioId, t.clave] })]);
