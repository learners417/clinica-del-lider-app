/** Los Sistemas Instalados — el checklist de progreso que un dueño entiende. */
export interface Sistema { id: string; nombre: string; dia: number; descripcion: string; }

export const SISTEMAS: Sistema[] = [
  { id: 'cierre', nombre: 'La hora de cierre', dia: 2, descripcion: 'Tu jornada tiene borde.' },
  { id: 'telefono', nombre: 'El teléfono fuera de la habitación', dia: 4, descripcion: 'Tu cuarto volvió a ser para dormir.' },
  { id: 'cafeina', nombre: 'La cafeína con horario', dia: 8, descripcion: 'El café trabaja para ti, no contra tu noche.' },
  { id: 'pantallas', nombre: 'La última hora sin pantallas', dia: 11, descripcion: 'Tu cabeza aterriza antes de la cama.' },
  { id: 'caminata', nombre: 'La caminata sin input', dia: 6, descripcion: '20 minutos sin consumir nada. Tu laboratorio.' },
  { id: 'movimiento', nombre: 'El movimiento 3x por semana', dia: 31, descripcion: 'Tu cuerpo volvió al equipo.' },
  { id: 'captura', nombre: 'La captura externa', dia: 46, descripcion: 'Tu cabeza decide; el papel almacena.' },
  { id: 'cena', nombre: 'La cena sin teléfonos', dia: 27, descripcion: 'Tu mesa volvió a ser de tu familia.' },
  { id: 'innegociables', nombre: 'Los 3 innegociables', dia: 61, descripcion: 'Firmados y dichos en voz alta.' },
  { id: 'antirecaida', nombre: 'El plan anti-recaída', dia: 69, descripcion: 'Sabes qué hacer cuando vuelva el caos.' },
];

export type EstadoSistema = 'pendiente' | 'instalado' | 'sostenido' | 'tuyo';

/** Estado de un sistema según las dosis hechas y el día actual del Tratamiento. */
export function estadoSistema(s: Sistema, dosisHechas: number[], diaActual: number): EstadoSistema {
  if (!dosisHechas.includes(s.dia)) return 'pendiente';
  const diasSostenido = diaActual - s.dia;
  if (diasSostenido >= 30) return 'tuyo';
  if (diasSostenido >= 14) return 'sostenido';
  return 'instalado';
}

export const ESTADO_SISTEMA_LABEL: Record<EstadoSistema, string> = {
  pendiente: 'Se instala más adelante',
  instalado: 'Instalado',
  sostenido: 'Sostenido 14 días',
  tuyo: 'Tuyo',
};
