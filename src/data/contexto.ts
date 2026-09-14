/** Acto 1 del Chequeo: conocer a la persona antes de medirla. */
import { MOTIVOS, DESDE } from './onboarding';

export interface PreguntaContexto {
  id: 'lidera' | 'personas' | 'edad' | 'motivo' | 'desde';
  titulo: string;
  sub?: string;
  opciones: string[];
}

export const CONTEXTO: PreguntaContexto[] = [
  { id: 'lidera', titulo: '¿Qué lideras hoy?', sub: 'Esto define cómo se adapta tu camino.',
    opciones: ['Mi propia empresa', 'Un equipo en una empresa', 'Una ONG o institución', 'Un proyecto político', 'Otra cosa'] },
  { id: 'personas', titulo: '¿Cuántas personas dependen de las decisiones que tomas?', sub: 'Contando equipo, socios y familia.',
    opciones: ['1 a 5', '6 a 15', '16 a 50', 'Más de 50'] },
  { id: 'edad', titulo: 'Tu rango de edad', opciones: ['25–34', '35–44', '45–54', '55 o más'] },
  { id: 'motivo', titulo: '¿Qué es lo que más pesa hoy?', sub: 'Una sola. La que reconocerías si nadie te estuviera mirando.',
    opciones: MOTIVOS },
  { id: 'desde', titulo: '¿Desde cuándo?', opciones: DESDE },
];
