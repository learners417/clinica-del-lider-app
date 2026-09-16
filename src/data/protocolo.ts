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
    accion: 'Abre tu resultado y léelo completo, despacio, una vez. Después escribe una sola línea: qué número te dolió más ver.'
  },
  {
    dia: 2, titulo: 'La hora de cierre', duracion: '5 min',
    senal: 'Tu jornada no termina cuando terminas: termina cuando decides que terminó. Sin una hora de cierre el trabajo se derrama sobre la cena, sobre tu pareja y sobre tu sueño, y encima lo llamas compromiso. Los que se recuperan no trabajan menos horas al principio. Trabajan horas con borde.',
    accion: 'Define tu hora de cierre para esta semana. Sé realista: si hoy cierras a las diez, pon las nueve y media. Escríbela y dísela a una persona: que alguien más la sepa es lo que la vuelve real.',
    variante: 'Si hay días que no la puedes cumplir, elige cuatro de los siete. Cuatro cumplidos valen más que siete prometidos.'
  },
  {
    dia: 3, titulo: 'El teléfono fuera', duracion: '10 min',
    senal: 'El teléfono en la mesa de luz hace dos cosas: te acompaña hasta el último segundo del día y te agarra en el primero del siguiente. Entre las dos, decide por ti qué piensas al dormirte y qué piensas al despertar. Tu cuarto tiene una sola función. Hoy se la devolvemos.',
    accion: 'Consigue un despertador que no sea tu teléfono; si no tienes uno, cómpralo hoy. Esta noche el teléfono carga en otra habitación.',
    variante: 'Si estás de guardia o tienes hijos chicos, déjalo del otro lado del cuarto, boca abajo y en silencio, con el volumen alto solo para llamadas.'
  },
  {
    dia: 4, titulo: 'El Apagado', duracion: '8 min',
    senal: 'No te desvela lo que pasó: te desvela que tu cuerpo sigue encendido cuando tú ya te acostaste. Estuvo todo el día preparándote para resolver, y a las once de la noche nadie le avisó que se terminó. Esto se apaga desde afuera. La exhalación larga es la palanca más directa que tienes sobre eso, y funciona en minutos.',
    accion: 'Con la luz baja, sentado o acostado: inhala cuatro segundos, exhala ocho. Sin forzar. Diez rondas. Si tienes el audio guiado, úsalo: hace el mismo trabajo y no tienes que contar.',
    variante: 'Si dispones de menos tiempo, cinco rondas antes de apoyar la cabeza. La práctica corta hecha vale; la larga postergada no.'
  },
  {
    dia: 5, titulo: 'La cafeína con horario', duracion: '2 min',
    senal: 'La cafeína no se va cuando dejas de sentirla. La mitad todavía está dando vueltas entre cinco y seis horas después, y una parte sigue ahí mucho más tiempo. Por eso te duermes igual y amaneces sin haber descansado: dormiste, pero más liviano toda la noche. No se trata de dejarla. Se trata de que trabaje para ti y no contra tu noche.',
    accion: 'Cuenta ocho horas hacia atrás desde tu hora de dormir: esa es tu última taza del día. Después de esa hora, agua o infusión sin cafeína.',
    variante: 'Si tomas mucho, baja de a poco esta semana en vez de cortar de golpe. El objetivo es la hora, no la cantidad.'
  },
  {
    dia: 6, titulo: 'La luz', duracion: '10 min',
    senal: 'Tu reloj interno no se ajusta con la hora del despertador: se ajusta con la luz. La de la mañana le avisa a tu cuerpo cuándo empieza el día, y con eso queda fijado, unas quince horas después, cuándo tiene que darte sueño. Esto es lo más barato y lo más ignorado de todo el protocolo.',
    accion: 'En la primera hora despierto, diez minutos afuera, sin lentes de sol y sin el teléfono en la mano. Alcanza con el balcón o la vereda. Y a la noche, una hora antes de dormir, baja las luces de la casa.',
    variante: 'Si está nublado sirve igual: afuera hay muchísima más luz que adentro aunque no lo parezca. Si sales de noche, hazlo junto a la ventana más grande apenas amanezca.'
  },
  {
    dia: 7, titulo: 'Las tres de la mañana', duracion: '2 min',
    senal: 'Despertarse de madrugada no es el problema. El problema es lo que haces en los tres minutos siguientes: miras la hora, calculas cuánto te queda, te acuerdas de algo pendiente y ahí sí ya no vuelves a dormir. Lo que te despierta es fisiología. Lo que te mantiene despierto son tus tres minutos, y esos los podemos entrenar.',
    accion: 'Deja papel y lapicera al lado de la cama: si te despiertas y aparece un pendiente, lo escribes y lo sueltas. Tu cabeza lo sostiene solo porque tiene miedo de perderlo. No mires la hora, no toques el teléfono, exhalación larga hasta que se pase.'
  },
  {
    dia: 8, titulo: 'Las horas reales', duracion: '12 min',
    senal: 'Sabes exactamente cuánto facturó tu empresa el mes pasado. No sabes cuántas horas trabajaste la semana pasada. Si un socio te dijera que no lleva registro del recurso más caro del negocio, lo corregirías el mismo día. Tu tiempo es ese recurso, y hace años que no lo mides.',
    accion: 'Abre tu agenda de los últimos siete días y suma las horas reales de trabajo: las de la oficina, las del teléfono a la noche y las del domingo. Anota el número.',
    variante: 'Si no tienes la agenda cargada, reconstruye los siete días de atrás para adelante, a ojo. Un número aproximado sirve; ninguno no sirve.'
  },
  {
    dia: 9, titulo: 'Lo que vale tu hora', duracion: '10 min',
    senal: 'Ayer contaste las horas. Hoy les pones precio, porque un número sin precio no mueve a nadie y a ti los precios sí te mueven. Esto no se trata de cuánto ganas: se trata de en qué se va lo que ya estás ganando.',
    accion: 'Divide tu facturación del último mes por las horas que trabajaste ese mes. Ese es el valor real de tu hora. Después escribe cuántas de esas horas hicieron algo que solo podías hacer tú.'
  },
  {
    dia: 10, titulo: 'Tu primera semana medida', duracion: '8 min',
    senal: 'Tienes siete días de Signos registrados. Eso es más información concreta sobre cómo funcionas que toda la que juntaste en los últimos cinco años. Hasta ahora tu estado era una sensación; desde hoy es una serie de datos.',
    accion: 'Abre tu registro y mira las cuatro líneas juntas: sueño, energía, foco y actos de verdad. Escribe una sola frase con el patrón que ves.'
  },
  {
    dia: 11, titulo: 'Cómo te ven', duracion: '15 min',
    senal: 'Tu propia percepción de cómo estás es la menos confiable de todas las que hay disponibles, porque el que evalúa es el mismo que se acostumbró. La persona que te ve todos los días tiene datos que tú no tienes, y nunca se los pediste.',
    accion: 'Pregúntale a alguien que viva contigo o trabaje contigo: cómo me viste este último año. Escucha hasta el final sin explicar, sin justificar y sin corregir. Cuando termine, solo di gracias.',
    variante: 'Si hoy no tienes a esa persona cerca, mándale el mensaje y lee la respuesta dos veces antes de contestar.'
  },
  {
    dia: 12, titulo: 'Todo lo que sostienes', duracion: '10 min',
    senal: 'Nadie sabe cuánto carga hasta que lo escribe. Mientras está en la cabeza se siente pesado pero indefinido, y lo indefinido no se puede repartir. En papel se vuelve una lista, y una lista sí se puede trabajar.',
    accion: 'Diez minutos de reloj: escribe todo lo que hoy depende de que tú estés. Decisiones, aprobaciones, clientes, personas, cuentas, cosas de la casa. Sin filtrar y sin ordenar.'
  },
  {
    dia: 13, titulo: 'Lo que no es tuyo', duracion: '8 min',
    senal: 'De esa lista, una parte es tuya de verdad: nadie más puede hacerla. La otra parte la agarraste porque en su momento era más rápido hacerla que enseñarla. Eso fue una decisión razonable hace tres años y hoy es la mitad de tu carga.',
    accion: 'Marca con una cruz todo lo de la lista que otra persona podría hacer si estuviera enseñada. No lo que haría igual de bien que tú: lo que podría hacer. Cuenta las cruces.'
  },
  {
    dia: 14, titulo: 'Cierre del primer bloque', maestro: true, duracion: '10 min',
    senal: '"Dos semanas. No cambiaste tu vida todavía, y eso está bien: mediste. Hoy sabes cuántas horas trabajas de verdad, cuánto vale cada una, qué patrón tiene tu semana, cómo te ve la persona que convive contigo y cuánto de lo que cargas no te corresponde. La mayoría de los líderes que conozco no supo nunca ninguna de esas cinco cosas. Acá termina Ver. Lo que viene se llama Interrumpir, y ahí ya no se mira: se corta." — Javo',
    accion: 'Elige una sola cruz de tu lista: la que más pesa. Escríbela, y al lado escribe el nombre de la persona que podría quedársela si estuviera enseñada.'
  },
  {
    dia: 15, titulo: 'Nombrarlo', duracion: '8 min',
    senal: 'Todos los que llegan acá tienen algo con lo que se apagan. No es un defecto de carácter: es la única salida que encontró tu cuerpo para bajar de un día que no baja solo. Funciona, por eso lo repites. Y tiene un precio, por eso estamos hablando de esto.',
    accion: 'Escribe con qué te apagas y a qué hora empieza. Sin adjetivos y sin justificarlo: solo el qué y la hora. Hoy no se cambia nada.',
    variante: 'Si aparece más de uno, escríbelos todos. Esta semana vamos a trabajar con uno solo, pero conviene ver la lista completa.'
  },
  {
    dia: 16, titulo: 'El precio', duracion: '10 min',
    senal: 'Hasta ahora la discusión sobre esto la tuviste siempre en el terreno de la culpa, y en ese terreno pierdes. Vamos a moverla al terreno donde ganas: los datos. Los tuyos, de quince días, no los de un estudio.',
    accion: 'Abre tus Signos. Separa las noches en que usaste tu apagador de las que no, y compara las dos cosas de la mañana siguiente: las horas de sueño y la energía al despertar. Anota la diferencia.',
    variante: 'Si todavía no tienes noches de las dos clases, anótalo igual y vuelve a este día el domingo. El dato existe, solo que aún no lo juntaste.'
  },
  {
    dia: 17, titulo: 'El que eliges', duracion: '5 min',
    senal: 'No se corta todo junto, porque el que corta todo junto vuelve a los cuatro días con todo junto. Se corta uno. Cinco noches. Empieza esta.',
    accion: 'Elige uno solo de tu lista: el que tenga el precio más alto según lo que mediste ayer. Escribe la frase completa, con nombre y con fecha: durante cinco noches, desde hoy, no uso esto para apagarme.',
    variante: 'Si lo que elegiste es una sustancia y ya intentaste cortarla antes sin poder, no lo hagas solo esta semana: llévalo a tu consulta y lo trabajamos ahí. Que cueste no es falta de voluntad, es información clínica.'
  },
  {
    dia: 18, titulo: 'Lo que aparece', duracion: '8 min',
    senal: 'Noche dos. A la hora en que te apagabas va a aparecer algo, y ese algo es lo que el apagador venía tapando. Puede ser ansiedad, puede ser una conversación pendiente, puede ser aburrimiento, puede ser tristeza. No es una recaída ni un problema nuevo: es lo que estaba abajo y ahora se ve.',
    accion: 'A esa hora, en vez de apagarte, escribe dos líneas: qué apareció y dónde lo sentiste en el cuerpo. Después haz el Apagado y vete a dormir.'
  },
  {
    dia: 19, titulo: 'El reemplazo', duracion: '10 min',
    senal: 'Un hábito no se saca: se reemplaza. El lugar que ocupaba queda vacío y el cuerpo lo llena con lo primero que encuentra, casi siempre con lo mismo de antes. Hoy decides tú qué va en ese lugar.',
    accion: 'Elige una sola cosa concreta para hacer a esa hora: caminar diez minutos, una ducha, el Apagado más largo, leer en papel, llamar a alguien. Déjala preparada hoy, antes de que llegue la hora.',
    variante: 'Que sea algo que ya tengas a mano. Si el reemplazo necesita que salgas a comprar algo, no lo vas a hacer.'
  },
  {
    dia: 20, titulo: 'La coartada', duracion: '8 min',
    senal: 'Noche cuatro, y a esta altura ya apareció la frase. Todos tenemos una y es siempre razonable: me lo gané, fue un día bravo, mañana empiezo, una no hace nada. Esa frase no la dices tú: la dice la parte tuya que quiere que todo siga igual. Cuando la escuchas y la reconoces, deja de darte órdenes.',
    accion: 'Escribe tu frase exacta, la que te dijiste esta semana. Debajo escribe qué te costó la última vez que le hiciste caso.'
  },
  {
    dia: 21, titulo: 'Cinco noches, contadas', maestro: true, duracion: '10 min',
    senal: '"Se terminaron las cinco noches. Cuenta cuántas cumpliste, sin redondear para arriba y sin castigarte. Tres de cinco es un resultado real y es muchísimo más que cero. Lo que importa no es el número: es que ahora sabes que puedes. Hasta hace tres semanas ni siquiera lo habías intentado, y te habías convencido de que era parte de quien eres. No lo era." — Javo',
    accion: 'Cuenta las noches cumplidas y anótalas. Después decide una sola cosa: si esto sigue cortado, si vuelve con horario, o si lo llevas a la consulta. Escribe cuál de las tres.'
  },
  {
    dia: 22, titulo: 'Cuánto entra', duracion: '10 min',
    senal: 'Tu cabeza es el instrumento con el que te ganas la vida y es lo único que nunca le hiciste mantenimiento. Le exiges decisiones finas mientras le metes catorce horas de entrada sin filtro. Antes de sacarle peso, hay que ver cuánto peso tiene.',
    accion: 'Busca el tiempo de uso de tu teléfono de los últimos siete días y anota el promedio diario. Después mira cuántas veces lo desbloqueaste ayer. Los dos números, escritos.',
    variante: 'En iPhone está en Ajustes, Tiempo de uso. En Android, en Bienestar digital. Si nunca lo activaste, actívalo hoy y vuelve a este día mañana.'
  },
  {
    dia: 23, titulo: 'El silencio del bolsillo', duracion: '12 min',
    senal: 'Cada notificación te cobra dos veces: una cuando la miras y otra cuando vuelves a lo que estabas haciendo, que tarda bastante más de lo que crees. No estás distraído porque te falte disciplina. Estás distraído porque configuraste un aparato para interrumpirte y nunca lo revisaste.',
    accion: 'Apaga todas las notificaciones salvo llamadas y los mensajes de dos personas que elijas por su nombre. Todas las demás aplicaciones quedan sin sonido, sin vibración y sin globito.',
    variante: 'Si te da miedo perderte algo del trabajo, define en qué momentos del día vas a revisar esa aplicación. Tres veces al día es revisar; cuarenta veces es que ella te revisa a ti.'
  },
  {
    dia: 24, titulo: 'La primera hora', duracion: '5 min',
    senal: 'Lo primero que entra en la mañana define el tono del día entero. Si lo primero es el pedido de otro, tu día arranca siendo de otro, y después pasas doce horas intentando recuperarlo. Ya sacaste el teléfono del cuarto en el día 3. Hoy extendemos eso a la primera hora despierto.',
    accion: 'Hoy, hasta que pase una hora desde que abriste los ojos, no abres mensajes, ni mail, ni redes. La luz de la mañana, tu Dosis y el desayuno van primero.',
    variante: 'Si una hora es imposible con tu casa y tus horarios, empieza con treinta minutos. Lo que se cumple se sostiene.'
  },
  {
    dia: 25, titulo: 'La bandeja no es tu agenda', duracion: '10 min',
    senal: 'El que abre el correo antes de decidir su día trabaja todo el día para la agenda de otros, y a la noche siente que no hizo nada propio. No es una sensación: es exactamente lo que pasó. La bandeja de entrada es la lista de prioridades de otras personas.',
    accion: 'Antes de abrir cualquier bandeja, escribe las tres cosas que quieres que pasen hoy. Después abre. Al final del día, marca cuántas de las tres pasaron.'
  },
  {
    dia: 26, titulo: 'Un lugar para todo', duracion: '12 min',
    senal: 'Tu cabeza está guardando cosas de memoria que no tendría que estar guardando, y por eso te despierta a las tres de la mañana: no confía en que estén anotadas en algún lado. El ruido no es solo lo que entra. Es todo lo abierto que nunca aterrizó en ningún lugar.',
    accion: 'Elige un solo lugar para capturar todo lo que aparece: una libreta, una nota del teléfono, lo que sea, pero uno solo. Vacía ahí todo lo que tengas abierto, sin ordenarlo. Doce minutos de reloj.',
    variante: 'Si ya tienes tres sistemas, ese es el problema. Elige uno y abandona los otros dos esta semana.'
  },
  {
    dia: 27, titulo: 'Veinte minutos sin nada', duracion: '20 min',
    senal: 'Las mejores ideas que tuviste en tu vida no aparecieron mientras consumías información. Aparecieron manejando, en la ducha, caminando. Tu cabeza necesita períodos vacíos para conectar lo que ya sabe, y hace años que no le das ninguno. No es descanso: es el trabajo que solo puede hacer cuando la dejas sola.',
    accion: 'Camina veinte minutos sin auriculares, sin teléfono y sin nadie al lado. Si aparece una idea, anótala al volver, no durante.',
    variante: 'Si hoy no puedes salir, siéntate veinte minutos mirando por la ventana. Suena raro y funciona igual.'
  },
  {
    dia: 28, titulo: 'La cabeza con espacio', maestro: true, duracion: '10 min',
    senal: '"Cuatro semanas. Fíjate en algo: esta semana no te pedí que trabajaras más ni mejor, y sin embargo es probable que hayas decidido más rápido. No te volviste más inteligente en siete días. Le sacaste ruido al mismo instrumento de siempre. Eso es todo lo que pasó, y es lo que la mayoría no prueba nunca porque está convencida de que el problema es la capacidad." — Javo',
    accion: 'Mira tu tiempo de uso de esta semana y compáralo con el número que anotaste el día 22. Después escribe una sola cosa de esta semana que se queda para siempre.'
  },
  {
    dia: 29, titulo: 'De dónde sale tu agenda', duracion: '12 min',
    senal: 'Tu agenda no la armaste tú. La armaron, de a un pedido por vez, personas que te pidieron algo en un momento en que decir que sí era más rápido que pensarlo. Cada una de esas veces fue razonable. La suma es la vida que tienes hoy.',
    accion: 'Mira los compromisos de la semana que viene. Al lado de cada uno escribe quién lo pidió. Después marca los que habrías puesto tú si la agenda estuviera vacía.'
  },
  {
    dia: 30, titulo: 'El sí automático', duracion: '8 min',
    senal: 'El problema no es que digas que sí. Es la velocidad: contestas antes de haber pensado, porque el silencio te resulta más incómodo que el compromiso. Y después cumples, porque cumplir es lo que eres. Entre el pedido y tu respuesta hay un lugar vacío, y ahí es donde se recupera una vida.',
    accion: 'Hoy, a todo pedido que te llegue, respondes lo mismo: déjame verlo y te confirmo antes de esta noche. A todos, incluso a los que ibas a aceptar igual. Hoy entrenas la pausa, no la respuesta.',
    variante: 'Si el pedido es de alguien a quien no le puedes pedir tiempo, igual tómate treinta segundos antes de contestar. La pausa corta también cuenta.'
  },
  {
    dia: 31, titulo: 'El no que no ofende', duracion: '8 min',
    senal: 'No dices que no porque crees que vas a quedar mal, y entonces explicas. La explicación larga es justamente lo que te hace quedar mal: abre la negociación, porque cada motivo que das es un motivo que el otro puede resolver. El no corto y amable se acepta. El no largo se discute.',
    accion: 'Escribe tus dos frases y apréndelas. Una: gracias por pensar en mí, esta vez no voy a poder. Otra: eso no lo puedo, lo que sí puedo es esto. Sin motivos y sin disculpas largas.'
  },
  {
    dia: 32, titulo: 'El primero', duracion: '5 min',
    senal: 'Hoy dices uno. No el más grande: el más chico de tu lista, el que no te va a costar la relación ni el negocio. Esto se entrena como cualquier otra cosa, y nadie empieza por el peso máximo.',
    accion: 'Elige el pedido más chico de los que marcaste el día 29 y di que no, hoy, con una de tus dos frases. Anota a quién y qué sentiste al mandarlo.',
    variante: 'Si hoy no aparece ninguno nuevo, cancela algo que ya habías aceptado y no quieres hacer. Cancelar también es decir que no, y cuesta más.'
  },
  {
    dia: 33, titulo: 'Lo que pasó después', duracion: '8 min',
    senal: 'Antes de decir que no, tu cabeza te mostró una película: la cara del otro, el enojo, la relación dañada. Vamos a comparar esa película con lo que efectivamente ocurrió. En la enorme mayoría de los casos no pasa nada, y esa es la información más cara que te vas a llevar de estas doce semanas.',
    accion: 'Escribe dos líneas: qué imaginaste que iba a pasar cuando dijiste que no, y qué pasó de verdad.'
  },
  {
    dia: 34, titulo: 'La devolución', duracion: '20 min',
    senal: 'El día 13 marcaste con una cruz todo lo que otra persona podría hacer si estuviera enseñada, y el día 14 escribiste un nombre. Delegar no es mandar la tarea: es enseñarla una vez, aceptar que las primeras veces va a salir peor que contigo, y no volver a agarrarla. La parte cara es la segunda, no la primera.',
    accion: 'Busca a esa persona y entrégale esa tarea. Muéstrale cómo la haces, dile cuál es el resultado que esperas y cuándo lo revisan juntos. Hoy no delegas dos: una.',
    variante: 'Si todavía no tienes a quién, hoy escribe qué tendría que saber alguien para poder quedársela. Esa lista es la búsqueda que tienes que abrir.'
  },
  {
    dia: 35, titulo: 'Tu agenda con tu firma', maestro: true, duracion: '10 min',
    senal: '"Cinco semanas. Dijiste un no, no se rompió nada y devolviste algo que no te correspondía. Eso es todo lo que hace falta para que la próxima vez sea más fácil, porque el miedo no se va argumentando: se va cuando lo pruebas y no pasa lo que te habías imaginado. Acá termina el trabajo del borde. La semana que viene vamos al lugar donde el borde se te cae siempre, que no es la agenda: es quién crees que tienes que ser." — Javo',
    accion: 'Cuenta cuántas horas te devolvieron los noes de esta semana y la tarea que delegaste. Escribe el número, y al lado escribe en qué las vas a usar.'
  },
  {
    dia: 36, titulo: 'El Personaje', maestro: true, duracion: '10 min',
    senal: '"Hay una versión tuya que sale cuando te están mirando. El que puede con todo, el que no se queja, el que resuelve. No es falso: es una parte tuya real, y te sirvió para llegar hasta aquí. El problema no es que exista. El problema es que ya no se apaga, y sostenerlo veinticuatro horas por día es la mitad de tu cansancio." — Javo',
    accion: 'Escribe en tercera persona cómo es ese que sale cuando te miran: qué dice, qué nunca admite, cómo se para. Después ponle un nombre. Cualquiera, el primero que aparezca.',
    variante: 'Si te suena ridículo ponerle nombre, hazlo igual. Lo que tiene nombre se puede ver venir; lo que no tiene nombre eres tú.'
  },
  {
    dia: 37, titulo: 'Cuándo se pone el traje', duracion: '8 min',
    senal: 'No aparece todo el tiempo: aparece en momentos precisos, y esos momentos se repiten todas las semanas. Reunión de equipo, llamada con un cliente grande, mesa familiar, alguien que te pregunta cómo estás. Si conoces los momentos, lo ves venir.',
    accion: 'Escribe los tres momentos de tu semana en los que ese Personaje sale sí o sí. Hoy solo los anotas: no hay que hacer nada distinto todavía.'
  },
  {
    dia: 38, titulo: 'Lo que cuesta sostenerlo', duracion: '10 min',
    senal: 'Actuar consume. No es una metáfora: mostrar por fuera algo distinto de lo que pasa por dentro tiene un costo de energía medible, y tú llevas años pagándolo todos los días sin haberlo contado nunca.',
    accion: 'Abre tus Signos y busca los días que tuvieron alguno de esos tres momentos. Compara la energía del día siguiente con la de los días que no los tuvieron. Anota la diferencia.'
  },
  {
    dia: 39, titulo: 'Quién dijo todos esos síes', duracion: '8 min',
    senal: 'La semana pasada trabajaste tus síes automáticos. Hoy aparece quién los decía. El que no puede decir que no es el Personaje, porque un no lo desarma: si dice que no, deja de ser el que puede con todo. Por eso el límite no se sostenía con voluntad. No era un problema de agenda.',
    accion: 'Mira la lista del día 29 y escribe al lado de tres compromisos qué habría pasado con la imagen que tienen de ti si hubieras dicho que no.'
  },
  {
    dia: 40, titulo: 'Para quién', duracion: '12 min',
    senal: 'Esa versión tuya se construyó para alguien. Siempre hay una primera persona a la que había que demostrarle algo: un padre, una madre, un socio, un profesor, alguien de quien dependía que te fuera bien. Y hay algo que casi nadie se detiene a mirar: muchas veces esa persona ya no está mirando. A veces ya no está. Y el Personaje sigue trabajando para una audiencia que se fue.',
    accion: 'Escribe el nombre de la primera persona a la que le mostraste ese Personaje. Después escribe una sola pregunta y respóndela: hoy, esa persona, qué necesitaría de ti de verdad.',
    variante: 'Si esto te mueve más de lo que esperabas, es esperable y es el punto de la semana. Llévalo a tu consulta.'
  },
  {
    dia: 41, titulo: 'Un lugar sin traje', duracion: '15 min',
    senal: 'No se trata de andar por la vida sin ninguna armadura: eso ni es posible ni es deseable. Se trata de que exista al menos un lugar donde no la uses. Con una persona alcanza. Sin ese lugar, el Personaje no descansa nunca, y lo que no descansa se rompe.',
    accion: 'Antes de hablar con nadie, abre el Iceberg y termina la última capa: qué le dices a esa parte tuya que se inventó el Personaje para cuidarte. Después elige una persona y dile, en una frase, algo que el Personaje nunca admitiría.',
    variante: 'Si hoy no hay nadie, escríbela igual y guárdala. Lo que se escribe se puede decir después; lo que no se escribió nunca se dice.'
  },
  {
    dia: 42, titulo: 'LA MEDICIÓN DEL DÍA 42', maestro: true, duracion: '15 min',
    senal: '"Se terminó el primer viaje. Cuarenta y dos días sacando lo que no era tuyo: lo que te apagaba, el ruido, los síes que eran no, el traje. Hoy volvemos a medir con el mismo instrumento del primer día, y quiero que lo respondas igual que entonces: para saber, no para aprobar. Después te va a aparecer algo que escribiste el Día 0 y no volviste a leer. Léelo despacio. De aquí en adelante ya no se saca: se construye." — Javo',
    accion: 'Haz tu medición del día 42 desde el Tratamiento: el Tablero completo y el CBI. Cuando termines, compara las diez medidas con las del Día 0 y mira cuál se movió más.'
  },
  {
    dia: 43, titulo: 'El cuerpo que dejaste', duracion: '10 min',
    senal: 'Empieza el segundo viaje. Durante seis semanas sacaste; a partir de hoy se construye, y se empieza por el cuerpo porque es lo que sostiene todo lo demás. Y porque es lo primero que soltaste: hace años que lo tratas como un medio de transporte para llevar tu cabeza a las reuniones.',
    accion: 'Escribe tres cosas que tu cuerpo hacía hace cinco años y hoy no hace. Sin nostalgia y sin culpa: es un inventario, igual que el del día 12.'
  },
  {
    dia: 44, titulo: 'Caminar', duracion: '30 min',
    senal: 'Antes de cualquier plan de entrenamiento hay algo más básico que casi todos los que llegan acá perdieron: moverse todos los días. Caminar no es poco ejercicio. Es la base sobre la que el resto se puede construir, y es lo único que vas a poder sostener incluso en tus peores semanas.',
    accion: 'Camina treinta minutos hoy. Si puedes, que sean a la mañana y afuera: se junta con la luz del día 6 y haces las dos cosas de una vez.',
    variante: 'Si hoy no tienes treinta, camina quince. Lo que no sirve es no caminar.'
  },
  {
    dia: 45, titulo: 'La fuerza', duracion: '25 min',
    senal: 'Después de los treinta y cinco, la masa muscular se va sola si nadie hace nada, y con ella se van la energía del día y la calidad de tu sueño. No hablamos de estética: hablamos de la estructura que sostiene tu capacidad de trabajo en los próximos veinte años.',
    accion: 'Elige dos días fijos de la semana para hacer fuerza y ponlos en el calendario como una reunión con nombre. Hoy haz la primera sesión, aunque sea corta y en tu casa.',
    variante: 'Si nunca hiciste fuerza o tienes alguna lesión, empieza con peso corporal y consulta a un profesional del movimiento antes de cargar peso.'
  },
  {
    dia: 46, titulo: 'El mediodía decide tu tarde', duracion: '8 min',
    senal: 'Hay una hora del día que explica casi toda tu tarde y no le prestas atención: el almuerzo. Comes cualquier cosa, rápido, frente a la pantalla, y a las cuatro te preguntas por qué no puedes pensar. No es la edad ni la agenda. Es lo que hiciste a la una.',
    accion: 'Hoy come sentado, sin pantalla, y que el plato tenga proteína y verduras. Después anota cómo estuvo tu foco entre las tres y las seis.'
  },
  {
    dia: 47, titulo: 'Lo que tomas sin pensar', duracion: '8 min',
    senal: 'Entre el café, las bebidas del mediodía y lo que hay en la heladera de la oficina, entra una cantidad de azúcar que nunca contaste porque ninguna de esas veces fue una comida. Los picos y las caídas que eso produce se sienten exactamente igual que el agotamiento, y por eso los confundiste durante años.',
    accion: 'Escribe todo lo que tomaste ayer además de agua. Hoy reemplaza la mitad por agua y fíjate en cómo llegas a las seis de la tarde.'
  },
  {
    dia: 48, titulo: 'Los días que no quieres', duracion: '10 min',
    senal: 'Todo esto funciona hasta el primer día malo, y el primer día malo llega siempre. La diferencia entre el que sostiene y el que abandona no es la fuerza de voluntad: es tener decidido de antemano qué hace en ese día, cuando no tiene ganas de decidir nada.',
    accion: 'Escribe tu versión mínima de cada cosa: la caminata mínima, la comida mínima, el Apagado mínimo. Esa es la que haces los días malos, y cuenta igual.'
  },
  {
    dia: 49, titulo: 'El cuerpo vuelve al equipo', maestro: true, duracion: '10 min',
    senal: '"Siete semanas. Lo que hiciste esta semana no fue ponerte en forma: fue devolverle al cuerpo el lugar que tenía antes de que empezaras a usarlo como un medio de transporte. Y fíjate en algo: ninguna de estas cinco cosas te pidió una hora libre que no tienes. Caminar, comer sentado, tomar agua, hacer fuerza dos veces, tener una versión mínima. Eso es todo, y es lo que te va a sostener los próximos veinte años." — Javo',
    accion: 'Compara tu energía al despertar de esta semana con la de la semana 1. Escribe el número de las dos y la diferencia.'
  },
  {
    dia: 50, titulo: 'Las tres horas que valen', duracion: '10 min',
    senal: 'En un día de doce horas hay unas tres en las que produces lo que realmente mueve tu negocio. Las otras nueve son sostenimiento. El problema no es que existan las nueve: es que las tres están repartidas entre ellas, en pedazos de quince minutos, y ahí no se piensa nada bueno.',
    accion: 'Mira tu última semana y escribe en qué franja horaria hiciste el trabajo que más valor produjo. Sé específico: días y horas.'
  },
  {
    dia: 51, titulo: 'El bloque protegido', duracion: '10 min',
    senal: 'Esa franja tiene que dejar de ser una casualidad. Si no está en el calendario con nombre, alguien la va a ocupar, y ese alguien casi siempre eres tú aceptando una reunión.',
    accion: 'Pon en tu calendario dos bloques de noventa minutos en tu mejor franja, esta semana, con un nombre concreto. Durante esos bloques el teléfono queda lejos y la puerta cerrada.',
    variante: 'Si dos bloques es imposible, pon uno. Un bloque cumplido vale más que tres agendados.'
  },
  {
    dia: 52, titulo: 'La reunión que no existe', duracion: '12 min',
    senal: 'Toda empresa tiene al menos una reunión que se sigue haciendo porque se venía haciendo. Nadie la defiende y nadie la cancela. Suele ser semanal, suele durar una hora, y suele estar llena de personas que podrían estar produciendo.',
    accion: 'Elige una reunión recurrente de tu semana y cancélala o redúcela a la mitad. Avísalo hoy, con la frase del día 31: corta y sin justificación larga.'
  },
  {
    dia: 53, titulo: 'La segunda devolución', duracion: '20 min',
    senal: 'En el día 34 entregaste una tarea. Hoy va la segunda, y esta es la que cuenta de verdad, porque la primera se puede hacer con entusiasmo y la segunda solo se hace si el sistema funciona.',
    accion: 'Toma otra cruz de tu lista del día 13 y entrégala. Enseña una vez, define el resultado esperado y fija cuándo lo revisan. Y revisa cómo va la primera.',
    variante: 'Si la primera volvió a tus manos, eso es lo que hay que trabajar hoy, no la segunda. Llévalo a tu consulta.'
  },
  {
    dia: 54, titulo: 'Decidir en el día', duracion: '10 min',
    senal: 'Las decisiones que no tomas no desaparecen: se quedan abiertas consumiendo capacidad, y son la razón por la que terminas el día cansado sin haber hecho nada pesado. El día 3 de tu chequeo medía exactamente esto.',
    accion: 'Haz la lista de las decisiones que tienes abiertas. Elige las tres más chicas y ciérralas hoy, aunque la respuesta no sea perfecta. Una decisión mediana tomada rinde más que una excelente pendiente.'
  },
  {
    dia: 55, titulo: 'Medio día sin ti', duracion: '5 min',
    senal: 'Una empresa que no puede funcionar media jornada sin ti no es una empresa: es un empleo que te compraste y del que no te puedes ir. Esto no se arregla pensándolo. Se arregla probándolo, en chico, y viendo qué se rompe.',
    accion: 'Elige una franja de cuatro horas de esta semana y avisa que en ese rato no estás disponible. Cuando vuelvas, anota qué pasó de verdad y qué se resolvió sin ti.'
  },
  {
    dia: 56, titulo: 'Tu empresa deja de depender de tu resistencia', maestro: true, duracion: '10 min',
    senal: '"Ocho semanas. Delegaste dos veces, cancelaste una reunión, cerraste decisiones y desapareciste medio día sin que se cayera nada. Quiero que registres lo que eso significa, porque es más grande de lo que parece: tu empresa dejó de depender de que aguantes. Mientras dependía de eso, cualquier cosa que te pasara a ti le pasaba a ella." — Javo',
    accion: 'Cuenta las horas que te devolvieron el bloque protegido, la reunión cancelada y la tarea delegada. Escribe el número y en qué las usaste realmente.'
  },
  {
    dia: 57, titulo: 'Con quién quieres llegar', duracion: '10 min',
    senal: 'Trabajaste ocho semanas para tener energía y horas. Ahora viene la pregunta que decide para qué sirvió todo esto: con quién las vas a usar. Porque el agotamiento tiene una característica silenciosa y es que a las personas que más quieres les tocó siempre lo que sobraba.',
    accion: 'Escribe los nombres de las tres personas con las que quieres llegar al final de tu vida. Al lado de cada uno, cuánto tiempo real y presente le diste el mes pasado.'
  },
  {
    dia: 58, titulo: 'La hora sin pantalla', duracion: '10 min',
    senal: 'Estar en la misma habitación no es estar con alguien. Tu chequeo lo midió el primer día: cuando estás con las personas que amas, tu cabeza sigue en el trabajo. Para ellos eso no se ve como que estás ocupado: se ve como que no estás.',
    accion: 'Hoy, una hora con una de esas personas, con el teléfono en otra habitación. Sin plan y sin conversación importante. Solo estar.'
  },
  {
    dia: 59, titulo: 'La pregunta que no hiciste', duracion: '15 min',
    senal: 'Sabes lo que les pasa por arriba. No sabes lo que les pasa por adentro, porque hace mucho que no preguntas de verdad, y ellos dejaron de contarte para no sumarte peso. Eso pasó despacio y por cuidarte.',
    accion: 'Elige a una de esas personas y hazle una pregunta que no le hiciste nunca. Escucha sin resolver nada: no eres su director, eres su persona.'
  },
  {
    dia: 60, titulo: 'El dolor y lo que le agregas', duracion: '10 min',
    senal: 'Hay una distinción vieja, la dijeron muchos maestros de tradiciones distintas, y es de lo más útil que existe para alguien como tú: el dolor es lo que pasa, el sufrimiento es lo que tu cabeza le agrega encima. El primero es inevitable. El segundo es discutible, y ahí sí puedes intervenir.',
    accion: 'Escribe una situación que te está pesando. Separa en dos columnas lo que efectivamente pasó y lo que tu cabeza le agregó: interpretaciones, futuros imaginados, culpas. Mira el tamaño de cada columna.'
  },
  {
    dia: 61, titulo: 'La conversación que debes', duracion: '20 min',
    senal: 'Todos los que llegan acá tienen una conversación pendiente, y casi siempre es con alguien de la lista del día 57. No la tuviste porque no encontraste el momento, y el momento nunca aparece: se fabrica.',
    accion: 'Ten esa conversación hoy. Empieza sin reproche y con una sola frase honesta sobre cómo estuviste tú. No hace falta que quede resuelta; hace falta que empiece.',
    variante: 'Si la persona no está disponible, o no está, escríbele la carta igual. Lo que se dice de verdad cambia al que lo dice, aunque nadie lo lea.'
  },
  {
    dia: 62, titulo: 'Algo en el calendario', duracion: '8 min',
    senal: 'Las buenas intenciones con la familia no sobreviven a una semana complicada. Lo que sobrevive es lo que está agendado, tiene hora y otra persona lo espera.',
    accion: 'Agenda dos cosas con esas personas: una esta semana y una dentro de un mes. Con hora, y avisadas. No tienen que ser grandes.'
  },
  {
    dia: 63, titulo: 'Las personas te vieron volver', maestro: true, duracion: '10 min',
    senal: '"Nueve semanas. Esta es la parte que no aparece en ningún número de la app y es la que más va a importar dentro de diez años. Nadie llega al final de su vida contando reuniones. Lo que estuviste haciendo estas tres semanas es la única razón por la que vale la pena tener energía: para dársela a alguien." — Javo',
    accion: 'Pregúntale a una de esas tres personas si notó algo distinto en las últimas semanas. Escribe lo que te diga, textual.'
  },
  {
    dia: 64, titulo: 'Lo que se queda', duracion: '10 min',
    senal: 'Diez semanas instalando cosas. No todas se van a sostener el año que viene, y está bien: no hace falta que se sostengan todas. Hacen falta tres que no se negocien nunca más, ni en la peor semana, ni con el mejor argumento.',
    accion: 'Mira todo lo que instalaste desde el día 1 y elige tres. Solo tres. Escríbelas.',
  },
  {
    dia: 65, titulo: 'Escritos como reglas', duracion: '10 min',
    senal: 'Una intención se negocia; una regla no. La diferencia está en cómo está escrita: intentar dormir mejor no es una regla, apagar a las once es una regla. Lo que se puede interpretar se termina interpretando a favor del cansancio.',
    accion: 'Reescribe tus tres como reglas: con hora, con número y sin adverbios. Nada de más, mejor, en lo posible. Léelas en voz alta: si alguna se puede interpretar, todavía no es una regla.',
  },
  {
    dia: 66, titulo: 'Dichos en voz alta', duracion: '15 min',
    senal: 'Un innegociable que solo conoces tú dura hasta el primer martes complicado. Cuando otras personas lo saben pasan dos cosas: te cuesta más romperlo y ellas dejan de pedirte lo que va en contra.',
    accion: 'Dile tus tres reglas a las personas a las que les afectan: tu pareja, tu equipo, tu socio. No pidas permiso: informa, con la frase corta del día 31.',
  },
  {
    dia: 67, titulo: 'La primera prueba', duracion: '8 min',
    senal: 'Esta semana algo va a chocar con una de tus reglas. No es mala suerte: es lo normal, y es la única forma de saber si son reglas de verdad. La primera vez que la sostienes delante de otra persona, tu regla se vuelve real para todos.',
    accion: 'Cuando aparezca el choque, sostén la regla y anota qué pasó: quién pidió, qué dijiste y cuál fue la consecuencia real.',
  },
  {
    dia: 68, titulo: 'Lo que pasa si la rompes', duracion: '8 min',
    senal: 'Vas a romper alguna, y conviene decidir ahora qué pasa entonces, cuando todavía estás tranquilo. Si no lo decides hoy, en el momento vas a elegir entre dos cosas malas: castigarte o hacer como si nada.',
    accion: 'Escribe qué haces si rompes una: no el castigo, la reparación. Qué acción concreta la vuelve a poner de pie al día siguiente.',
  },
  {
    dia: 69, titulo: 'El calendario que las sostiene', duracion: '12 min',
    senal: 'La voluntad se acaba todos los días alrededor de las seis de la tarde. Los sistemas no. Todo lo que quieras que sobreviva tiene que estar en algún lado que no seas tu memoria.',
    accion: 'Pon tus tres reglas en el calendario con repetición: la hora de cierre, los dos días de fuerza, el bloque protegido, lo que corresponda. Con alarma y con nombre.',
  },
  {
    dia: 70, titulo: 'Tres cosas que no se tocan', maestro: true, duracion: '10 min',
    senal: '"Diez semanas. Estas tres reglas son lo que queda cuando yo ya no esté mandándote una Dosis por día, y por eso son la parte más importante del camino. Lo que construimos hasta aquí se sostuvo porque había alguien empujando. Lo que sigue tiene que sostenerse solo." — Javo',
    accion: 'Escribe tus tres reglas en un lugar que veas todos los días. La pantalla de bloqueo sirve, la puerta de la heladera también.',
  },
  {
    dia: 71, titulo: 'Pedir antes del límite', duracion: '10 min',
    senal: 'Tu chequeo midió esto el primer día: con qué frecuencia pides ayuda antes de estar al límite. Pedir cuando ya explotaste no es pedir ayuda, es pedir rescate, y llega tarde para todos. La diferencia entre las dos cosas son unas tres semanas.',
    accion: 'Escribe las tres señales que aparecen cuando estás llegando al límite. Las tuyas, las de este año: cómo duermes, cómo hablas, qué dejas de hacer.',
  },
  {
    dia: 72, titulo: 'Quién está de tu lado', duracion: '10 min',
    senal: 'Nadie sostiene esto solo, y los que llegan al año son siempre los que tienen a alguien mirando. No hace falta un grupo: hace falta una persona que sepa cómo estás de verdad.',
    accion: 'Escribe el nombre de una persona que pueda saber cómo estás realmente, cada semana. Puede ser alguien de tu familia, un amigo, un colega o un profesional.',
  },
  {
    dia: 73, titulo: 'El pedido concreto', duracion: '10 min',
    senal: 'Los pedidos vagos no se pueden cumplir. Si dices necesito que me acompañes, el otro no sabe qué hacer y termina sin hacer nada, y tú concluyes que no hay nadie. Había, pero no sabía qué hacías falta.',
    accion: 'Pídele hoy algo concreto a esa persona: que te pregunte cómo dormiste una vez por semana, que te avise cuando te vea acelerado, lo que necesites. Con frecuencia y con palabras exactas.',
  },
  {
    dia: 74, titulo: 'Recibir sin devolver', duracion: '8 min',
    senal: 'Cuando alguien te da algo, devuelves enseguida: un favor, un pago, una invitación. Parece generosidad y muchas veces es lo contrario: es no tolerar quedar en deuda, porque el que debe no es el que puede con todo. Devolver rápido es una forma elegante de no recibir.',
    accion: 'Hoy alguien te va a dar algo: tiempo, atención, un favor. Recíbelo, di gracias, y no devuelvas nada. Fíjate qué te pasa en el cuerpo.',
  },
  {
    dia: 75, titulo: 'Cuando el caos vuelva', duracion: '12 min',
    senal: 'Va a volver. Un cierre de año, una crisis, un socio que se va, alguien que se enferma. No estamos construyendo una vida sin caos: estamos construyendo a alguien que atraviesa el caos sin perderse adentro.',
    accion: 'Escribe qué pasa con tus tres reglas cuando llegue una semana así. Cuáles se sostienen igual y cuál se suspende con fecha de vuelta. Decidirlo hoy es lo que evita que se caigan todas juntas.',
  },
  {
    dia: 76, titulo: 'Tu plan en una página', duracion: '15 min',
    senal: 'Todo lo que aprendiste en once semanas tiene que caber en una página que puedas leer en un minuto malo. Si no cabe, en el minuto malo no la vas a leer.',
    accion: 'Escribe una página con cuatro cosas: tus tres señales de límite, tus tres reglas, el nombre de tu persona y la primera acción que haces cuando reconoces una señal. Guárdala donde la encuentres rápido.',
  },
  {
    dia: 77, titulo: 'Ya no dependes de tu voluntad', maestro: true, duracion: '10 min',
    senal: '"Once semanas. Tienes reglas escritas, alguien que te mira, señales que reconoces y un plan para el día que se complique. Eso es un sistema, y un sistema es lo único que funciona cuando la motivación no está. La motivación va a faltar muchas veces: no es un defecto tuyo, es cómo funciona." — Javo',
    accion: 'Lee tu página completa una vez y corrige lo que no sea exacto. Después mándasela a la persona del día 72.',
  },
  {
    dia: 78, titulo: 'Para qué lideras', duracion: '12 min',
    senal: 'Última semana. La primera medida de tu Tablero pregunta con qué frecuencia lo que haces te acerca a algo que elegiste tú, y es la que está arriba de todas las demás por una razón: sin eso, las otras nueve son un motor muy bueno girando sin destino.',
    accion: 'Escribe para qué lideras. No la respuesta que dirías en una entrevista: la que dirías a las dos de la mañana. Tres líneas alcanzan.',
  },
  {
    dia: 79, titulo: 'La carta al Personaje', duracion: '15 min',
    senal: 'En la semana 6 le pusiste nombre. No se trata de matarlo: te sirvió durante años y te trajo hasta aquí. Se trata de darle el lugar que le corresponde, que es adentro y a tu servicio, no manejando.',
    accion: 'Escríbele una carta. Agradécele lo que hizo por ti, dile qué le vas a seguir pidiendo y en qué situaciones ya no lo necesitas.',
  },
  {
    dia: 80, titulo: 'Lo que escribiste el primer día', duracion: '12 min',
    senal: 'El Día 0 escribiste dónde ibas a estar dentro de un año si no cambiaba nada. Lo escribiste tú, con tus palabras, cuando todavía no sabías nada de todo esto.',
    accion: 'Abre tu chequeo del Día 0 y lee lo que escribiste. Después escribe, abajo, dónde estás hoy. Las dos cosas juntas en la misma hoja.',
  },
  {
    dia: 81, titulo: 'El martes a las siete', duracion: '10 min',
    senal: 'También escribiste una escena: un martes cualquiera a las siete de la tarde, doce semanas después. Hoy es el momento de compararla con tu vida real, sin maquillar para ningún lado.',
    accion: 'Lee tu escena y escribe qué parte ya está pasando, qué parte falta y qué vas a hacer con lo que falta.',
  },
  {
    dia: 82, titulo: 'A quién le enseñas esto', duracion: '10 min',
    senal: 'Hay algo que se sabe de cualquier aprendizaje: lo que enseñas se te queda de otra manera. Y además tienes alrededor a otros como eras tú hace tres meses, convencidos de que aguantar es parte del trabajo.',
    accion: 'Elige una sola cosa de estas doce semanas y enséñasela a alguien esta semana. Una conversación de diez minutos alcanza.',
  },
  {
    dia: 83, titulo: 'La víspera', duracion: '8 min',
    senal: 'Mañana vuelves a responder el mismo instrumento del primer día. No estudies para el examen y no vivas hoy distinto: el instrumento no mide tu mejor día, mide tus últimas semanas, y esas ya están hechas.',
    accion: 'Hoy no hay tarea nueva. Haz tu Apagado, registra tus Signos y duerme como cualquier noche.',
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
