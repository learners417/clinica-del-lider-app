/**
 * CBI — Copenhagen Burnout Inventory (dominio público).
 * 19 ítems · 3 subescalas: personal (6), trabajo (7), equipo (6, adaptada de
 * "client-related" a personas a cargo, contexto de liderazgo).
 * Escala de frecuencia: Nunca 0 · Rara vez 25 · A veces 50 · Muy a menudo 75 · Siempre 100.
 * Score de subescala = promedio. Zona roja de subescala: >= 50.
 */
export type CbiSubescala = 'personal' | 'trabajo' | 'equipo';

export interface CbiItem {
  id: string;
  sub: CbiSubescala;
  texto: string;
  invertido?: boolean; // más frecuencia = mejor (se invierte el puntaje)
}

export const CBI_OPCIONES = [
  { label: 'Nunca / casi nunca', valor: 0 },
  { label: 'Rara vez', valor: 25 },
  { label: 'A veces', valor: 50 },
  { label: 'Muy a menudo', valor: 75 },
  { label: 'Siempre', valor: 100 },
];

export const CBI_ITEMS: CbiItem[] = [
  // Personal
  { id: 'p1', sub: 'personal', texto: '¿Con qué frecuencia te sientes cansado?' },
  { id: 'p2', sub: 'personal', texto: '¿Con qué frecuencia te sientes físicamente agotado?' },
  { id: 'p3', sub: 'personal', texto: '¿Con qué frecuencia te sientes emocionalmente agotado?' },
  { id: 'p4', sub: 'personal', texto: '¿Con qué frecuencia piensas: "no doy más"?' },
  { id: 'p5', sub: 'personal', texto: '¿Con qué frecuencia te sientes exhausto, sin nada más para dar?' },
  { id: 'p6', sub: 'personal', texto: '¿Con qué frecuencia te sientes débil o a punto de enfermarte?' },
  // Trabajo
  { id: 't1', sub: 'trabajo', texto: '¿Terminas el día de trabajo sintiéndote vacío?' },
  { id: 't2', sub: 'trabajo', texto: '¿Te levantas ya cansado ante la idea de otro día de trabajo?' },
  { id: 't3', sub: 'trabajo', texto: '¿Sientes que cada hora de trabajo te desgasta?' },
  { id: 't4', sub: 'trabajo', texto: '¿Te queda energía para tu familia y amigos en tu tiempo libre?', invertido: true },
  { id: 't5', sub: 'trabajo', texto: '¿Tu trabajo te resulta emocionalmente agotador?' },
  { id: 't6', sub: 'trabajo', texto: '¿Tu trabajo te frustra?' },
  { id: 't7', sub: 'trabajo', texto: '¿Te sientes quemado por tu trabajo?' },
  // Equipo (personas a cargo)
  { id: 'e1', sub: 'equipo', texto: '¿Te resulta difícil trabajar con las personas que lideras?' },
  { id: 'e2', sub: 'equipo', texto: '¿Trabajar con tu equipo te drena la energía?' },
  { id: 'e3', sub: 'equipo', texto: '¿Te resulta frustrante liderar a tu gente?' },
  { id: 'e4', sub: 'equipo', texto: '¿Sientes que das más de lo que recibes cuando trabajas con tu equipo?' },
  { id: 'e5', sub: 'equipo', texto: '¿Estás cansado de trabajar con personas a cargo?' },
  { id: 'e6', sub: 'equipo', texto: '¿Te preguntas cuánto tiempo más vas a poder sostener este rol?' },
];

export interface CbiResultado {
  personal: number;
  trabajo: number;
  equipo: number;
  promedio: number;
}

export function calcularCbi(respuestas: Record<string, number>): CbiResultado {
  const suma: Record<CbiSubescala, { total: number; n: number }> = {
    personal: { total: 0, n: 0 }, trabajo: { total: 0, n: 0 }, equipo: { total: 0, n: 0 },
  };
  for (const item of CBI_ITEMS) {
    const crudo = respuestas[item.id];
    if (crudo === undefined) continue;
    const valor = item.invertido ? 100 - crudo : crudo;
    suma[item.sub].total += valor;
    suma[item.sub].n += 1;
  }
  const prom = (s: CbiSubescala) => (suma[s].n ? Math.round(suma[s].total / suma[s].n) : 0);
  const personal = prom('personal'); const trabajo = prom('trabajo'); const equipo = prom('equipo');
  return { personal, trabajo, equipo, promedio: Math.round((personal + trabajo + equipo) / 3) };
}

export const CBI_SUBESCALA_LABEL: Record<CbiSubescala, string> = {
  personal: 'Agotamiento personal',
  trabajo: 'Agotamiento por el trabajo',
  equipo: 'Agotamiento por liderar personas',
};
