/**
 * EL ÉNFASIS — el mismo camino para todos, con acento en las tres medidas
 * más caídas del Tablero.
 *
 * Los días de cada medida NO se escriben a mano: salen de las semanas
 * declaradas en camino.ts. Si una semana cambia de lugar, esto se acomoda solo.
 */
import { MEDIDAS, focos as focosDelTablero, puntaje, colorPuntaje, type Tablero } from '../data/arbol';
import { SEMANAS } from '../data/camino';

/** Días donde cada medida es lo central, derivados de las semanas. */
export const DIAS_POR_MEDIDA: Record<string, number[]> = (() => {
  const mapa: Record<string, number[]> = {};
  for (const m of MEDIDAS) mapa[m.id] = [];
  for (const s of SEMANAS) {
    const dias = [];
    for (let d = s.dias[0]; d <= s.dias[1]; d++) dias.push(d);
    if (mapa[s.medida]) mapa[s.medida].push(...dias);
  }
  // Resultados no tiene semana propia: vive donde lo que se decide se ejecuta.
  mapa.resultado.push(...(mapa.vision ?? []), ...(mapa.empuje ?? []));
  return mapa;
})();

/** Una línea por medida, para cuando la Dosis del día toca uno de sus focos. */
export const REFUERZO_POR_MEDIDA: Record<string, string> = {
  proposito: 'Tu Chequeo marcó Propósito entre tus tres medidas más caídas. Esta Dosis es de las tuyas: es donde se decide para qué haces todo lo demás.',
  vision: 'Visión quedó entre tus medidas más caídas. Esta Dosis te devuelve lugar para que se te ocurra algo: para ti no es un lujo, es tratamiento.',
  claridad: 'Claridad apareció entre tus tres más caídas. Esta Dosis le saca peso a tu cabeza, y cada cosa que sacas es una que deja de despertarte.',
  presencia: 'Presencia está entre tus medidas más caídas. Esta Dosis toca justo ahí, y es de las que más rápido cambian una casa.',
  limite: 'Límite quedó entre tus tres más caídas. Esta Dosis es incómoda para ti y por eso te sirve más que a nadie: hazla igual.',
  verdad: 'Verdad apareció entre tus medidas más caídas. Esta Dosis va al centro del tablero: lo que dices, lo que haces y lo que sientes.',
  empuje: 'Empuje quedó entre tus tres más caídas. Esta Dosis trabaja en que lo que empiezas siga vivo dentro de un mes.',
  recibir: 'Recibir está entre tus medidas más caídas. Esta Dosis te va a pedir algo que casi nunca haces: pedir antes de estar al límite.',
  energia: 'Energía apareció entre tus tres más caídas. Esta Dosis es de las importantes para ti: sostiene todo lo que viene después.',
  resultado: 'Resultados quedó entre tus medidas más caídas. Esta Dosis trabaja en que lo que decides termine existiendo de verdad.',
};

export interface Foco { id: string; nombre: string; valor: number; color: string }

/** Las tres medidas más caídas del Tablero. */
export function calcularFocos(tablero: Tablero): Foco[] {
  return focosDelTablero(tablero).map((m) => {
    const v = puntaje(m, tablero);
    return { id: m.id, nombre: m.nombre, valor: v, color: colorPuntaje(v) };
  });
}

/** El refuerzo que corresponde a la Dosis de hoy, si toca uno de sus focos. */
export function refuerzoDelDia(dia: number, focos: Foco[]): { foco: Foco; texto: string } | null {
  for (const foco of focos) {
    if (DIAS_POR_MEDIDA[foco.id]?.includes(dia)) {
      return { foco, texto: REFUERZO_POR_MEDIDA[foco.id] };
    }
  }
  return null;
}
