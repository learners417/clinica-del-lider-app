/**
 * Eneagrama corto — herramienta de autoconocimiento, NO clínica ni predictiva.
 * El usuario elige hasta 3 afirmaciones con las que más se identifica.
 */
export const ENEAGRAMA_TIPOS: { tipo: number; nombre: string; afirmacion: string; espejo: string }[] = [
  { tipo: 1, nombre: 'El Perfeccionista', afirmacion: 'Me cuesta delegar porque nadie lo hace tan bien como yo.', espejo: 'Tu exigencia te trajo hasta acá — y también es lo que te está fundiendo. El descanso no es un premio: es parte del trabajo bien hecho.' },
  { tipo: 2, nombre: 'El Ayudador', afirmacion: 'Me cuesta pedir ayuda; prefiero que me necesiten a mí.', espejo: 'Das para sentirte valioso. El protocolo te va a pedir algo incómodo: recibir.' },
  { tipo: 3, nombre: 'El Triunfador', afirmacion: 'Si no estoy logrando algo, siento que no valgo.', espejo: 'Confundes rendir con valer. Por eso este lugar mide tu recuperación — para que el logro juegue a tu favor.' },
  { tipo: 4, nombre: 'El Individualista', afirmacion: 'Siento que nadie entiende del todo lo que me pasa.', espejo: 'Tu profundidad es un don. La tribu existe para que dejes de cargarla en soledad.' },
  { tipo: 5, nombre: 'El Observador', afirmacion: 'Me recargo aislándome; la gente me drena.', espejo: 'Saber no es lo mismo que vivir. El cuerpo también es una fuente de datos.' },
  { tipo: 6, nombre: 'El Leal', afirmacion: 'Antes de decidir, anticipo todo lo que puede salir mal.', espejo: 'Tu radar de riesgos protege a todos menos a ti. Vamos a entrenar la confianza con evidencia.' },
  { tipo: 7, nombre: 'El Entusiasta', afirmacion: 'Lleno la agenda de planes para no sentir lo incómodo.', espejo: 'La velocidad es tu anestesia. Frenar te va a doler primero y a liberar después.' },
  { tipo: 8, nombre: 'El Desafiador', afirmacion: 'Mostrar vulnerabilidad me parece peligroso.', espejo: 'Tu fuerza sostiene a muchos. Acá no tienes que sostener nada: por eso funciona.' },
  { tipo: 9, nombre: 'El Pacificador', afirmacion: 'Evito el conflicto aunque el costo lo pague yo.', espejo: 'Tu calma tiene un precio oculto: tú. Poner límites también es cuidar la paz.' },
];
