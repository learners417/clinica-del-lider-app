/** La ficha del terapeuta — cálculos puros (testeables sin nube ni navegador). */
import type { ChequeoGuardado } from './estadoCdl';
import { ventanaEntrega, entregadoEnVentana, isoLocal } from './semana';

/** El Chequeo más reciente que marcó derivación y todavía no se habló. */
export function barandillaPendiente(chequeos: ChequeoGuardado[], habladas: string[]): ChequeoGuardado | null {
  const marcados = chequeos.filter((c) => c.phq9?.derivar && !habladas.includes(c.fecha));
  return marcados.length ? marcados[marcados.length - 1] : null;
}

/**
 * Entregas a tiempo en las últimas N semanas ya vencidas, desde que arrancó.
 * Cuenta una semana si hubo entrega dentro de su ventana.
 */
export function aTiempo(fechas: string[], diaSesion: number, hoy: Date, desde: string, semanas = 4): { hechas: number; total: number } {
  let hechas = 0, total = 0;
  for (let k = 0; k < semanas + 1 && total < semanas; k++) {
    const ref = new Date(hoy); ref.setDate(ref.getDate() - 7 * k);
    const v = ventanaEntrega(diaSesion, ref);
    if (v.vence.getTime() > hoy.getTime()) continue;       // todavía no venció
    if (isoLocal(v.sesion) <= desde) break;                // antes de empezar no cuenta
    total++;
    if (entregadoEnVentana(fechas, v)) hechas++;
  }
  return { hechas, total };
}

export function promedio(ns: number[]): number | null {
  const v = ns.filter((n) => typeof n === 'number' && !Number.isNaN(n));
  return v.length ? Math.round((v.reduce((a, b) => a + b, 0) / v.length) * 10) / 10 : null;
}
