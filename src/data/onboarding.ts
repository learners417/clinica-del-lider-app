/**
 * EL CHEQUEO · DÍA 0 — las listas y los cálculos del onboarding.
 *
 * Regla que ordena todo esto: cada dato que se pide tiene que cambiar algo
 * concreto en el programa. Si no cambia nada, no se pregunta.
 *
 * Los motivos y el desde cuándo los consume contexto.ts; el resto, Chequeo.tsx.
 */


export const MOTIVOS = [
  'Un estrés que ya no baja',
  'Agotamiento: ya no doy más',
  'Ansiedad',
  'No duermo',
  'Me alejé de los míos',
  'Quiero un nivel que hoy no alcanzo',
];

export const DESDE = [
  'Menos de seis meses',
  'Seis meses a dos años',
  'Dos a cinco años',
  'Más de cinco años',
];

export const APAGADORES = [
  'Pantalla', 'Alcohol', 'Cigarrillo', 'Marihuana', 'Otras sustancias',
  'Comida', 'Sexo sin presencia', 'Trabajo hasta caer', 'Nada, me apago solo',
];

/** Marcadas acá, la Dosis no toca el tema: salta al panel del clínico. */
export const APAGADORES_QUE_AVISAN = ['Otras sustancias', 'Marihuana', 'Alcohol'];

export const VENTANA = ['Ninguno', 'Diez', 'Veinte', 'Cuarenta o más'];
export const VENTANA_MIN = [0, 10, 20, 40];

/** Horas dormidas a partir de dos horarios "HH:MM". Cruza la medianoche. */
export function horasDormidas(acoste: string, levante: string): number {
  const [a, b] = acoste.split(':').map(Number);
  const [c, d] = levante.split(':').map(Number);
  let min = c * 60 + d - (a * 60 + b);
  if (min < 0) min += 1440;
  return Math.round((min / 60) * 10) / 10;
}

/** ¿Hay que avisarle al clínico por lo que marcó en cómo se apaga? */
export function avisaAlClinico(apagar: number[]): boolean {
  return apagar.some((i) => APAGADORES_QUE_AVISAN.includes(APAGADORES[i]));
}
