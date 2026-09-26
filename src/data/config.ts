/** Configuración editable de la clínica — un solo lugar. */
export const LINK_PAGO_33 = '';        // URL del botón PayPal de APAGA LA CABEZA ($33). Vacío = muestra aviso.
export const LINK_WORKSHOP = '';       // URL del Zoom del vivo (se comparte por WhatsApp igualmente).
export const LINK_PAGO_333 = '';       // (evergreen) botón PayPal de El Reinicio. Vacío = aviso + código.
export const LINK_PAGO_999 = '';       // (evergreen) botón PayPal del Acompañado. Vacío = aviso + código.
export const PRECIO_APAGA = 33;
export const PRECIO_REINICIO = 333;
export const PRECIO_ACOMP = 999;

/** AUDIOS de Javo — pegar la URL (mp3/m4a hosteado) y aparecen solos en la app. Vacío = no se muestra. */
export const AUDIOS = {
  apagado: '',      // EL APAGADO (8-10 min) — se ofrece en todas las Noches y en las Dosis de sueño
  despliegue: '',   // EL DESPLIEGUE (2 min de movilidad) — Dosis de cuerpo (semana 7 en adelante)
  pausa3: '',       // LA PAUSA DE 3' guiada — Botiquín
  senal: '',        // LA SEÑAL (5 min de quietud) — desde Fase A
  carta: '',        // LA CARTA guiada — día 79
};

/** VIDEOS de Javo (YouTube no listado / Wistia) — por día del Tratamiento. Vacío = no se muestra. */
export const VIDEOS: Record<number, string> = {
  1: '',   // Bienvenida + apertura de VER
  15: '',  // Apertura de INTERRUMPIR
  43: '',  // Apertura de TRANSFORMAR — arranca el viaje dos
  64: '',  // Apertura de ANCLAR
  78: '',  // Apertura de LIDERARTE
  84: '',  // El Alta
};

/** WhatsApp del terapeuta (solo números, con código de país). Vacío = el paciente elige el contacto. */
export const WHATSAPP_TERAPEUTA = '';

/** VIDEOS DE EL EJE — los 18 de la Hoja de Ruta v2. Pegar la URL y aparecen solos. Vacío = no se muestra. */
export const VIDEOS_EJE: Record<string, string> = {
  bienvenida: '',   // Día 0, antes del Chequeo · 3 min
  iceberg: '',      // Herramienta · día 1 · 3 min
  freno: '',        // Herramienta · día 1 · 3 min
  descarga: '',     // Herramienta · día 8 · 3 min
  semana1: '', semana2: '', semana3: '', semana4: '', semana5: '', semana6: '',
  semana7: '', semana8: '', semana9: '', semana10: '', semana11: '', semana12: '',
  medicion42: '',   // antes del Tablero del día 42 · 2 min
  medicion84: '',   // antes del Tablero del día 84 · 2 min
};

/**
 * Ayuda urgente — lo que se muestra en "Si esto te desborda" y en el consentimiento.
 * Si trabajas con un solo país, pon acá su número de emergencias o su línea de crisis
 * (ejemplo: 'En Chile, llama al *4141'). Vacío = texto general para todos los países.
 */
export const AYUDA_URGENTE = '';
