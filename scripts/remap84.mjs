/**
 * Remapea el protocolo de 90 a 84 días. Corre sobre el archivo original.
 * - Cabecera y fases V.I.T.A.L. recomprimidas a 84.
 * - Campo variante en la Dosis.
 * - Semana 1 reescrita (días 1 a 7).
 * - Días 8 a 83 intactos (se reescriben semana por semana).
 * - Viejas 84 a 89 descartadas; la vieja 90 pasa a ser el día 84, reescrita.
 * - Hitos con ids semánticos, que no se rompen si cambian los números.
 * - TOTAL_DIAS deja de declararse acá: sale de camino.ts.
 */
import { readFileSync, writeFileSync } from 'node:fs';

const RUTA = new URL('../src/data/protocolo.ts', import.meta.url);
let src = readFileSync(RUTA, 'utf8');

if (!src.includes('export const TOTAL_DIAS = 90;')) {
  throw new Error('Este archivo ya fue remapeado. Restaura el original antes de correrlo.');
}

/* ── 1 · cabecera ── */
src = src.replace(src.slice(0, src.indexOf('export interface Dosis')), `/**
 * EL CAMINO — el protocolo de 84 días, en dos viajes de 42.
 * La estructura de viajes y semanas vive en camino.ts. Acá vive el contenido.
 * Las fases V.I.T.A.L. se mantienen: el método no se toca, se recomprime.
 */

export interface FaseVital {
  id: 'V' | 'I' | 'T' | 'A' | 'L';
  nombre: string;
  dias: [number, number];
  resumen: string;
}

export const FASES_VITAL: FaseVital[] = [
  { id: 'V', nombre: 'Ver', dias: [1, 14], resumen: 'Medición y conciencia. Sueño base. Ver el costo real de cómo estás viviendo.' },
  { id: 'I', nombre: 'Interrumpir', dias: [15, 42], resumen: 'Cortar los drenajes: lo que te apaga, el ruido, los sí que eran no, el Personaje.' },
  { id: 'T', nombre: 'Transformar', dias: [43, 63], resumen: 'Cuerpo, delegación real, orden y presencia. Reconstruir con cimientos.' },
  { id: 'A', nombre: 'Anclar', dias: [64, 77], resumen: 'Innegociables, tribu y plan anti-recaída. Que lo nuevo no dependa de tu voluntad.' },
  { id: 'L', nombre: 'Liderarte', dias: [78, 84], resumen: 'Identidad. La carta. El re-test. El Alta.' },
];

export function faseDeDia(dia: number): FaseVital {
  return FASES_VITAL.find((f) => dia >= f.dias[0] && dia <= f.dias[1]) ?? FASES_VITAL[0];
}

`);

/* ── 2 · el campo variante ── */
src = src.replace(
  '  maestro?: boolean;    // momento VOZ MAESTRO',
  '  maestro?: boolean;    // momento VOZ MAESTRO\n  variante?: string;    // la versión corta, según su ventana real'
);

/* ── 3 · las Dosis ── */
const ANCLA = 'export const DOSIS: Dosis[] = [';
const inicio = src.indexOf(ANCLA);
if (inicio < 0) throw new Error('No encontré el array DOSIS');
const abre = inicio + ANCLA.length;
const cierra = src.indexOf('\n];', abre);
if (cierra < 0) throw new Error('No encontré el cierre del array DOSIS');

const entradas = src.slice(abre, cierra)
  .split(/\n  \},\s*\n/)
  .map((e) => e.trim())
  .filter((e) => e.length > 3)
  .map((e) => '  ' + (e.endsWith('}') ? e : e + '\n  }'));

const porDia = new Map();
for (const e of entradas) {
  const m = e.match(/dia:\s*(\d+)/);
  if (m) porDia.set(Number(m[1]), e);
}
if (porDia.size !== 90) throw new Error('Esperaba 90 Dosis y encontré ' + porDia.size);

const SEMANA_1 = [
`  {
    dia: 1, titulo: 'El punto de partida', maestro: true, duracion: '8 min',
    senal: 'Ya tienes tu número. No te sorprendió lo que dice: te sorprendió verlo escrito. Llevabas tiempo sabiéndolo sin mirarlo. Hoy no cambiamos nada, y eso es a propósito. Los próximos ochenta y cuatro días empiezan por algo que casi ningún líder hace: mirar los propios números con la misma seriedad con la que mira los del negocio.',
    accion: 'Abre tu resultado y léelo completo, despacio, una vez. Después escribe una sola línea: qué número te dolió más ver.',
  }`,
`  {
    dia: 2, titulo: 'La hora de cierre', duracion: '5 min',
    senal: 'Tu jornada no termina cuando terminas: termina cuando decides que terminó. Sin una hora de cierre el trabajo se derrama sobre la cena, sobre tu pareja y sobre tu sueño, y encima lo llamas compromiso. Los que se recuperan no trabajan menos horas al principio. Trabajan horas con borde.',
    accion: 'Define tu hora de cierre para esta semana. Sé realista: si hoy cierras a las diez, pon las nueve y media. Escríbela y dísela a una persona: que alguien más la sepa es lo que la vuelve real.',
    variante: 'Si hay días que no la puedes cumplir, elige cuatro de los siete. Cuatro cumplidos valen más que siete prometidos.',
  }`,
`  {
    dia: 3, titulo: 'El teléfono fuera', duracion: '10 min',
    senal: 'El teléfono en la mesa de luz hace dos cosas: te acompaña hasta el último segundo del día y te agarra en el primero del siguiente. Entre las dos, decide por ti qué piensas al dormirte y qué piensas al despertar. Tu cuarto tiene una sola función. Hoy se la devolvemos.',
    accion: 'Consigue un despertador que no sea tu teléfono; si no tienes uno, cómpralo hoy. Esta noche el teléfono carga en otra habitación.',
    variante: 'Si estás de guardia o tienes hijos chicos, déjalo del otro lado del cuarto, boca abajo y en silencio, con el volumen alto solo para llamadas.',
  }`,
`  {
    dia: 4, titulo: 'El Apagado', duracion: '8 min',
    senal: 'No te desvela lo que pasó: te desvela que tu cuerpo sigue encendido cuando tú ya te acostaste. Estuvo todo el día preparándote para resolver, y a las once de la noche nadie le avisó que se terminó. Esto se apaga desde afuera. La exhalación larga es la palanca más directa que tienes sobre eso, y funciona en minutos.',
    accion: 'Con la luz baja, sentado o acostado: inhala cuatro segundos, exhala ocho. Sin forzar. Diez rondas. Si tienes el audio guiado, úsalo: hace el mismo trabajo y no tienes que contar.',
    variante: 'Si dispones de menos tiempo, cinco rondas antes de apoyar la cabeza. La práctica corta hecha vale; la larga postergada no.',
  }`,
`  {
    dia: 5, titulo: 'La cafeína con horario', duracion: '2 min',
    senal: 'La cafeína no se va cuando dejas de sentirla. La mitad todavía está dando vueltas entre cinco y seis horas después, y una parte sigue ahí mucho más tiempo. Por eso te duermes igual y amaneces sin haber descansado: dormiste, pero más liviano toda la noche. No se trata de dejarla. Se trata de que trabaje para ti y no contra tu noche.',
    accion: 'Cuenta ocho horas hacia atrás desde tu hora de dormir: esa es tu última taza del día. Después de esa hora, agua o infusión sin cafeína.',
    variante: 'Si tomas mucho, baja de a poco esta semana en vez de cortar de golpe. El objetivo es la hora, no la cantidad.',
  }`,
`  {
    dia: 6, titulo: 'La luz', duracion: '10 min',
    senal: 'Tu reloj interno no se ajusta con la hora del despertador: se ajusta con la luz. La de la mañana le avisa a tu cuerpo cuándo empieza el día, y con eso queda fijado, unas quince horas después, cuándo tiene que darte sueño. Esto es lo más barato y lo más ignorado de todo el protocolo.',
    accion: 'En la primera hora despierto, diez minutos afuera, sin lentes de sol y sin el teléfono en la mano. Alcanza con el balcón o la vereda. Y a la noche, una hora antes de dormir, baja las luces de la casa.',
    variante: 'Si está nublado sirve igual: afuera hay muchísima más luz que adentro aunque no lo parezca. Si sales de noche, hazlo junto a la ventana más grande apenas amanezca.',
  }`,
`  {
    dia: 7, titulo: 'Las tres de la mañana', duracion: '2 min',
    senal: 'Despertarse de madrugada no es el problema. El problema es lo que haces en los tres minutos siguientes: miras la hora, calculas cuánto te queda, te acuerdas de algo pendiente y ahí sí ya no vuelves a dormir. Lo que te despierta es fisiología. Lo que te mantiene despierto son tus tres minutos, y esos los podemos entrenar.',
    accion: 'Deja papel y lapicera al lado de la cama: si te despiertas y aparece un pendiente, lo escribes y lo sueltas. Tu cabeza lo sostiene solo porque tiene miedo de perderlo. No mires la hora, no toques el teléfono, exhalación larga hasta que se pase.',
  }`,
];

const DIA_84 = `  {
    dia: 84, titulo: 'LA MEDICIÓN DEL CONTRATO', maestro: true, duracion: '12 min',
    senal: '"Día 84. El mismo instrumento del Día 0, las mismas preguntas, tu verdad de hoy. Respóndelo como siempre: para SABER, no para aprobar. Del otro lado hay dos puertas y las dos son dignas. Si tu Índice subió los veinticinco puntos, es tu alta: la construiste una Dosis por vez, y hoy se abre lo que sellaste el primer día. Si el número dice que falta, el contrato habla: seguimos hasta lograrlo, porque esto era por contrato y no por marketing. Sea cual sea la puerta, el que responde hoy no es el que respondió el Día 0. Eso ya nadie te lo saca." — Javo',
    accion: 'Haz tu medición del día 84 desde el Tratamiento. Mira tu Tablero completo: Día 0, día 42 y hoy, los tres juntos. Después abre lo que escribiste el primer día y no volviste a leer.',
  }`;

const nuevas = [...SEMANA_1];
for (let d = 8; d <= 83; d++) {
  if (!porDia.has(d)) throw new Error('Falta el día ' + d);
  nuevas.push(porDia.get(d));
}
nuevas.push(DIA_84);

src = src.slice(0, abre) + '\n' + nuevas.join(',\n') + ',' + src.slice(cierra);

/* ── 4 · hitos con ids semánticos ── */
src = src.replace(
  "  { id: 'medicion-45', nombre: 'La medición del Día 45', descripcion: 'El re-test oficial de mitad de camino.' },\n  { id: 'medicion-90', nombre: 'La medición del contrato', descripcion: 'El re-test del Día 90 — la promesa, medida.' },",
  "  { id: 'medicion-medio', nombre: 'La medición del día 42', descripcion: 'El re-test al cerrar el primer viaje.' },\n  { id: 'medicion-contrato', nombre: 'La medición del contrato', descripcion: 'El re-test del día 84 — la promesa, medida.' },"
);

/* ── 5 · un solo TOTAL_DIAS ── */
src = src.replace('export const TOTAL_DIAS = 90;', "export { TOTAL_DIAS } from './camino';");

writeFileSync(RUTA, src);
console.log('Listo · Dosis:', nuevas.length);
