/**
 * El Botiquín de Urgencia — GRATIS SIEMPRE.
 * Herramientas breves para el momento crítico. No reemplazan ayuda profesional.
 */
export interface PasoHerramienta { titulo: string; sub: string; dur: number; respirar?: 'ciclo' | 'lento'; }
import { Wind, Moon, Timer, type LucideIcon } from 'lucide-react';
export interface Herramienta { id: string; nombre: string; cuando: string; Icono: LucideIcon; intro: string; pasos: PasoHerramienta[]; cierre: string; }

export const HERRAMIENTAS: Herramienta[] = [
  {
    id: 'pre-reunion',
    nombre: 'Pre-Reunión',
    Icono: Wind,
    cuando: 'Antes de una conversación difícil',
    intro: 'Noventa segundos de respiración con doble inhalación y exhalación larga. Es la forma más rápida documentada de bajar la activación del cuerpo.',
    pasos: [
      { titulo: 'Inhala por la nariz', sub: 'Llena los pulmones… y cuando creas que no entra más, una segunda inhalación corta.', dur: 6, respirar: 'ciclo' },
      { titulo: 'Exhala laaargo por la boca', sub: 'Suelta todo, más lento de lo que entró. Hombros abajo.', dur: 8, respirar: 'ciclo' },
      { titulo: 'Otra vez: doble inhalación', sub: 'Nariz. Llena. Y un sorbo más de aire arriba.', dur: 6, respirar: 'ciclo' },
      { titulo: 'Exhala largo', sub: 'La exhalación larga es la señal de calma para tu sistema.', dur: 8, respirar: 'ciclo' },
      { titulo: 'Tres ciclos más, a tu ritmo', sub: 'Doble inhalación… exhalación larga. Nada más que eso.', dur: 40, respirar: 'ciclo' },
      { titulo: 'Antes de entrar', sub: '¿Qué resultado quieres de esta conversación? Dilo en una frase, en tu cabeza.', dur: 15 },
    ],
    cierre: 'Listo. Entra más lento de lo que sales. Tú diriges la reunión — no tu pulso.',
  },
  {
    id: 'tres-am',
    nombre: 'Protocolo 3AM',
    Icono: Moon,
    cuando: 'Despierto de madrugada, cabeza a mil',
    intro: 'Despertarse a las 3 no es el problema. Pelearle a las 3 sí. Este protocolo corta el bucle.',
    pasos: [
      { titulo: 'No mires la hora', sub: 'Ya sabes que es de noche. El número solo alimenta la ansiedad. Pantalla boca abajo.', dur: 10 },
      { titulo: 'Respira 4-6', sub: 'Inhala en 4… exhala en 6. La exhalación más larga que la inhalación. Diez veces.', dur: 60, respirar: 'lento' },
      { titulo: 'Descarga la cabeza', sub: 'Si hay algo dando vueltas: anótalo en un papel (no en el teléfono). Queda ahí, no en ti. Mañana lo mira tu yo descansado.', dur: 30 },
      { titulo: 'Regla de los 20 minutos', sub: 'Si en un rato sigues despierto: levántate, luz baja, algo aburrido. La cama es para dormir — que tu cuerpo no aprenda otra cosa.', dur: 15 },
    ],
    cierre: 'No tienes que dormirte: tienes que descansar. El sueño llega solo cuando dejas de perseguirlo.',
  },
  {
    id: 'pausa-3',
    nombre: 'Pausa de 3 minutos',
    Icono: Timer,
    cuando: 'Después de un conflicto o antes de explotar',
    intro: 'Tres minutos entre el estímulo y tu respuesta. Ahí vive tu liderazgo.',
    pasos: [
      { titulo: 'Nombra lo que sientes', sub: 'Con una palabra: bronca, miedo, vergüenza, injusticia. Nombrarlo ya le baja el volumen.', dur: 20 },
      { titulo: 'Diez respiraciones', sub: 'Solo cuenta las exhalaciones. Una… dos… Si te pierdes, vuelve a empezar. No es meditación: es un reinicio.', dur: 75, respirar: 'lento' },
      { titulo: 'Una sola pregunta', sub: '¿Qué necesito de verdad en este momento? (No qué quiero contestar. Qué necesito.)', dur: 30 },
      { titulo: 'Decide en frío', sub: 'Responder, esperar o soltar. Las tres son de líder. Reaccionar en caliente no.', dur: 20 },
    ],
    cierre: 'Volviste a ti. Lo que decidas ahora, lo decides tú.',
  },
];

export const BOTIQUIN_AVISO = 'El Botiquín es primera ayuda, no tratamiento. Si sientes que necesitas más que una pausa, habla con un profesional de la salud. Y si estás en peligro, contacta ahora al servicio de emergencias de tu país.';
