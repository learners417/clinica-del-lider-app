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
  despliegue: '',   // EL DESPLIEGUE (2 min de movilidad) — Dosis de cuerpo (D31+)
  pausa3: '',       // LA PAUSA DE 3' guiada — Botiquín
  senal: '',        // LA SEÑAL (5 min de quietud) — desde Fase A
  carta: '',        // LA CARTA guiada — D81
};

/** VIDEOS de Javo (YouTube no listado / Wistia) — por día del Tratamiento. Vacío = no se muestra. */
export const VIDEOS: Record<number, string> = {
  1: '',   // Bienvenida + apertura de VER
  11: '',  // Apertura de INTERRUMPIR
  31: '',  // Apertura de TRANSFORMAR
  61: '',  // Apertura de ANCLAR
  81: '',  // Apertura de LIDERARTE
  90: '',  // El Alta
};
