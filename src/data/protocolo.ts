/**
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

export interface Dosis {
  dia: number;
  titulo: string;
  senal: string;        // la idea del día (1-2 min de lectura)
  accion: string;       // la práctica concreta, una sola
  duracion: string;     // estimación honesta
  maestro?: boolean;    // momento VOZ MAESTRO
  variante?: string;    // la versión corta, según su ventana real
}

export const DOSIS: Dosis[] = [
  {
    dia: 1, titulo: 'El punto de partida', maestro: true, duracion: '8 min',
    senal: 'Ya tienes tu número. No te sorprendió lo que dice: te sorprendió verlo escrito. Llevabas tiempo sabiéndolo sin mirarlo. Hoy no cambiamos nada, y eso es a propósito. Los próximos ochenta y cuatro días empiezan por algo que casi ningún líder hace: mirar los propios números con la misma seriedad con la que mira los del negocio.',
    accion: 'Abre tu resultado y léelo completo, despacio, una vez. Después escribe una sola línea: qué número te dolió más ver.',
  },
  {
    dia: 2, titulo: 'La hora de cierre', duracion: '5 min',
    senal: 'Tu jornada no termina cuando terminas: termina cuando decides que terminó. Sin una hora de cierre el trabajo se derrama sobre la cena, sobre tu pareja y sobre tu sueño, y encima lo llamas compromiso. Los que se recuperan no trabajan menos horas al principio. Trabajan horas con borde.',
    accion: 'Define tu hora de cierre para esta semana. Sé realista: si hoy cierras a las diez, pon las nueve y media. Escríbela y dísela a una persona: que alguien más la sepa es lo que la vuelve real.',
    variante: 'Si hay días que no la puedes cumplir, elige cuatro de los siete. Cuatro cumplidos valen más que siete prometidos.',
  },
  {
    dia: 3, titulo: 'El teléfono fuera', duracion: '10 min',
    senal: 'El teléfono en la mesa de luz hace dos cosas: te acompaña hasta el último segundo del día y te agarra en el primero del siguiente. Entre las dos, decide por ti qué piensas al dormirte y qué piensas al despertar. Tu cuarto tiene una sola función. Hoy se la devolvemos.',
    accion: 'Consigue un despertador que no sea tu teléfono; si no tienes uno, cómpralo hoy. Esta noche el teléfono carga en otra habitación.',
    variante: 'Si estás de guardia o tienes hijos chicos, déjalo del otro lado del cuarto, boca abajo y en silencio, con el volumen alto solo para llamadas.',
  },
  {
    dia: 4, titulo: 'El Apagado', duracion: '8 min',
    senal: 'No te desvela lo que pasó: te desvela que tu cuerpo sigue encendido cuando tú ya te acostaste. Estuvo todo el día preparándote para resolver, y a las once de la noche nadie le avisó que se terminó. Esto se apaga desde afuera. La exhalación larga es la palanca más directa que tienes sobre eso, y funciona en minutos.',
    accion: 'Con la luz baja, sentado o acostado: inhala cuatro segundos, exhala ocho. Sin forzar. Diez rondas. Si tienes el audio guiado, úsalo: hace el mismo trabajo y no tienes que contar.',
    variante: 'Si dispones de menos tiempo, cinco rondas antes de apoyar la cabeza. La práctica corta hecha vale; la larga postergada no.',
  },
  {
    dia: 5, titulo: 'La cafeína con horario', duracion: '2 min',
    senal: 'La cafeína no se va cuando dejas de sentirla. La mitad todavía está dando vueltas entre cinco y seis horas después, y una parte sigue ahí mucho más tiempo. Por eso te duermes igual y amaneces sin haber descansado: dormiste, pero más liviano toda la noche. No se trata de dejarla. Se trata de que trabaje para ti y no contra tu noche.',
    accion: 'Cuenta ocho horas hacia atrás desde tu hora de dormir: esa es tu última taza del día. Después de esa hora, agua o infusión sin cafeína.',
    variante: 'Si tomas mucho, baja de a poco esta semana en vez de cortar de golpe. El objetivo es la hora, no la cantidad.',
  },
  {
    dia: 6, titulo: 'La luz', duracion: '10 min',
    senal: 'Tu reloj interno no se ajusta con la hora del despertador: se ajusta con la luz. La de la mañana le avisa a tu cuerpo cuándo empieza el día, y con eso queda fijado, unas quince horas después, cuándo tiene que darte sueño. Esto es lo más barato y lo más ignorado de todo el protocolo.',
    accion: 'En la primera hora despierto, diez minutos afuera, sin lentes de sol y sin el teléfono en la mano. Alcanza con el balcón o la vereda. Y a la noche, una hora antes de dormir, baja las luces de la casa.',
    variante: 'Si está nublado sirve igual: afuera hay muchísima más luz que adentro aunque no lo parezca. Si sales de noche, hazlo junto a la ventana más grande apenas amanezca.',
  },
  {
    dia: 7, titulo: 'Las tres de la mañana', duracion: '2 min',
    senal: 'Despertarse de madrugada no es el problema. El problema es lo que haces en los tres minutos siguientes: miras la hora, calculas cuánto te queda, te acuerdas de algo pendiente y ahí sí ya no vuelves a dormir. Lo que te despierta es fisiología. Lo que te mantiene despierto son tus tres minutos, y esos los podemos entrenar.',
    accion: 'Deja papel y lapicera al lado de la cama: si te despiertas y aparece un pendiente, lo escribes y lo sueltas. Tu cabeza lo sostiene solo porque tiene miedo de perderlo. No mires la hora, no toques el teléfono, exhalación larga hasta que se pase.',
  },
  {
    dia: 8, titulo: 'La cafeína tiene horario', duracion: '4 min',
    senal: 'La cafeína tiene una vida media de ~6 horas: el café de las 17 sigue en tu sangre a las 23, sentado sobre tu sueño profundo. No hace falta dejarla — hace falta ponerle horario de oficina. El líder que "duerme mal desde hace años" muchas veces solo tiene un problema de agenda química.',
    accion: 'Define tu hora de última cafeína (regla simple: 8 horas antes de tu hora de dormir objetivo). Escríbela en el Diario. Desde mañana, la respetas — hoy solo la firmas.',
  },
  {
    dia: 9, titulo: 'La conversación pendiente', duracion: '10 min',
    senal: 'En tu Rueda hay un área humana golpeada — pareja, familia, amigos. Detrás de casi toda área humana golpeada hay una conversación que no está ocurriendo. No hace falta resolverla hoy. Hace falta dejar de fingir que no existe.',
    accion: 'Identifica la conversación pendiente más importante de tu vida personal. Escribe en el Diario solo dos cosas: con quién es, y qué te frena. (No la tengas todavía — este protocolo prepara antes de exponer.)',
  },
  {
    dia: 10, titulo: 'Cierre de fase: Ver', maestro: true, duracion: '6 min',
    senal: '"Diez días mirando sin anestesia. Eso que sentiste esta semana — incomodidad, tal vez bronca, tal vez alivio — es la diferencia entre saber que estás fundido y VERLO. Ya tienes el mapa: tus números, tus drenajes, tus horarios reales, tu conversación pendiente. La fase que viene es quirúrgica: vamos a cortar. No todo. Lo que drena." — Javo',
    accion: 'Relee tus notas de los días 5 y 9. Elige EL drenaje número uno — el que, si desapareciera, te devolvería más vida. Escríbelo en el Diario de hoy con esta forma exacta: "Esta semana interrumpo: ___".',
  },
  {
    dia: 11, titulo: 'La regla de las pantallas', duracion: '5 min',
    senal: 'Empieza Interrumpir. Primera cirugía: la última hora del día. Es la única hora que decide cómo van a ser las siguientes ocho (tu sueño) y por lo tanto las dieciséis de mañana. Una hora sin pantallas antes de dormir no es un lujo de monje: es mantenimiento de infraestructura crítica.',
    accion: 'Hoy: última pantalla una hora antes de tu hora de dormir. Qué hacer con esa hora es libre (ducha caliente, papel, conversación, nada). Registra mañana el efecto en tus Signos.',
  },
  {
    dia: 12, titulo: 'Una reunión menos', duracion: '10 min',
    senal: 'Toda agenda de líder quemado tiene al menos una reunión recurrente que sobrevive por inercia: nadie recuerda por qué existe, nadie se anima a matarla. Cada semana te cobra una hora — y te la cobra en tu mejor horario. Las reuniones no son trabajo: son una de las formas del trabajo, y la más cara.',
    accion: 'Abre tu calendario. Encuentra UNA reunión recurrente eliminable o convertible en mensaje. Cancélala hoy (o propón el cambio). Escribe en el Diario cuántas horas al año acabas de recuperar.',
  },
  {
    dia: 13, titulo: 'El "no" ensayado', duracion: '8 min',
    senal: 'Decir que no no es un rasgo de personalidad: es una habilidad, y como toda habilidad, se practica en frío. El líder agotado dice que sí en caliente porque no tiene un "no" preparado. Tener la frase lista es la mitad del límite.',
    accion: 'Escribe en el Diario tu "no" ensayado — una sola frase, tuya, amable y sin excusas (ejemplo base: "No puedo tomarlo esta semana; puedo el [día] o puede hacerlo [persona]"). Dila en voz alta dos veces. En serio: en voz alta.',
  },
  {
    dia: 14, titulo: 'Dos semanas: la primera evidencia', duracion: '6 min',
    senal: 'Catorce días. Si registraste tus Signos, ya hay una curva — quizás pequeña, pero tuya y medida. Y algo más importante: llevás dos semanas haciendo algo que la versión tuya del Día 0 no hacía — sostener un protocolo. Eso es identidad en construcción, no motivación. La motivación se acaba; los sistemas no.',
    accion: 'Compara tu energía promedio de esta semana con la anterior (el Diario lo muestra). Suba o baje, escribe la respuesta honesta a esto: ¿qué fue lo más difícil de sostener? Eso que escribiste es tu próximo hito.',
  },
  {
    dia: 15, titulo: 'El inventario del teléfono', duracion: '8 min',
    senal: 'Tu teléfono decide más veces por día que tu directorio. Cada notificación es alguien comprando tu atención sin pagarte. No hace falta tirarlo al lago: hace falta despedir a los que entran sin permiso.',
    accion: 'Abre la configuración de notificaciones. Deja sonido solo para humanos que amas y emergencias reales. Todo lo demás — correo, grupos, noticias, redes — en silencio. 8 minutos que te devuelven años de atención.',
  },
  {
    dia: 16, titulo: 'El almuerzo sin pantalla', duracion: '20 min',
    senal: 'Comes frente a una pantalla para "aprovechar el tiempo". Resultado: no comiste ni trabajaste — hiciste las dos cosas a medias, y tu sistema nervioso no tuvo ni una pausa real en todo el día.',
    accion: 'Hoy: una comida sin ninguna pantalla. Solo tú, el plato, y mirar por la ventana si quieres. Nota qué incómodo es al principio — esa incomodidad es la medida de cuánto lo necesitas.',
  },
  {
    dia: 17, titulo: 'Cierre: la semana de los bordes', duracion: '6 min',
    senal: 'Tres semanas midiendo. Esta semana le pusiste borde a las pantallas, a las reuniones y a tu boca (el "no" ensayado). El sistema empieza a tener forma.',
    accion: 'Mira tus horas de sueño de esta semana en Hoy y compáralas con la primera. Escribe en tu línea de hoy: ¿cuánto cambió el número — y qué lo cambió?',
  },
  {
    dia: 18, titulo: 'La auditoría de agenda', duracion: '12 min',
    senal: 'Tu agenda es el documento más honesto de tu vida: dice en qué se va tu tiempo de verdad, no en qué crees que se va. Hoy la lees como leerías la de un empleado que está fundido — con frialdad y cariño a la vez.',
    accion: 'Abre tu calendario de la semana pasada. Marca cada bloque con una letra: T (solo tú podías), D (delegable), I (inercia — nadie sabe por qué existe). Cuenta las horas I. Escríbelas en tu línea de hoy.',
  },
  {
    dia: 19, titulo: 'El bloque protegido', duracion: '5 min + 90 mañana',
    senal: 'Tu mejor pensamiento vale más que tus mejores 40 respuestas de WhatsApp. Pero el pensamiento profundo necesita algo que tu agenda no tiene: 90 minutos seguidos sin que nadie te toque.',
    accion: 'Agenda AHORA un bloque de 90 minutos mañana, en tu mejor horario, con nombre en el calendario ("bloque protegido") y teléfono en otra habitación. Es una reunión contigo: se cancela tan poco como una con tu mejor cliente.',
  },
  {
    dia: 20, titulo: 'Delegar el drenaje n.º 1', duracion: '15 min',
    senal: '"Es más rápido hacerlo yo" es la frase que te tiene acá. Es verdad hoy — y mentira en total: hacerlo tú 50 veces al año cuesta 50 veces; enseñarlo bien cuesta una. La delegación no es soltar: es transferir con instrucción.',
    accion: 'Toma el drenaje n.º 1 que elegiste el Día 10. Escribe la instrucción en 5 pasos (como para alguien que no te puede preguntar nada) y entrégala HOY a quien corresponda, con fecha de primera revisión.',
  },
  {
    dia: 21, titulo: 'El "no" en vivo', duracion: 'el momento que aparezca',
    senal: 'Ensayaste tu "no" el Día 13. Hoy se estrena. El trabajo emocional que no se convierte en conducta se evapora en una semana — esta es la conversión.',
    accion: 'Hoy dices tu "no" ensayado a UNA cosa real (un pedido, una reunión, un favor que no te toca). Amable, sin excusas, con tu frase. Después escribe en tu línea qué pasó de verdad — casi siempre, nada. Esa es la evidencia.',
  },
  {
    dia: 22, titulo: 'El sedante honesto', duracion: '4 min',
    senal: 'El vaso de la noche "para bajar" funciona: te apaga. El problema es lo que hace después: fragmenta tu sueño profundo y te entrega a las 3AM con la cabeza encendida. No es un juicio moral — es farmacología. Alcohol es el somnífero que te despierta.',
    accion: 'Esta noche, sin el vaso (o córtalo 3 horas antes de dormir). Mañana compara cómo despertaste. Con TU dato, decide tú — acá no hay sermones, hay mediciones.',
  },
  {
    dia: 23, titulo: 'Luz de mañana', duracion: '10 min',
    senal: 'Tu reloj interno no se regula de noche: se ancla de mañana. 10 minutos de luz natural antes de las 10 le dicen a tu cerebro "el día empezó" — y esa señal, 14 horas después, es la que te ayuda a dormir. Es la herramienta de sueño más barata que existe.',
    accion: 'Hoy, dentro de tus primeras 2 horas despierto: 10 minutos afuera (balcón, vereda, caminata corta). Sin anteojos de sol, sin mirar el sol de frente. Si puedes, combínalo con la caminata sin input.',
  },
  {
    dia: 24, titulo: 'Cierre: la semana de la agenda', duracion: '6 min',
    senal: 'Esta semana tu agenda dejó de ser algo que te pasa y empezó a ser algo que decides: la auditaste, protegiste un bloque, delegaste con instrucción, dijiste un "no" real.',
    accion: 'Revisa: ¿el bloque protegido sobrevivió? ¿La delegación del Día 20 avanzó? Escribe en tu línea qué borde de esta semana vas a defender la próxima — uno solo.',
  },
  {
    dia: 25, titulo: 'La dieta de información', duracion: '5 min',
    senal: 'Tu cabeza no para también por lo que le das de comer: noticias, mercados, el scroll "para despejarte" que te llena de todo menos despeje. La información sin decisión asociada es ruido con disfraz de responsabilidad.',
    accion: 'Elige TU horario de información (una ventana de 20-30 min por día para noticias/redes/mercados). Fuera de esa ventana: nada. Borra hoy la app que más te chupa — la puedes reinstalar cuando quieras; ese es el punto.',
  },
  {
    dia: 26, titulo: 'El medio día protegido', duracion: '4 min hoy',
    senal: 'No recuerdas tu último medio día sin trabajar — sin "un mail cortito", sin "reviso algo". Tu empresa sobrevive medio día sin ti. Si no lo crees, ese es exactamente el problema que estamos tratando.',
    accion: 'Elige medio día de este fin de semana (4-5 horas) y decláralo protegido: avísale HOY a tu equipo y a tu familia, en esas palabras. El teléfono, en un cajón. Qué hacer con esas horas es libre — el punto es de quién son.',
  },
  {
    dia: 27, titulo: 'La cena sin teléfonos', duracion: 'la cena de hoy',
    senal: 'Tu familia no necesita un discurso sobre tu cambio. Necesita evidencia. La primera: una mesa donde estés entero. El teléfono de TODOS en una caja no es una regla contra tus hijos — es un regalo que empieza por ti.',
    accion: 'Esta noche: cena sin teléfonos, los de todos, incluido el tuyo. Una caja o un cajón, hasta levantar la mesa. Si preguntan por qué, di la verdad: "quiero estar donde estoy". Escribe después qué pasó en la mesa.',
  },
  {
    dia: 28, titulo: 'La revisión de drenajes', duracion: '10 min',
    senal: 'Hace 23 días hiciste tu mapa de drenajes. Hoy lo vuelves a mirar con otros ojos: cortaste cosas, delegaste una, dijiste que no. Lo que sigue vivo en la lista ya no está ahí por inercia — está ahí porque no decidiste. Eso también es un dato.',
    accion: 'Relee tu mapa del Día 5. Marca: qué murió, qué delegaste, qué sigue drenando. Elige el próximo delegable y repite el método del Día 20 esta semana (instrucción de 5 pasos + entrega + fecha).',
  },
  {
    dia: 29, titulo: 'La hora de cierre, renegociada', duracion: '5 min',
    senal: 'Hace 4 semanas firmaste tu primera hora de cierre — realista para el que eras. Hoy tienes evidencia: sabes qué días la cumpliste y qué se lo impidió. Los sistemas no se sostienen por fuerza: se ajustan con datos.',
    accion: 'Con tus 4 semanas de Signos a la vista, fija tu hora de cierre definitiva (puede ser más temprano — o más honesta). Escríbela en tu línea de hoy con esta forma: "Mi jornada termina a las ___. Firmado."',
  },
  {
    dia: 30, titulo: 'Cierre de fase: Interrumpir', maestro: true, duracion: '8 min',
    senal: '"Un mes. Mira tu lista: pantallas con borde, reuniones muertas, un drenaje delegado, un no dicho en voz alta, medio día tuyo, una cena entera. Nadie aplaudió — así es esto: lo que cortaste no hace ruido, solo deja espacio. La fase que viene usa ese espacio para reconstruir: cuerpo, comida, orden, y las personas que te están esperando. Lo más difícil ya no es cortar. Es volver." — Javo',
    accion: 'Escribe tu lista de lo interrumpido (todo lo real de estas 3 semanas, aunque sea imperfecto). Guárdala en tu línea de hoy. Mañana empieza Transformar — y empieza por tu cuerpo.',
  },
  {
    dia: 31, titulo: 'El contrato de movimiento', duracion: '10 min',
    senal: 'Empieza Transformar — y empieza por el cuerpo, porque el cuerpo es la batería de todo lo demás. No vamos a "ponerte en forma": vamos a devolverle movimiento a un sistema que lleva años sentado sosteniendo todo. El movimiento es tratamiento del ánimo con evidencia sólida — no un extra estético.',
    accion: 'Firma tu contrato mínimo: 3 sesiones de 20-30 min esta semana (caminata rápida, fuerza básica, lo que SÍ vas a hacer). Agéndalas AHORA en el calendario, con nombre, como reuniones. La primera: hoy o mañana.',
  },
  {
    dia: 32, titulo: 'La regla de los 10 minutos', duracion: '20-30 min',
    senal: 'Vas a tener días sin ganas — hoy quizás. La regla que salva el sistema: empieza, con permiso total de parar a los 10 minutos. El 90% de las veces sigues; el 10% que paras, cumpliste igual. La constancia no es intensidad: es no negociar el inicio.',
    accion: 'Sesión 1 de tu contrato. Si no hay ganas, aplica la regla: 10 minutos y decides. Registra después en tu línea cómo entraste y cómo saliste — esa diferencia es el dato que te va a servir los próximos 60 días.',
  },
  {
    dia: 33, titulo: 'Las respiraciones de arranque', duracion: '5 min',
    senal: 'La respiración es el único control manual de tu sistema nervioso. Exhalar largo frena; inhalar fuerte acelera. Hoy sumas el arranque de mañana: 5 respiraciones profundas al despertar, antes del teléfono. Si quieres más voltaje: rondas de respiración fuerte — siempre SENTADO, nunca en el agua ni manejando, y no si tienes condición cardíaca.',
    accion: 'Mañana al despertar, antes de cualquier pantalla: 5 respiraciones profundas (inhala hondo, exhala largo). 60 segundos. Se suma a la luz de mañana — juntas son tu encendido.',
  },
  {
    dia: 34, titulo: 'La ducha del líder', duracion: '1 min extra',
    senal: 'El frío al final de la ducha es un entrenamiento de dos cosas que te faltan: energía real (descarga de noradrenalina, sin café) y tolerancia a la incomodidad elegida — el músculo exacto que se atrofió mientras evitabas todo lo difícil que no fuera trabajo. Es opcional. Como todo lo que funciona.',
    accion: 'Hoy: los últimos 15 segundos de tu ducha, en frío. Respira lento — el que controla la respiración controla el frío. Esta semana: 15 seg. La próxima, si quieres: 30. Nunca es obligatorio; siempre es tuyo.',
  },
  {
    dia: 35, titulo: 'Sesión 2 + el porqué', duracion: '20-30 min',
    senal: 'Dato para tu cabeza escéptica: el ejercicio regular tiene efectos comparables a tratamientos de primera línea para el ánimo bajo en estudios clínicos. No es magia ni "endorfinas" de póster: es tu fisiología recuperando rango. Estás tomando tu medicación — se llama moverse.',
    accion: 'Sesión 2 del contrato. Hoy presta atención a UNA cosa: tu energía 2 horas después de terminar, comparada con un día sin sesión. Escríbela.',
  },
  {
    dia: 36, titulo: 'El cuerpo en la agenda de viaje', duracion: '6 min',
    senal: 'Tu sistema tiene que sobrevivir a tu vida real: viajes, semanas de locura, cenas de trabajo. La versión mínima viable de todo: 10 sentadillas + 10 flexiones + caminar al aeropuerto no necesita gimnasio ni ropa. Un sistema que exige condiciones perfectas es un sistema muerto.',
    accion: 'Escribe tu "versión de viaje" del contrato de movimiento (qué haces cuando no puedes lo normal — mínimo absurdo de 7 minutos). Guárdala. La vas a necesitar, y ahora existe.',
  },
  {
    dia: 37, titulo: 'Cierre: la semana del cuerpo', duracion: '6 min',
    senal: 'Una semana con el cuerpo de vuelta en el equipo. No importa si fueron 3 sesiones perfectas o 2 a medias: importa que el sistema existe, tiene contrato, regla de arranque y versión de viaje.',
    accion: 'Cuenta tus sesiones reales de la semana y tu energía promedio (está en Hoy). Escribe: ¿qué le cambió el movimiento a tus noches? Ajusta el contrato de la próxima semana si hace falta — con datos, no con culpa.',
  },
  {
    dia: 38, titulo: 'El desayuno con proteína', duracion: '5 min',
    senal: 'Semana de comida. Sin dieta, sin pesar nada: 4 movimientos que estabilizan tu energía. El primero: proteína a la mañana. El desayuno de harinas y café te da un pico y un pozo a las 11 — y ese pozo lo tapas con más café, que a la noche te cobra el sueño. Es una cadena. Se corta en el eslabón uno.',
    accion: 'Mañana: desayuno con proteína real (huevos, yogur, queso, lo que te guste). Nota tu energía a las 11 — la hora del pozo. Ese es tu experimento de la semana.',
  },
  {
    dia: 39, titulo: 'El agua a mano', duracion: '2 min',
    senal: 'La fatiga de las 16 muchas veces es sed con disfraz. No hace falta contar litros: hace falta que el agua esté MÁS CERCA que el café. La conducta sigue a la distancia — eso es diseño de ambiente, no fuerza de voluntad.',
    accion: 'Pon una botella grande en tu escritorio, llena, ahora. Regla simple: se termina antes de la tarde. El café sigue existiendo — pero con su horario del Día 8, y después del agua.',
  },
  {
    dia: 40, titulo: 'Un ultraprocesado menos', duracion: '3 min',
    senal: 'No vamos a limpiarte la alacena — vamos a sacar UNO: el que comes en piloto automático (el paquete de la tarde, lo dulce de la noche). Un cambio sostenido vale más que diez prometidos. Y el azúcar de la noche también es un impuesto al sueño.',
    accion: 'Identifica tu ultraprocesado automático n.º 1 y decide su reemplazo concreto (fruta, frutos secos, nada). Hoy no lo compras más — la batalla se gana en el supermercado, no frente a la alacena.',
  },
  {
    dia: 41, titulo: 'La cena que deja dormir', duracion: '5 min',
    senal: 'Cenar mucho y tarde es entregarle tu sueño profundo a la digestión. La regla: cenar más temprano y más liviano las noches normales — tu cuerpo se va a dormir a dormir, no a procesar. (Las cenas de trabajo y los asados existen; el sistema los absorbe si son la excepción.)',
    accion: 'Esta noche: cena 3 horas antes de acostarte, liviana. Mañana mira tus horas de sueño y cómo despertaste. Otra vez: tu dato decide, no mi sermón.',
  },
  {
    dia: 42, titulo: 'La compra del líder', duracion: '15 min',
    senal: 'Tu alimentación de la semana se decide una vez: en la compra. Después solo ejecutas lo que hay. Si en tu casa hay proteína, fruta y agua, comes eso. El ambiente vence a la voluntad — a favor o en contra. Elige a favor.',
    accion: 'Haz (o encarga) la compra de la semana con la lista nueva: proteínas que te gusten, fruta visible, tu reemplazo del Día 40, sin tu ultraprocesado n.º 1. 15 minutos que deciden 21 comidas.',
  },
  {
    dia: 43, titulo: 'Sesión 3 + la comida junta', duracion: '25 min',
    senal: 'El cuerpo y la comida son el mismo sistema: el que se mueve duerme mejor, el que duerme come mejor, el que come mejor tiene energía para moverse. No estás haciendo 4 cosas — estás girando una sola rueda.',
    accion: 'Sesión de movimiento de hoy. Y en tu línea: ¿qué cambió en tu energía esta semana con los 4 movimientos de comida? Un número del 1 al 5 y una frase.',
  },
  {
    dia: 44, titulo: 'Cierre: la semana de la comida', duracion: '6 min',
    senal: 'Sin dieta, sin app de calorías, sin culpa: proteína, agua, un ultraprocesado menos, cena que deja dormir, compra decidida. Sistemas, no promesas.',
    accion: 'Compara tu energía promedio de esta semana con la de la Fase V (está en Hoy). Escribe el número. Mañana es un día grande: la medición oficial del Día 45. Duerme bien esta noche — pero como todas: sin estudiar para el examen.',
  },
  {
    dia: 45, titulo: 'LA MEDICIÓN DEL DÍA 45', maestro: true, duracion: '10 min',
    senal: '"Mitad de camino. Hoy no hay consigna: hay instrumento. El mismo del Día 0, las mismas preguntas, tu verdad de hoy. No respondas como el que quiere haber mejorado — responde como el que quiere SABER. Si el número bajó, es tuyo: lo construiste día por día. Si no bajó lo que esperabas, también es tuyo — y es exactamente la información que tu tratamiento necesita para la segunda mitad. Acá no se aprueba ni se desaprueba. Acá se mide." — Javo',
    accion: 'Haz tu medición oficial ahora (desde el Tratamiento). Cuando veas la comparación D0 → D45, escribe en tu línea la frase que te salga — la primera, sin editar.',
  },
  {
    dia: 46, titulo: 'La captura externa', duracion: '10 min',
    senal: 'Semana de orden. Tu cabeza no para en parte porque la usas de depósito: pendientes, ideas, miedos, "no me olvide de". Un depósito no se apaga — se vacía. La regla de oro del orden: la cabeza es para DECIDIR; el papel (o la app de notas, UNA) es para GUARDAR.',
    accion: 'Elige tu único lugar de captura (una libreta o una app de notas — una sola). Vuelca ahora TODO lo que da vueltas: 10 minutos, sin ordenar, solo vaciar. Desde hoy, todo lo que aparezca va ahí en el momento. La descarga nocturna del Día 5 de Apaga la Cabeza era esto — ahora es sistema diurno.',
  },
  {
    dia: 47, titulo: 'La bandeja a cero (una vez)', duracion: '25 min',
    senal: 'Tu bandeja de entrada es la lista de tareas que otros escriben por ti. No vamos a mantenerla en cero para siempre — vamos a que la veas vacía UNA vez, para que tu cabeza registre que se puede, y a darte la regla de los 2 minutos: lo que toma menos de 2, se hace ya; el resto, a la captura o al calendario.',
    accion: 'Bloque de 25 minutos: procesa tu bandeja principal con la regla de los 2 minutos (hacer / capturar / archivar / borrar). No respondas largo nada — procesar no es trabajar. Llega a cero o cerca. Mira eso. Respira.',
  },
  {
    dia: 48, titulo: 'La segunda delegación', duracion: '15 min',
    senal: 'La delegación del Día 20, ¿sigue delegada o la recuperaste "porque era más fácil"? La recaída de delegación es normal — el sistema se sostiene revisando, no confiando. Y hoy toca soltar la segunda.',
    accion: 'Revisa la delegación n.º 1 (ajusta la instrucción si volvió a ti). Toma el siguiente delegable de tu mapa y repite el método: instrucción de 5 pasos + entrega + fecha de revisión. Dos sistemas delegados = horas semanales tuyas de vuelta, para siempre.',
  },
  {
    dia: 49, titulo: 'El número de horas', duracion: '5 min',
    senal: 'Trabajas "mucho". ¿Cuánto es mucho? Tus Signos lo saben: llevas 7 semanas registrando horas. Hoy le pones objetivo al número — no por pereza: porque las horas 55 a 70 son las de peor calidad de decisión de tu semana, y las que pagan tu casa y tu cuerpo.',
    accion: 'Mira tu promedio real de horas de trabajo en Hoy. Fija tu objetivo de la semana próxima (realista: si estás en 62, apunta a 55, no a 45). Escríbelo. La semana que viene lo comparamos contra los Signos — número contra número.',
  },
  {
    dia: 50, titulo: 'El orden de la noche anterior', duracion: '5 min',
    senal: 'La mejor mañana se fabrica la noche anterior: las 3 cosas de mañana, elegidas hoy. No 20 — 3. El que arranca sabiendo qué toca no le regala la primera hora al correo. Este micro-hábito cierra tu jornada (Día 2) y abre la siguiente: el círculo completo.',
    accion: 'Esta noche, al cerrar tu jornada: escribe las 3 de mañana en tu captura (la 1 va al bloque protegido). Desde hoy, es parte de tu hora de cierre.',
  },
  {
    dia: 51, titulo: 'Cierre: la semana del orden', duracion: '6 min',
    senal: 'Captura única, bandeja procesada, segunda delegación, objetivo de horas, las 3 de mañana. Tu cabeza tiene cada vez menos que sostener — por eso se apaga mejor de noche. No era un misterio: era carga.',
    accion: 'Escribe en tu línea: ¿cuántas veces esta semana tu cabeza intentó "acordarse de algo" y lo mandaste a la captura? Ese reflejo nuevo es el sistema funcionando. La semana que viene es la más importante de los 90 días: las personas.',
  },
  {
    dia: 52, titulo: 'Preparar la conversación', duracion: '15 min',
    senal: 'La semana de conexión empieza por la conversación pendiente — la que nombraste el Día 9 y esperó 43 días a propósito: hoy llegas durmiendo, con bordes y con cuerpo. Prepararla no es escribir un guion: es saber qué quieres DECIR (tu verdad, en primera persona), qué quieres PREGUNTAR (y escuchar de verdad), y qué NO es esta conversación (no es un juicio, no es una negociación, no se gana).',
    accion: 'Escribe tres líneas: "Quiero decirte que yo…" / "Quiero preguntarte…" / "Esta conversación no es para…". Elige el momento (mañana o pasado, sin apuro, sin teléfonos, sin hijos despiertos). No la tengas hoy. Hoy solo la preparas.',
  },
  {
    dia: 53, titulo: 'La conversación', duracion: 'lo que necesite',
    senal: 'Hoy o mañana, la tienes. Vas a querer postergarla — es el Personaje defendiendo su última frontera: la de no mostrarse. Recuerda: no vas a resolver años en una charla. Vas a ABRIR una puerta que llevaba años cerrada. Con eso alcanza. Habla en primera persona ("yo sentí", "yo me alejé"), pregunta, y aguanta los silencios sin llenarlos.',
    accion: 'Ten la conversación. Después — solo, con tiempo — escribe en tu línea qué se abrió. Si necesitas hablarlo, el Clínico está; y si eres paciente Acompañado, tu clínico de cabecera la va a leer esta semana.',
  },
  {
    dia: 54, titulo: 'El día después', duracion: '6 min',
    senal: 'Las conversaciones importantes siguen trabajando 48 horas después — en ti y en el otro. Hoy no se fuerza nada: se sostiene lo abierto con un gesto simple, no con más palabras.',
    accion: 'Un gesto hacia esa persona, hoy, sin mensaje explicativo: el mate a la mañana, un "pensé en ti", volver temprano. Pequeño y real. Las palabras ya se dijeron; ahora hablan los días.',
  },
  {
    dia: 55, titulo: 'La cita', duracion: '2 horas',
    senal: 'Con tu pareja: dos horas, cero logística (prohibido hablar de hijos, obras, cuentas y calendario), cero teléfonos. No es "salir a cenar": es que la persona con la que vives te vuelva a tener enfrente, entero. Si no hay pareja, la cita es con quien elijas — o contigo, en serio, haciendo algo que amabas.',
    accion: 'Agenda y ten la cita esta semana (ideal: hoy o el fin de semana). Regla de oro: preguntas que no haces hace años ("¿en qué andas tú, de verdad?"). Escucha el doble de lo que hablas.',
  },
  {
    dia: 56, titulo: 'Una hora en su mundo', duracion: '1 hora',
    senal: 'Con tus hijos, la presencia no se mide en horas compartiendo techo: se mide en entrar a SU mundo, con sus reglas. Una hora en su juego vale más que un sábado entero de "estar" mirando el teléfono. Si no tienes hijos: la hora es para un sobrino, un ahijado, o el hijo que fuiste (esa cosa que amabas a los 12 — hazla).',
    accion: 'Una hora, hoy o mañana, en el mundo de ellos: su juego, su música, su serie, sus reglas. Tu único trabajo: no dirigir, no corregir, no mirar la hora.',
  },
  {
    dia: 57, titulo: 'La llamada', duracion: '20 min',
    senal: 'Ese amigo al que "tienes que llamar" hace meses. La amistad adulta se muere de agenda, no de afecto — y los hombres que dirigen se quedan sin pares con quienes no ser el que dirige. Una llamada revive lo que diez "tenemos que juntarnos" entierran.',
    accion: 'Llámalo hoy. Sin motivo, sin agenda. "Me acordé de ti" es razón completa. Si sale juntarse, agenda fecha antes de cortar.',
  },
  {
    dia: 58, titulo: 'Pedir ayuda', duracion: 'el momento',
    senal: 'El músculo más atrofiado del que sostiene a todos: pedir. No delegar (eso es dar órdenes) — PEDIR ayuda, esa que te deja en deuda chica y en humanidad grande. El Personaje no pide nunca; por eso hoy pides.',
    accion: 'Pide ayuda una vez hoy, en algo real (una opinión, una mano, un consejo, un favor). Nota qué se siente en el cuerpo justo antes de pedirla — eso que se aprieta es lo que estamos tratando.',
  },
  {
    dia: 59, titulo: 'Lo que cambió en casa', duracion: '8 min',
    senal: 'Una semana de conexión: la conversación, la cita, su mundo, la llamada, el pedido. Nada de esto salió perfecto — no era el punto. El punto es que el hombre que llegaba vacío empezó a llegar.',
    accion: 'Escribe en tu línea (más larga hoy, si quieres): ¿qué cambió en tu casa esta semana? ¿Qué viste en ellos que hacía tiempo no veías? Esa línea va a ser una de las que leas el Día 91.',
  },
  {
    dia: 60, titulo: 'Cierre de fase: Transformar', maestro: true, duracion: '8 min',
    senal: '"Treinta días de reconstrucción: el cuerpo volvió al equipo, la comida dejó de sabotearte, el orden le sacó peso a tu cabeza, y las personas — las personas te vieron volver. Quiero decirte algo del Día 45 y de todo esto: no eras vago, ni frío, ni desordenado. Eras un sistema desbordado haciendo lo que podía. Ahora eres un sistema con recursos. La fase que viene no agrega casi nada nuevo — hace algo más difícil: que todo esto no dependa de tu voluntad. Porque la voluntad se acaba. Los sistemas no." — Javo',
    accion: 'Relee tu línea del Día 30 (la lista de lo interrumpido) y escribe hoy la lista de lo reconstruido. Dos listas, 60 días. Mañana empieza Anclar.',
  },
  {
    dia: 61, titulo: 'Los 3 innegociables', duracion: '10 min',
    senal: 'Empieza Anclar. De todo lo instalado en 60 días, hoy eliges los TRES que no se negocian nunca más — ni en semana de locura, ni de viaje, ni en crisis. No diez: tres. Los innegociables no son los más lindos: son los que sostienen a todos los demás (para la mayoría: la hora de cierre, el teléfono fuera, el movimiento — pero los tuyos los eliges tú, con tus datos).',
    accion: 'Elige tus 3 innegociables y escríbelos en tu línea de hoy con esta forma exacta: "Pase lo que pase: 1___, 2___, 3___. Firmado." Mañana los haces públicos.',
  },
  {
    dia: 62, titulo: 'El límite se declara', duracion: '10 min',
    senal: 'Un límite privado no existe: es una intención. El límite nace cuando lo DICES — a tu familia y a tu equipo, en voz alta, con fecha. No pides permiso ni das explicaciones largas: informas cómo operas ahora. Los que te quieren lo van a cuidar; los que te usaban lo van a testear. Ambas cosas son información.',
    accion: 'Hoy, di tus 3 innegociables en voz alta a tu familia Y a tu equipo (en persona o audio, no texto): "Desde ahora, pase lo que pase, yo ___". Escribe después cómo reaccionó cada mundo.',
  },
  {
    dia: 63, titulo: 'El gatillo de cada uno', duracion: '8 min',
    senal: 'Los hábitos que sobreviven al cansancio no dependen de decidir: dependen de un gatillo. La fórmula (con décadas de evidencia detrás): "después de X, hago Y". Después de cerrar la computadora, salgo a caminar. Después de cenar, el teléfono a la caja. El gatillo decide por ti cuando tú ya no puedes.',
    accion: 'Escribe el gatillo de cada innegociable: "Después de ___, hago ___" (los tres). Pégalos donde los veas (nota en el espejo, fondo de pantalla). Desde hoy, el gatillo manda.',
  },
  {
    dia: 64, titulo: 'La semana ideal realista', duracion: '15 min',
    senal: 'No la semana perfecta de LinkedIn: la TUYA, con tus reuniones reales y tu caos real — pero con los innegociables puestos PRIMERO en el calendario y todo lo demás acomodándose alrededor. El que agenda primero lo importante, lo protege; el que lo deja "para cuando se pueda", lo pierde.',
    accion: 'Diseña tu semana próxima en el calendario, en este orden: 1) innegociables, 2) bloque protegido, 3) reuniones reales, 4) el resto. 15 minutos. Es la primera semana de tu vida diseñada por ti y no por tu bandeja de entrada.',
  },
  {
    dia: 65, titulo: 'La Señal, entrenada', duracion: '8 min',
    senal: 'Llevas semanas caminando sin input. Ahí abajo del ruido hay una voz que no argumenta, no compara y no corre: habla bajo, corto, en presente, y vuelve siempre igual. La llamamos la Señal. Lo otro — lo urgente, lo que amenaza, lo que exige — es el Ruido. Hoy empiezas a distinguirlos a propósito: es un músculo, no un don.',
    accion: 'Hoy, después de tu caminata: 3 minutos quieto, respirando 5-5 (inhala 5, exhala 5). Después, una sola pregunta en tu línea: "¿Qué dijo la Señal hoy?" — una frase. Si solo hubo Ruido, escribe eso: también es el entrenamiento.',
  },
  {
    dia: 66, titulo: 'El interruptor de estado', duracion: '5 min',
    senal: 'Tu estado no es el clima: tiene tres perillas — postura, respiración, foco. Antes de lo difícil (la reunión pesada, la llamada que evitas), 60 segundos de interruptor: cuerpo erguido, 3 exhalaciones largas, y una frase TUYA que te devuelve al eje. No es pensamiento positivo: es fisiología aplicada.',
    accion: 'Escribe tu frase de eje (corta, tuya, en tus palabras — la que te dirías antes de entrar a lo difícil). Hoy usa el interruptor completo una vez antes de algo real. Ya vive también en tu Botiquín (Pre-Reunión): ahora es tuyo con nombre.',
  },
  {
    dia: 67, titulo: 'Cierre: la semana de los anclajes', duracion: '6 min',
    senal: 'Innegociables firmados, declarados y con gatillo. Semana diseñada por ti. La Señal con su primer entrenamiento. El sistema ya no vive en tu memoria: vive en tu calendario, tus gatillos y tu gente.',
    accion: 'Revisa: ¿cuál de los 3 innegociables estuvo más en riesgo esta semana, y qué lo salvó (o no)? Escríbelo — esa respuesta es materia prima del plan anti-recaída que armamos la semana que viene.',
  },
  {
    dia: 68, titulo: 'Tus señales tempranas', duracion: '10 min',
    senal: 'La zona roja no vuelve de golpe: vuelve en cuotas, y siempre con las mismas tres primeras señales — las TUYAS. Tus 9 semanas de Signos las tienen escritas: qué pasa con tu sueño, tu energía y tus horas justo antes de que se te desarme todo. El que conoce sus señales tempranas no necesita fuerza: necesita mirarlas.',
    accion: 'Mira tus datos en Hoy y en Mi Zona. Escribe tus 3 señales tempranas con números: "Cuando duermo menos de ___ dos noches seguidas / cuando trabajo más de ___ tres días / cuando cancelo ___ dos veces". Esas son TUS alarmas.',
  },
  {
    dia: 69, titulo: 'El protocolo de emergencia', duracion: '12 min',
    senal: 'Todo tratamiento serio incluye qué hacer en la recaída — porque va a haber semanas de caos: se llama tu vida. El plan anti-recaída no promete que no vuelvas a hundirte: promete que sepas nadar. Es una hoja: si suenan 2 de mis 3 alarmas → qué corto primero, qué innegociable defiendo a muerte, a quién llamo, y qué NO decido en ese estado.',
    accion: 'Escribe tu protocolo de emergencia (4 líneas: corto / defiendo / llamo a / no decido). Guárdalo en tu captura Y en tu línea de hoy. Es la única dosis que deseo que nunca uses — y la que más vale.',
  },
  {
    dia: 70, titulo: 'El testigo', duracion: '10 min',
    senal: 'Un plan que solo conoces tú es un plan a medias. El compromiso dicho frente a otro pesa distinto — no es magia: es cómo funciona el animal social que eres. Tu testigo no te controla: te espeja. Una persona, no cinco.',
    accion: 'Elige tu testigo (pareja o un par de confianza) y compártele HOY tus 3 alarmas y tu protocolo de emergencia, en voz alta: "Si me ves así, recordame esto". Diez minutos incómodos que valen un tratamiento entero.',
  },
  {
    dia: 71, titulo: 'La agenda del mes que viene', duracion: '12 min',
    senal: 'Anclar también es futuro: tu próximo mes ya tiene semillas de caos plantadas (ese viaje, ese cierre, esa semana triple). Hoy las miras ANTES de que lleguen y les pones el sistema encima — la versión de viaje, el innegociable que no se toca, el medio día protegido movido pero no borrado.',
    accion: 'Abre el mes que viene en tu calendario. Detecta las 2 semanas de mayor riesgo y déjales escrito el plan (qué versión mínima del sistema corre esos días). El caos avisado no desarma: desafía.',
  },
  {
    dia: 72, titulo: 'La Señal, segunda ronda', duracion: '8 min',
    senal: 'Segunda semana de entrenamiento del discernimiento. Hoy, un criterio más para distinguir: el Ruido siempre EMPUJA ("tienes que, ya, o si no…"); la Señal siempre INVITA ("es por acá"). Y una regla de seguridad que no se negocia: la Señal jamás pide dañarte ni dañar a nadie — lo que empuje al daño no es la Señal, y se habla con un profesional.',
    accion: 'Caminata + 3 minutos de quietud + la pregunta. Hoy suma: ¿hubo esta semana una decisión donde el Ruido gritaba una cosa y la Señal decía otra? Escribe cuál fue y a quién le hiciste caso.',
  },
  {
    dia: 73, titulo: 'Lo que vuelve a gustarte', duracion: '1 hora',
    senal: 'El Personaje eliminó todo lo que no producía: la guitarra, la pesca, los fierros, leer novelas, lo que fuera TUYO. No era un lujo — era tu recreo, y sin recreo el sistema nervioso no tiene dónde soltarse. Hoy recuperas uno. No para ser bueno: para que sea tuyo de nuevo.',
    accion: 'Una hora, esta semana (agéndala hoy), para eso que amabas y abandonaste. Sin convertirlo en proyecto, sin métricas, sin mostrarlo. Escribe después qué se sintió en el cuerpo.',
  },
  {
    dia: 74, titulo: 'Cierre: la semana del plan', duracion: '6 min',
    senal: 'Alarmas con números, protocolo de emergencia, testigo, el mes que viene preparado, y algo tuyo de vuelta. Ya no dependes de estar bien para sostenerte: tienes sistema para cuando estés mal. Eso es anclar.',
    accion: 'Escribe en tu línea la frase que le dirías a tu yo del Día 0 sobre lo que es tener un plan. La semana que viene: la prueba de fuego — el sistema completo, solo, en tu vida real.',
  },
  {
    dia: 75, titulo: 'La prueba de fuego: reglas', duracion: '5 min',
    senal: 'Seis días sin dosis nuevas. Solo tu sistema completo — innegociables, gatillos, Signos, Señal — corriendo en tu semana real, con su caos real. Yo me corro a un lado: esta semana el tratamiento eres tú. Tu único trabajo extra: registrar qué aguanta y qué se cae, sin maquillar.',
    accion: 'Lee tus 3 innegociables y tus gatillos una vez. Y a vivir la semana. Cada noche: Signos + una línea honesta de qué aguantó y qué se cayó hoy.',
  },
  {
    dia: 76, titulo: 'Prueba de fuego · día 2', duracion: '2 min',
    senal: 'Sin consigna. El sistema corre. Si algo se cayó ayer, no se compensa con culpa: se retoma con el gatillo. Caerse un día es dato; abandonar es decisión. Hoy solo hay una: seguir.',
    accion: 'Signos + tu línea: ¿qué aguantó, qué se cayó, qué lo salvó?',
  },
  {
    dia: 77, titulo: 'Prueba de fuego · día 3', duracion: '2 min',
    senal: 'Mitad de la prueba. Dato curioso que quizás ya notaste: el sistema no se sostiene por disciplina — se sostiene porque cada pieza le hace la vida más fácil a la siguiente. Cerrar temprano hace dormir; dormir hace entrenar; entrenar hace llegar entero a casa. La rueda gira sola si no le pones el pie.',
    accion: 'Signos + tu línea. Si un innegociable está en riesgo mañana, aplica lo del Día 71: plan antes que fuerza.',
  },
  {
    dia: 78, titulo: 'Prueba de fuego · día 4', duracion: '2 min',
    senal: 'Sin consigna. Una pregunta para la caminata de hoy, nada más: ¿quién estás siendo esta semana, sin que yo te diga qué hacer?',
    accion: 'Signos + tu línea. Y la respuesta de la caminata, si vino.',
  },
  {
    dia: 79, titulo: 'Prueba de fuego · día 5', duracion: '2 min',
    senal: 'Penúltimo día solo. Mira algo: hace 79 días necesitabas que alguien te dijera que apagaras el teléfono. Esta semana operaste un sistema completo sin instrucciones. Eso no es motivación — es que ya no eres el mismo sistema.',
    accion: 'Signos + tu línea. Mañana cerramos la prueba y ajustamos con la evidencia.',
  },
  {
    dia: 80, titulo: 'Cierre de fase: Anclar', maestro: true, duracion: '10 min',
    senal: '"Se terminó la prueba de fuego. Lee tus seis líneas de la semana: eso que ves ahí — lo que aguantó solo, lo que se cayó y volvió — ese es tu sistema real, no el ideal. Ajústalo con lo que la semana te enseñó, sin vergüenza por lo caído: los planes perfectos son de los que no viven. Te queda la última fase, y es distinta a todas: ya no vamos a tocar tu agenda ni tu sueño. Vamos a hablar con el que sostuvo todo estos años. Le debes una carta." — Javo',
    accion: 'Ajusta tus innegociables o gatillos con la evidencia de la semana (si hace falta). Escribe en tu línea qué aguantó SOLO — sin ti empujando. Mañana empieza Liderarte.',
  },
  {
    dia: 81, titulo: 'La carta al Personaje · escribir', maestro: true, duracion: '25 min',
    senal: '"Hoy le escribes al Personaje — esa versión tuya que rinde, aparenta y nunca se apaga. Antes de despedirlo, míralo bien: te sacó adelante. Sostuvo la empresa cuando no había nada, te hizo respetar, pagó esta casa. También te costó tu sueño, tus 3AM y casi te cuesta tu mesa. La carta tiene tres partes, y las tres son verdad: qué le agradeces (en serio, sin ironía) · qué te costó sostenerlo · qué ya no le pides. No la escribas bien. Escríbela cierta." — Javo',
    accion: 'Escribe la carta a mano si puedes (25 min, sin teléfono cerca). Empieza como quieras — "A ti, que sostuviste todo:" funciona. No se comparte hoy, no se relee hoy. Se guarda.',
  },
  {
    dia: 82, titulo: 'La carta · releer y completar', maestro: true, duracion: '15 min',
    senal: '"Relee tu carta con un día de distancia. Vas a encontrar una frase que ayer no pudiste escribir — casi siempre es la del agradecimiento verdadero, o la del costo que más duele nombrar. Hoy la agregas. Una carta a medias despide a medias." — Javo',
    accion: 'Relee, completa lo que falte, y escribe la última línea: quién queda a cargo ahora (con nombre: el tuyo). Mañana se lee en voz alta.',
  },
  {
    dia: 83, titulo: 'La carta · en voz alta', maestro: true, duracion: '15 min',
    senal: '"Leerla en silencio es entenderla. Leerla EN VOZ ALTA es otra cosa: el cuerpo escucha tu propia voz decir lo que nunca dijo, y algo se ordena adentro que ningún pensamiento ordena. Hazlo solo si quieres — o frente a tu testigo, tu pareja, o tu clínico si eres Acompañado: la presencia de otro multiplica el corte. No es teatro. Es la firma." — Javo',
    accion: 'Lee tu carta en voz alta, entera, sin apuro. Solo o con testigo — tu decisión. Después escribe en tu línea una sola cosa: qué sentiste en el cuerpo al leer la última línea.',
  },
  {
    dia: 84, titulo: 'LA MEDICIÓN DEL CONTRATO', maestro: true, duracion: '12 min',
    senal: '"Día 84. El mismo instrumento del Día 0, las mismas preguntas, tu verdad de hoy. Respóndelo como siempre: para SABER, no para aprobar. Del otro lado hay dos puertas y las dos son dignas. Si tu Índice subió los veinticinco puntos, es tu alta: la construiste una Dosis por vez, y hoy se abre lo que sellaste el primer día. Si el número dice que falta, el contrato habla: seguimos hasta lograrlo, porque esto era por contrato y no por marketing. Sea cual sea la puerta, el que responde hoy no es el que respondió el Día 0. Eso ya nadie te lo saca." — Javo',
    accion: 'Haz tu medición del día 84 desde el Tratamiento. Mira tu Tablero completo: Día 0, día 42 y hoy, los tres juntos. Después abre lo que escribiste el primer día y no volviste a leer.',
  },
];

/** El hito de la Dosis: qué evidencia mueve la Zona (v0.5: auto-verificables desde el Diario). */
export interface Hito {
  id: string;
  nombre: string;
  descripcion: string;
}

export const HITOS: Hito[] = [
  { id: 'semana-signos', nombre: 'Primera semana medida', descripcion: '7 días seguidos de Signos Vitales registrados.' },
  { id: 'noches-7h', nombre: 'El sueño vuelve', descripcion: '5 noches con 7+ horas de sueño registradas en una semana.' },
  { id: 'medicion-medio', nombre: 'La medición del día 42', descripcion: 'El re-test al cerrar el primer viaje.' },
  { id: 'medicion-contrato', nombre: 'La medición del contrato', descripcion: 'El re-test del día 84 — la promesa, medida.' },
];

export { TOTAL_DIAS } from './camino';
export const DOSIS_ESCRITAS = DOSIS.length;
