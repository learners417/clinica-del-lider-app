/**
 * EL CAMINO — 84 días, dos viajes de 42.
 *
 * Fuente ÚNICA de los números del protocolo. Ningún componente vuelve a
 * escribir 84 ni 42 a mano: todo sale de acá.
 *
 * Mitzráim, el nombre de Egipto, quiere decir lugar estrecho. Se sale en 42
 * etapas y recién después se entra a otra cosa. Ese es el marco, y define el
 * orden: el viaje 1 instala el freno (columna de contención) y el viaje 2
 * suelta el motor (columna de expansión). Al revés no funciona.
 *
 * El paciente no lee una sola palabra de esto. Lo vive como dos viajes.
 */

export const TOTAL_DIAS = 84;
export const DIAS_POR_SEMANA = 7;
export const TOTAL_SEMANAS = 12;

/** Los días en que se vuelve a medir el Tablero completo. */
export const HITO_MEDIO = 42;
export const HITO_CONTRATO = 84;
export const HITOS: number[] = [HITO_MEDIO, HITO_CONTRATO];

/** Puntos que sube el Índice del Jugador según el contrato. */
export const SUBIDA_CONTRATO = 25;

export type ViajeId = 1 | 2;

export interface Viaje {
  id: ViajeId;
  nombre: string;
  dias: [number, number];
  promesa: string;
}

export const VIAJES: Viaje[] = [
  {
    id: 1, nombre: 'Salir', dias: [1, 42],
    promesa: 'Se saca. Nada de lo que sueltes en estas seis semanas es tuyo: lo heredaste, lo aceptaste o te lo pusieron encima.',
  },
  {
    id: 2, nombre: 'Entrar', dias: [43, 84],
    promesa: 'Se construye. Ahora hay lugar, y lo que instalas se queda.',
  },
];

export interface Semana {
  n: number;
  viaje: ViajeId;
  nombre: string;
  dias: [number, number];
  /** Lo que se trabaja, en una línea. Esto sí lo lee el paciente. */
  resumen: string;
  /** Raíz en el Árbol + medida del Tablero que mueve. Cara interna. */
  raiz: string;
  medida: string;
  /** Fase V.I.T.A.L. heredada — el método no se toca. */
  vital: 'V' | 'I' | 'T' | 'A' | 'L';
}

export const SEMANAS: Semana[] = [
  { n: 1, viaje: 1, nombre: 'La noche', dias: [1, 7], vital: 'V', raiz: 'Yesod', medida: 'energia',
    resumen: 'El sueño antes que todo. Sin dormir, nada de lo que hagamos va a rendir.' },
  { n: 2, viaje: 1, nombre: 'El costo', dias: [8, 14], vital: 'V', raiz: 'Biná', medida: 'claridad',
    resumen: 'Mirar tus propios números con la misma seriedad con la que miras los del negocio.' },
  { n: 3, viaje: 1, nombre: 'Lo que te apaga', dias: [15, 21], vital: 'I', raiz: 'Guevurá', medida: 'limite',
    resumen: 'Con qué te apagas de noche y qué te cuesta a la mañana siguiente. Se corta uno.' },
  { n: 4, viaje: 1, nombre: 'El ruido', dias: [22, 28], vital: 'I', raiz: 'Biná', medida: 'claridad',
    resumen: 'Pantalla, notificaciones, input sin fin. Tu cabeza vuelve a tener silencio para pensar.' },
  { n: 5, viaje: 1, nombre: 'Los sí que eran no', dias: [29, 35], vital: 'I', raiz: 'Guevurá', medida: 'limite',
    resumen: 'De dónde sale tu agenda. Y por primera vez dices que no y lo sostienes.' },
  { n: 6, viaje: 1, nombre: 'El Personaje', dias: [36, 42], vital: 'I', raiz: 'Tiféret', medida: 'verdad',
    resumen: 'Quién eres cuando te están mirando y cuánto te cuesta sostenerlo.' },
  { n: 7, viaje: 2, nombre: 'El cuerpo', dias: [43, 49], vital: 'T', raiz: 'Yesod', medida: 'energia',
    resumen: 'Movimiento, luz y comida. Lo que sostiene todo lo demás.' },
  { n: 8, viaje: 2, nombre: 'El trabajo', dias: [50, 56], vital: 'T', raiz: 'Jojmá', medida: 'vision',
    resumen: 'Delegar de verdad, ordenar y decidir en el día. Tu empresa deja de depender de tu resistencia.' },
  { n: 9, viaje: 2, nombre: 'Los tuyos', dias: [57, 63], vital: 'T', raiz: 'Jésed', medida: 'presencia',
    resumen: 'Presencia real con las personas que amas.' },
  { n: 10, viaje: 2, nombre: 'Los innegociables', dias: [64, 70], vital: 'A', raiz: 'Nétzaj', medida: 'empuje',
    resumen: 'Tres cosas que no se tocan más, firmadas y dichas en voz alta a quien corresponde.' },
  { n: 11, viaje: 2, nombre: 'Recibir', dias: [71, 77], vital: 'A', raiz: 'Hod', medida: 'recibir',
    resumen: 'Pedir ayuda antes del límite, y el plan escrito para el día que el caos vuelva.' },
  { n: 12, viaje: 2, nombre: 'Liderarte', dias: [78, 84], vital: 'L', raiz: 'Kéter', medida: 'proposito',
    resumen: 'Para qué. La carta al Personaje, tu escena del martes y el Alta.' },
];

export function semanaDeDia(dia: number): Semana {
  return SEMANAS.find((s) => dia >= s.dias[0] && dia <= s.dias[1]) ?? SEMANAS[0];
}

export function viajeDeDia(dia: number): Viaje {
  return dia <= VIAJES[0].dias[1] ? VIAJES[0] : VIAJES[1];
}

/** Día dentro de su semana, 1..7. Sirve para la vista de la semana. */
export function diaDeSemana(dia: number): number {
  return ((dia - 1) % DIAS_POR_SEMANA) + 1;
}

/** ¿Hoy toca volver a medir el Tablero? */
export function esHitoDeMedicion(dia: number): boolean {
  return HITOS.includes(dia);
}

/** Próximo hito de medición, o null si ya pasaron todos. */
export function proximoHito(dia: number): number | null {
  return HITOS.find((h) => h >= dia) ?? null;
}
