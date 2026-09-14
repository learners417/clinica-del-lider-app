/** El feedback táctil de la clínica — un latido corto cuando algo queda hecho. */
export const LATIDO_HECHO = [10, 40, 18];
export const LATIDO_HITO = [14, 60, 14, 60, 30];

export function vibrar(patron: number | number[] = 10): void {
  try {
    if (typeof navigator !== 'undefined' && 'vibrate' in navigator) navigator.vibrate(patron);
  } catch { /* el dispositivo no lo soporta: no pasa nada */ }
}
