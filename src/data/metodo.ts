/**
 * EL EJE — el método de La Clínica del Líder.
 *
 * El nombre viene de la columna del medio del Árbol, el kav ha-emtzaí: la que
 * reconcilia la expansión con la contención. Ni desbordarse ni endurecerse:
 * sostenerse en el centro. En el Tablero es la columna donde viven Propósito,
 * Verdad, Energía y Resultados.
 *
 * Y es a la vez el ciclo que se repite todos los días:
 *   ESPEJO     ves lo que es, sin interpretación y sin látigo
 *   JUGADA     haces un movimiento concreto, uno solo, hoy
 *   EVIDENCIA  miras si pasó algo, en el registro y no en la sensación
 *
 * Las tres herramientas de la app ya son las tres letras: el Tablero es el
 * espejo, la Dosis es la jugada, los cuatro Signos son la evidencia.
 *
 * El paciente no lee una palabra de la columna del medio. Lee el ciclo.
 */

export const METODO = {
  nombre: 'EL EJE',
  bajada: 'El método de La Clínica del Líder',
  ciclo: 'Espejo · Jugada · Evidencia',
} as const;

export interface PasoDelCiclo {
  letra: 'E' | 'J';
  id: 'espejo' | 'jugada' | 'evidencia';
  nombre: string;
  /** Qué es, en una línea, para el paciente. */
  que: string;
  /** Dónde vive dentro de la app. */
  donde: string;
}

export const CICLO: PasoDelCiclo[] = [
  {
    letra: 'E', id: 'espejo', nombre: 'Espejo',
    que: 'Ves lo que es. Sin interpretarlo y sin castigarte: el dato, como está.',
    donde: 'Tu Tablero y la lectura de cada día.',
  },
  {
    letra: 'J', id: 'jugada', nombre: 'Jugada',
    que: 'Haces un movimiento concreto. Uno solo, hoy, del tamaño que entre en tu día.',
    donde: 'La acción de tu Dosis.',
  },
  {
    letra: 'E', id: 'evidencia', nombre: 'Evidencia',
    que: 'Miras si pasó algo. No lo que sientes: lo que muestra el registro.',
    donde: 'Tus cuatro Signos de sesenta segundos.',
  },
];

/** La frase de una línea, para cuando hay que explicarlo rápido. */
export const EN_UNA_LINEA =
  'Te miras sin castigarte, haces un movimiento, y compruebas si pasó algo. Otra vez, todos los días.';
