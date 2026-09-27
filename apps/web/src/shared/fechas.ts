import { idioma, LOCALE } from '../i18n/i18n.ts';

// Toda la presentación de fechas se hace en hora de Madrid, que es la de las
// pistas; los nombres de día y mes salen en el idioma elegido.
export const ZONA = 'Europe/Madrid';

const locale = () => LOCALE[idioma()];

export const hora = (d: Date) => d.toLocaleTimeString(locale(), { timeZone: ZONA, hour: '2-digit', minute: '2-digit', hour12: false });

export const diaCorto = (d: Date) => d.toLocaleDateString(locale(), { timeZone: ZONA, weekday: 'short', day: 'numeric', month: 'short' });

// YYYY-MM-DD en Madrid (el locale sv-SE usa justo ese formato).
export const fechaLocal = (d: Date) => d.toLocaleDateString('sv-SE', { timeZone: ZONA });

export const hoy = () => fechaLocal(new Date());

export const rangoHoras = (inicio: Date, fin: Date) => `${hora(inicio)}–${hora(fin)}`;
