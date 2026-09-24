export const ZONA = 'Europe/Madrid';

function partes(d: Date, tz: string) {
  const p = new Intl.DateTimeFormat('en-US', {
    timeZone: tz, hourCycle: 'h23', year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit',
  }).formatToParts(d);
  const n = (t: string) => Number(p.find((x) => x.type === t)!.value);
  return { y: n('year'), m: n('month'), d: n('day'), h: n('hour'), mi: n('minute'), s: n('second') };
}

function offsetMin(d: Date, tz: string) {
  const { y, m, d: dd, h, mi, s } = partes(d, tz);
  return (Date.UTC(y, m - 1, dd, h, mi, s) - d.getTime()) / 60_000;
}

// "2026-10-25" + "09:00" en Madrid → instante UTC. Dos pasadas para resolver el cambio de hora.
export function aUtc(fecha: string, hora: string, tz = ZONA): Date {
  const [y, m, d] = fecha.split('-').map(Number) as [number, number, number];
  const [h, mi] = hora.split(':').map(Number) as [number, number];
  const guess = Date.UTC(y, m - 1, d, h, mi);
  let t = guess - offsetMin(new Date(guess), tz) * 60_000;
  const off2 = offsetMin(new Date(t), tz);
  if (guess - off2 * 60_000 !== t) t = guess - off2 * 60_000;
  return new Date(t);
}

export function fechaLocal(instante: Date, tz = ZONA): string {
  const { y, m, d } = partes(instante, tz);
  return `${y}-${String(m).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
}
