/** Acto 1 del Chequeo: conocer a la persona antes de medirla. */
export interface PreguntaContexto { id: 'lidera' | 'personas' | 'edad' | 'motivo'; titulo: string; sub?: string; opciones: string[]; }

export const CONTEXTO: PreguntaContexto[] = [
  { id: 'lidera', titulo: '¿Qué lideras hoy?', sub: 'Esto define cómo se adapta tu protocolo.', opciones: ['Mi propia empresa', 'Un equipo en una empresa', 'Una ONG o institución', 'Un proyecto político', 'Otra cosa'] },
  { id: 'personas', titulo: '¿Cuántas personas dependen de ti?', opciones: ['1 a 5', '6 a 15', '16 a 50', 'Más de 50'] },
  { id: 'edad', titulo: 'Tu rango de edad', opciones: ['25–34', '35–44', '45–54', '55 o más'] },
  { id: 'motivo', titulo: '¿Qué te trajo hasta aquí hoy?', sub: 'Tu respuesta personaliza tu informe.', opciones: ['No duermo bien', 'No me apago nunca', 'Mi familia me está perdiendo', 'Ya no siento nada', 'Todo eso a la vez'] },
];
