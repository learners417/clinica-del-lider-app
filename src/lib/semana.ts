/**
 * La semana del Acompañado — martes adentro, jueves afuera.
 *
 * Entregas: el Iceberg el lunes a las 21:00 (para la sesión del martes) y la
 * Jugada el miércoles a las 21:00 (para la sesión del jueves). Todo acá es
 * lógica pura para poder testearla sin navegador.
 */

export const DIA_ADENTRO = 2;  // martes
export const DIA_AFUERA = 4;   // jueves
export const HORA_ENTREGA = 21;

function soloFecha(d: Date): Date {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}

export function isoLocal(d: Date): string {
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${d.getFullYear()}-${m}-${dd}`;
}

/** La próxima fecha con ese día de la semana (hoy cuenta si coincide). */
export function proximoDia(diaSemana: number, hoy: Date = new Date()): Date {
  const base = soloFecha(hoy);
  const falta = (diaSemana - base.getDay() + 7) % 7;
  base.setDate(base.getDate() + falta);
  return base;
}

export interface Ventana {
  sesion: Date;   // el día de la sesión
  desde: string;  // primer día que cuenta la entrega (iso)
  hasta: string;  // día de la entrega (iso)
  vence: Date;    // la víspera a las 21:00
}

/** La ventana de entrega para la próxima sesión de ese día. */
export function ventanaEntrega(diaSesion: number, hoy: Date = new Date()): Ventana {
  const sesion = proximoDia(diaSesion, hoy);
  const desde = new Date(sesion); desde.setDate(desde.getDate() - 6);
  const vispera = new Date(sesion); vispera.setDate(vispera.getDate() - 1);
  const vence = new Date(vispera); vence.setHours(HORA_ENTREGA, 0, 0, 0);
  return { sesion, desde: isoLocal(desde), hasta: isoLocal(vispera), vence };
}

/** ¿Alguna de estas fechas cae dentro de la ventana? (la sesión del mismo día también vale) */
export function entregadoEnVentana(fechas: string[], v: Ventana): boolean {
  const tope = isoLocal(v.sesion);
  return fechas.some((f) => f >= v.desde && f <= tope);
}

export function textoVence(v: Ventana, ahora: Date = new Date()): string {
  const dias = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'];
  const d = v.vence;
  const vencido = ahora.getTime() > d.getTime();
  const cuando = `${dias[d.getDay()]} ${d.getDate()}, ${HORA_ENTREGA}:00`;
  return vencido ? `Venció el ${cuando}` : `Entrega: ${cuando}`;
}

/** Google Calendar: formato UTC YYYYMMDDTHHMMSSZ. */
function utc(d: Date): string {
  return d.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');
}

export function urlCalendario(titulo: string, detalle: string, inicio: Date, minutos = 30): string {
  const fin = new Date(inicio.getTime() + minutos * 60000);
  const p = new URLSearchParams({
    action: 'TEMPLATE',
    text: titulo,
    details: detalle,
    dates: `${utc(inicio)}/${utc(fin)}`,
  });
  return `https://calendar.google.com/calendar/render?${p.toString()}`;
}

export function linkWhatsApp(texto: string, numero = ''): string {
  const n = numero.replace(/\D/g, '');
  return `https://wa.me/${n}?text=${encodeURIComponent(texto)}`;
}
