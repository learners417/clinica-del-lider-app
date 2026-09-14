/**
 * APAGA LA CABEZA — el protocolo de 5 noches ($33).
 * Noche 1 = el Chequeo. Noches 2-5 = una consigna nocturna por noche.
 * Es, sin decirlo, los días -3 a 0 del Tratamiento.
 */
export interface Noche {
  n: number;
  titulo: string;
  senal: string;
  accion: string;
  esChequeo?: boolean;
}

export const NOCHES: Noche[] = [
  {
    n: 1, titulo: 'Tu número', esChequeo: true,
    senal: 'Antes de apagar la cabeza hay que verla. Esta noche no cambias nada: mides. 7 minutos, instrumentos clínicos validados. Vas a salir con TU número de agotamiento — el que vamos a trabajar en el vivo.',
    accion: 'Haz el Chequeo ahora (7 min). Cuando termines, lee tu resultado una vez, despacio. Y esta noche, el teléfono carga fuera de tu habitación.',
  },
  {
    n: 2, titulo: 'El empleado nocturno',
    senal: 'El teléfono en la mesa de luz es un empleado que entra a tu habitación sin golpear, a cualquier hora, con malas noticias. La luz frena tu melatonina; el contenido enciende tu cabeza. Nadie se duerme bien al lado de su oficina.',
    accion: 'Esta noche (y las que quedan): el teléfono carga FUERA de la habitación. Si usas alarma, un despertador barato mata la excusa. Antes de dormir: 10 respiraciones inhalando en 4, exhalando en 6.',
  },
  {
    n: 3, titulo: 'La hora de cierre',
    senal: 'Tu jornada no termina cuando terminas: termina cuando decides que terminó. Sin hora de cierre, el trabajo se derrama sobre la cena, la pareja y el sueño — y lo llama compromiso. Hoy le pones borde.',
    accion: 'Define tu hora de cierre para esta semana (realista: si hoy cierras a las 22, pon 21). Cúmplela hoy UNA vez. Última hora antes de dormir: sin pantallas. Cuesta más de lo que parece — por eso vale.',
  },
  {
    n: 4, titulo: 'La química de tu insomnio',
    senal: 'La cafeína tiene una vida media de ~6 horas: el café de las 17 sigue en tu sangre a las 23, sentado sobre tu sueño profundo. No hace falta dejarla — hace falta ponerle horario de oficina.',
    accion: 'Define tu hora de última cafeína: 8 horas antes de tu hora de dormir. Escríbela. Y esta noche repite la secuencia completa: teléfono afuera, última hora sin pantallas, respiración 4-6.',
  },
  {
    n: 5, titulo: 'La descarga',
    senal: 'Tu cabeza no para porque la usas de depósito: pendientes, miedos, la reunión de mañana. Un depósito no se apaga — se vacía. Esta noche aprendes la descarga: lo que está en papel ya no da vueltas en ti.',
    accion: 'Antes de acostarte: 5 minutos, papel y bolígrafo. Vuelca TODO lo que da vueltas (pendientes, miedos, ideas). Ciérralo con una línea: "mañana lo mira mi yo descansado". Mañana nos vemos en el vivo — trae tu número.',
  },
];
