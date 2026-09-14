/**
 * EL CHEQUEO · DÍA 0 — el onboarding completo, declarado como datos.
 *
 * Regla que ordena todo esto: cada dato que se pide tiene que cambiar algo
 * concreto en el programa. Si no cambia nada, no se pregunta. El campo
 * `personaliza` deja escrito qué cambia cada uno — y es lo que se audita.
 *
 * Cinco bloques, unos quince minutos, una sola vez.
 */

import { MEDIDAS, FRECUENCIA } from './arbol';
import { ENEAGRAMA_TIPOS } from './eneagrama';

export type TipoPaso =
  | 'transicion' | 'texto' | 'numero' | 'opciones' | 'multiple'
  | 'escala10' | 'horas' | 'abierta' | 'firma';

export interface Paso {
  id: string;
  tipo: TipoPaso;
  bloque: string;
  pregunta: string;
  ayuda?: string;
  placeholder?: string;
  opciones?: string[];
  /** Valor numérico por opción, cuando el puntaje no es el índice. */
  valores?: number[];
  /** Máximo de opciones en los pasos múltiples. */
  max?: number;
  /** Mínimo de caracteres en las abiertas. */
  min?: number;
  /** Qué cambia esta respuesta en el programa. Cara interna, nunca se muestra. */
  personaliza?: string;
}

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

const tableroPasos: Paso[] = MEDIDAS.map((m) => ({
  id: m.id,
  tipo: 'opciones' as TipoPaso,
  bloque: m.nombre,
  pregunta: m.pregunta,
  opciones: FRECUENCIA.map((f) => f.label),
  valores: FRECUENCIA.map((f) => f.valor),
  personaliza: `Medida ${m.nombre} del Tablero · raíz ${m.raiz}`,
}));

export const PASOS: Paso[] = [
  // ── 1 · Quién eres ──
  { id: 't1', tipo: 'transicion', bloque: 'Uno de cinco', pregunta: 'Quién eres',
    ayuda: 'Cuatro datos. La app los usa todos los días.' },
  { id: 'nombre', tipo: 'texto', bloque: 'Quién eres', pregunta: '¿Cómo quieres que te llame?',
    placeholder: 'Tu nombre', personaliza: 'Cómo te habla la app y el Clínico' },
  { id: 'edad', tipo: 'numero', bloque: 'Quién eres', pregunta: '¿Cuántos años tienes?',
    placeholder: 'Edad', personaliza: 'Lectura del sueño y de la carga' },
  { id: 'lidera', tipo: 'texto', bloque: 'Quién eres', pregunta: '¿Qué lideras?',
    ayuda: 'En una línea, como se lo dirías a alguien en un ascensor.',
    placeholder: 'Mi empresa de…', personaliza: 'Contexto del Clínico' },
  { id: 'personas', tipo: 'opciones', bloque: 'Quién eres',
    pregunta: '¿Cuántas personas dependen de las decisiones que tomas?',
    ayuda: 'Contando equipo, socios y familia.',
    opciones: ['1 a 3', '4 a 10', '11 a 30', 'Más de 30'],
    personaliza: 'Reencuadre del Día 1 y filtro de nivel' },

  // ── Motivo de consulta ──
  { id: 'motivo', tipo: 'opciones', bloque: 'Qué te trae', pregunta: '¿Qué es lo que más pesa hoy?',
    ayuda: 'Una sola. La que reconocerías si nadie te estuviera mirando.',
    opciones: MOTIVOS, personaliza: 'Puerta de entrada: por dónde abre la semana 1' },
  { id: 'desde', tipo: 'opciones', bloque: 'Qué te trae', pregunta: '¿Desde cuándo?',
    opciones: DESDE, personaliza: 'Ritmo de las primeras dos semanas' },
  { id: 'porquehoy', tipo: 'abierta', bloque: 'Qué te trae', pregunta: '¿Y por qué hoy?',
    ayuda: 'Algo pasó. Pudiste entrar el año pasado y entraste ahora.',
    min: 40, personaliza: 'Se le devuelve el día que quiera abandonar' },

  // ── 2 · El Tablero ──
  { id: 't2', tipo: 'transicion', bloque: 'Dos de cinco', pregunta: 'El Tablero',
    ayuda: 'Diez medidas. No hay respuestas buenas: la única que sirve es la que es verdad hoy.' },
  ...tableroPasos,

  // ── 3 · El cuerpo ──
  { id: 't3', tipo: 'transicion', bloque: 'Tres de cinco', pregunta: 'Tu cuerpo hoy',
    ayuda: 'Esta es la línea de la que vamos a partir. En doce semanas se vuelve a medir.' },
  { id: 'sueno', tipo: 'horas', bloque: 'Tu cuerpo',
    pregunta: 'Anoche: ¿a qué hora te acostaste y a qué hora te levantaste?',
    personaliza: 'Línea base del sueño y umbral del Apagado' },
  { id: 'despertares', tipo: 'opciones', bloque: 'Tu cuerpo',
    pregunta: '¿Cuántas veces te despertaste durante la noche?',
    opciones: ['Ninguna', 'Una', 'Dos', 'Tres o más'],
    personaliza: 'Activa el protocolo de madrugada en el Día 7' },
  { id: 'energia0', tipo: 'escala10', bloque: 'Tu cuerpo',
    pregunta: 'Al abrir los ojos esta mañana, ¿con cuánta energía arrancaste?',
    ayuda: 'Uno es a rastras. Diez es entero.',
    personaliza: 'Línea base del marcador diario de energía' },
  { id: 'apagar', tipo: 'multiple', bloque: 'Tu cuerpo', pregunta: '¿Con qué te apagas de noche?',
    ayuda: 'Marca todo lo que sea cierto.', opciones: APAGADORES,
    personaliza: 'El primer drenaje que se corta · avisa al clínico si hay sustancias' },
  { id: 'ventanaAM', tipo: 'opciones', bloque: 'Tu cuerpo',
    pregunta: 'Por la mañana, ¿cuántos minutos tienes antes de que alguien te pida algo?',
    ayuda: 'Sé exacto. El programa se va a construir dentro de ese tiempo.',
    opciones: VENTANA, valores: VENTANA_MIN,
    personaliza: 'Duración de la práctica de la mañana' },
  { id: 'ventanaPM', tipo: 'opciones', bloque: 'Tu cuerpo',
    pregunta: 'Por la noche, ¿cuántos minutos tienes para ti antes de dormir?',
    opciones: VENTANA, valores: VENTANA_MIN,
    personaliza: 'Duración del Apagado' },

  // ── 4 · El espejo ──
  { id: 't4', tipo: 'transicion', bloque: 'Cuatro de cinco', pregunta: 'El espejo',
    ayuda: 'Esto no se puntúa. Sirve para que te hable como eres y no como un manual.' },
  { id: 'espejo', tipo: 'multiple', bloque: 'El espejo',
    pregunta: 'Elige las tres frases que más se parecen a ti.', max: 3,
    opciones: ENEAGRAMA_TIPOS.map((e) => e.afirmacion),
    personaliza: 'Tono del Clínico y lectura del Personaje en la semana 6' },

  // ── 5 · En tus palabras ──
  { id: 't5', tipo: 'transicion', bloque: 'Cinco de cinco', pregunta: 'En tus palabras',
    ayuda: 'Cuatro respuestas. Se guardan y se te devuelven más adelante, tal como las escribiste.' },
  { id: 'costo', tipo: 'abierta', bloque: 'En tus palabras',
    pregunta: 'Si todo sigue exactamente igual, ¿dónde estás dentro de un año?',
    ayuda: 'Escribe lo que ves, no lo que temes que pase.',
    min: 60, personaliza: 'Se le devuelve en el día 42' },
  { id: 'oculto', tipo: 'abierta', bloque: 'En tus palabras',
    pregunta: '¿Qué es lo que no le dices a nadie?',
    ayuda: 'Esto queda sellado. Se abre el día 84 y lo abres tú.',
    min: 40, personaliza: 'Sellado hasta el día 84 · hilo del Personaje' },
  { id: 'quien', tipo: 'abierta', bloque: 'En tus palabras',
    pregunta: '¿Quién te necesita entero?',
    ayuda: 'Con nombre. Y qué cambia para esa persona si lo logras.',
    min: 40, personaliza: 'Ancla en los días de recaída' },
  { id: 'escena', tipo: 'abierta', bloque: 'En tus palabras',
    pregunta: 'Un martes a las siete de la tarde, dentro de doce semanas: ¿dónde estás y qué estás haciendo?',
    ayuda: 'Una escena concreta. Qué se ve, qué se escucha, quién está.',
    min: 60, personaliza: 'Criterio del Alta' },

  // ── El contrato ──
  { id: 'firma', tipo: 'firma', bloque: 'El contrato', pregunta: 'Firma tu punto de partida.' },
];

/** Respuestas del Chequeo. Índices para opciones, texto para el resto. */
export type Respuestas = Record<string, number | number[] | string>;

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

/** Minutos reales de su ventana, para dosificar la práctica. */
export function minutosVentana(indice: number): number {
  return VENTANA_MIN[indice] ?? 0;
}
