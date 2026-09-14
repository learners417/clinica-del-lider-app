/**
 * PHQ-9 — cuestionario estandarizado de tamizaje (dominio público).
 * La Clínica del Líder NO diagnostica: usa el PHQ-9 solo como triaje
 * para derivar con cuidado a un profesional cuando corresponde.
 * Derivación: total >= 15, o cualquier respuesta > 0 en el ítem 9.
 */
export const PHQ9_INTRO = 'Durante las últimas 2 semanas, ¿con qué frecuencia te han molestado los siguientes problemas?';

export const PHQ9_OPCIONES = [
  { label: 'Ningún día', valor: 0 },
  { label: 'Varios días', valor: 1 },
  { label: 'Más de la mitad de los días', valor: 2 },
  { label: 'Casi todos los días', valor: 3 },
];

export const PHQ9_ITEMS: { id: string; texto: string; sensible?: boolean }[] = [
  { id: 'q1', texto: 'Poco interés o placer en hacer cosas.' },
  { id: 'q2', texto: 'Sentirte decaído, deprimido o sin esperanza.' },
  { id: 'q3', texto: 'Problemas para dormir, mantener el sueño, o dormir demasiado.' },
  { id: 'q4', texto: 'Sentirte cansado o con poca energía.' },
  { id: 'q5', texto: 'Poco apetito, o comer en exceso.' },
  { id: 'q6', texto: 'Sentirte mal contigo mismo — o sentir que eres un fracaso o que le fallaste a tu familia.' },
  { id: 'q7', texto: 'Problemas para concentrarte en cosas como leer o mirar una serie.' },
  { id: 'q8', texto: 'Moverte o hablar tan lento que otras personas lo notaron — o lo contrario: estar tan inquieto que te movías mucho más de lo habitual.' },
  { id: 'q9', texto: 'Pensamientos de que estarías mejor muerto o de hacerte daño de alguna forma.', sensible: true },
];

export interface Phq9Resultado {
  total: number;
  derivar: boolean;
  motivoItem9: boolean;
}

export function calcularPhq9(respuestas: Record<string, number>): Phq9Resultado {
  let total = 0;
  for (const item of PHQ9_ITEMS) total += respuestas[item.id] ?? 0;
  const motivoItem9 = (respuestas['q9'] ?? 0) > 0;
  return { total, derivar: total >= 15 || motivoItem9, motivoItem9 };
}
