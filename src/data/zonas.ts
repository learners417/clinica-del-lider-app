/**
 * Zonas Vitales — la progresión propia de CdL.
 * v0: la Zona sale del promedio CBI. Con protocolo activo, avanzar de Zona
 * exigirá además hitos con evidencia (fase 2).
 */
export type ZonaId = 'roja' | 'naranja' | 'amarilla' | 'verde' | 'azul';

export interface Zona {
  id: ZonaId;
  nombre: string;
  color: string;
  rango: string;
  descripcion: string;
}

export const ZONAS: Zona[] = [
  { id: 'roja', nombre: 'Zona Roja', color: 'var(--zona-roja)', rango: 'CBI 65-100', descripcion: 'Agotamiento alto y sostenido. Así llegan casi todos. No es debilidad: es la consecuencia lógica de cómo estás viviendo. De acá se sale — medido, con protocolo.' },
  { id: 'naranja', nombre: 'Zona Naranja', color: 'var(--zona-naranja)', rango: 'CBI 50-64', descripcion: 'El desgaste todavía manda, pero ya hay grietas de luz. El foco: sueño y cortar lo que drena.' },
  { id: 'amarilla', nombre: 'Zona Amarilla', color: 'var(--zona-amarilla)', rango: 'CBI 40-49', descripcion: 'Zona de transición. El cuerpo empieza a responder. El riesgo acá es aflojar antes de anclar.' },
  { id: 'verde', nombre: 'Zona Verde', color: 'var(--zona-verde)', rango: 'CBI 25-39', descripcion: 'Energía estable, conexiones vivas. Ahora se ancla: rituales, límites y evidencia.' },
  { id: 'azul', nombre: 'Zona Azul', color: 'var(--zona-azul)', rango: 'CBI 0-24', descripcion: 'Rendimiento pleno y sostenible. El alta está disponible: te lideras a ti mismo.' },
];

export function zonaDesdeCbi(promedio: number): Zona {
  if (promedio >= 65) return ZONAS[0];
  if (promedio >= 50) return ZONAS[1];
  if (promedio >= 40) return ZONAS[2];
  if (promedio >= 25) return ZONAS[3];
  return ZONAS[4];
}
