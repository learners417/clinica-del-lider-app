/**
 * EL ÁRBOL — el tablero de las 10 medidas.
 * Reemplaza a la Rueda de la Vida de 9 áreas (v1.0).
 *
 * Cada medida se pregunta por CONDUCTA observable, nunca por autoimagen:
 * "¿con qué frecuencia hiciste X?" en vez de "¿qué tan bueno eres en X?".
 * Un líder agotado se miente justo en la autoimagen; en la conducta no puede.
 *
 * Cuatro medidas se puntúan al revés (inv) y están repartidas entre las tres
 * columnas a propósito: si estuvieran juntas, se responde en piloto automático.
 *
 * Escala: la misma del CBI (0 · 25 · 50 · 75 · 100), para que las dos
 * mediciones hablen el mismo idioma.
 */

export type Columna = 'izq' | 'eje' | 'der';

export interface Medida {
  id: string;
  nombre: string;
  columna: Columna;
  /** Raíz en el Árbol. Nunca se muestra al paciente: es cara interna. */
  raiz: string;
  /** true = más frecuencia es peor; el puntaje se invierte. */
  inv: boolean;
  pregunta: string;
  /** Qué significa la medida, en una línea, para el informe y el Clínico. */
  descriptor: string;
  /** Posición en el diagrama del Árbol (viewBox 340 × 580). */
  pos: [number, number];
}

export const MEDIDAS: Medida[] = [
  {
    id: 'proposito', nombre: 'Propósito', columna: 'eje', raiz: 'Kéter', inv: false,
    pregunta: '¿Con qué frecuencia lo que haces en el día te acerca a algo que tú elegiste?',
    descriptor: 'Cuánto de tu vida elegiste tú.',
    pos: [170, 44],
  },
  {
    id: 'vision', nombre: 'Visión', columna: 'der', raiz: 'Jojmá', inv: false,
    pregunta: '¿Con qué frecuencia aparece una idea nueva cuando no la estás buscando?',
    descriptor: 'Si todavía tienes lugar para que se te ocurra algo.',
    pos: [258, 128],
  },
  {
    id: 'claridad', nombre: 'Claridad', columna: 'izq', raiz: 'Biná', inv: true,
    pregunta: '¿Con qué frecuencia terminas el día con una decisión importante sin tomar?',
    descriptor: 'Si tu cabeza puede cerrar lo que abre.',
    pos: [82, 128],
  },
  {
    id: 'presencia', nombre: 'Presencia', columna: 'der', raiz: 'Jésed', inv: true,
    pregunta: 'Cuando estás con las personas que amas, ¿con qué frecuencia tu cabeza sigue en el trabajo?',
    descriptor: 'Si estás donde estás.',
    pos: [258, 230],
  },
  {
    id: 'limite', nombre: 'Límite', columna: 'izq', raiz: 'Guevurá', inv: true,
    pregunta: '¿Con qué frecuencia terminas haciendo algo que ya sabías que no querías hacer?',
    descriptor: 'Si tu no llega antes o después del sí.',
    pos: [82, 230],
  },
  {
    id: 'verdad', nombre: 'Verdad', columna: 'eje', raiz: 'Tiféret', inv: true,
    pregunta: '¿Con qué frecuencia dices que sí cuando por dentro es no?',
    descriptor: 'La distancia entre lo que dices y lo que es.',
    pos: [170, 300],
  },
  {
    id: 'empuje', nombre: 'Empuje', columna: 'der', raiz: 'Nétzaj', inv: false,
    pregunta: '¿Con qué frecuencia lo que empiezas sigue vivo un mes después?',
    descriptor: 'Si lo tuyo permanece o solo arranca.',
    pos: [258, 382],
  },
  {
    id: 'recibir', nombre: 'Recibir', columna: 'izq', raiz: 'Hod', inv: false,
    pregunta: '¿Con qué frecuencia pides ayuda antes de estar al límite?',
    descriptor: 'Si puedes recibir sin haber explotado primero.',
    pos: [82, 382],
  },
  {
    id: 'energia', nombre: 'Energía', columna: 'eje', raiz: 'Yesod', inv: false,
    pregunta: '¿Con qué frecuencia te despiertas con ganas de empezar el día?',
    descriptor: 'El combustible con el que arranca todo lo demás.',
    pos: [170, 456],
  },
  {
    id: 'resultado', nombre: 'Resultados', columna: 'eje', raiz: 'Maljut', inv: false,
    pregunta: '¿Con qué frecuencia lo que decides en tu cabeza termina existiendo en la realidad?',
    descriptor: 'Tu capacidad de materializar.',
    pos: [170, 530],
  },
];

/** Escala única — idéntica a la del CBI. */
export const FRECUENCIA = [
  { label: 'Nunca', valor: 0 },
  { label: 'Rara vez', valor: 25 },
  { label: 'A veces', valor: 50 },
  { label: 'Seguido', valor: 75 },
  { label: 'Siempre', valor: 100 },
];

/** Los 22 senderos del diagrama. Solo dibujo. */
export const SENDEROS: [string, string][] = [
  ['proposito', 'vision'], ['proposito', 'claridad'], ['proposito', 'verdad'],
  ['vision', 'claridad'], ['vision', 'presencia'], ['vision', 'verdad'],
  ['claridad', 'limite'], ['claridad', 'verdad'], ['presencia', 'limite'],
  ['presencia', 'verdad'], ['presencia', 'empuje'], ['limite', 'verdad'],
  ['limite', 'recibir'], ['verdad', 'empuje'], ['verdad', 'recibir'],
  ['verdad', 'energia'], ['empuje', 'recibir'], ['empuje', 'energia'],
  ['empuje', 'resultado'], ['recibir', 'energia'], ['recibir', 'resultado'],
  ['energia', 'resultado'],
];

/** Respuestas crudas del Tablero: id de medida → valor 0..100 tal como lo eligió. */
export type Tablero = Record<string, number>;

/** Puntaje de una medida ya corregido (100 = bien, siempre). */
export function puntaje(m: Medida, t: Tablero): number {
  const v = t[m.id] ?? 0;
  return m.inv ? 100 - v : v;
}

export function promedioColumna(c: Columna, t: Tablero): number {
  const l = MEDIDAS.filter((m) => m.columna === c);
  return Math.round(l.reduce((a, m) => a + puntaje(m, t), 0) / l.length);
}

export function promedioTablero(t: Tablero): number {
  return Math.round(MEDIDAS.reduce((a, m) => a + puntaje(m, t), 0) / MEDIDAS.length);
}

/**
 * ÍNDICE DEL JUGADOR (0-100).
 * Promedio de las diez, penalizado por el desbalance entre columnas.
 * Estar alto en todo pero torcido no es estar bien: es el motor sin freno.
 */
export function indiceJugador(t: Tablero): number {
  const desbalance = Math.abs(promedioColumna('der', t) - promedioColumna('izq', t));
  return Math.max(0, Math.round(promedioTablero(t) - desbalance / 4));
}

/** Las tres medidas más caídas. Definen el énfasis de las 12 semanas. */
export function focos(t: Tablero): Medida[] {
  return [...MEDIDAS].sort((a, b) => puntaje(a, t) - puntaje(b, t)).slice(0, 3);
}

export type Inclinacion = 'expansion' | 'contencion' | 'pareja';

export interface Lectura { inclinacion: Inclinacion; titulo: string; texto: string }

/** La lectura del tablero. Es lo primero que el paciente entiende de sí mismo. */
export function lectura(t: Tablero): Lectura {
  const izq = promedioColumna('izq', t);
  const der = promedioColumna('der', t);
  if (der - izq >= 15) {
    return {
      inclinacion: 'expansion',
      titulo: 'Tu tablero está cargado a la expansión.',
      texto: 'Das, empujas y ves lejos mucho más de lo que limitas, ordenas y recibes. Ese desbalance es el mecanismo del agotamiento: el motor gira y el freno no responde. El primer viaje trabaja entero la columna de contención.',
    };
  }
  if (izq - der >= 15) {
    return {
      inclinacion: 'contencion',
      titulo: 'Tu tablero está cargado a la contención.',
      texto: 'Controlas, ordenas y te cuidas más de lo que te expandes. El costo no aparece como cansancio: aparece como una vida más chica que tu capacidad. El trabajo va a soltar y a dar.',
    };
  }
  return {
    inclinacion: 'pareja',
    titulo: 'Tus dos columnas están parejas.',
    texto: 'No hay un desbalance lateral que explique el desgaste. El trabajo va al eje: propósito, verdad, energía y resultados. Ahí está lo que se cayó.',
  };
}

/** Color semántico de un puntaje. Rojo, ámbar, verde. */
export function colorPuntaje(v: number): string {
  if (v < 40) return 'var(--rojo)';
  if (v < 70) return 'var(--ambar)';
  return 'var(--verde)';
}

/** Descriptor humano de una medida. */
export function estadoMedida(v: number): string {
  if (v <= 20) return 'Apagada';
  if (v <= 40) return 'Sobrevive';
  if (v <= 60) return 'Responde';
  if (v <= 80) return 'Viva';
  return 'Plena';
}
