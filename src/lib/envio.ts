/**
 * Enviar a mi terapeuta — mientras los datos viven en el teléfono, el Árbol
 * y la Jugada viajan por WhatsApp como texto. Cuando la ficha esté en la nube,
 * este envío se reemplaza por la ficha del terapeuta.
 *
 * El texto del Árbol es lo que el terapeuta lee el lunes a la noche para
 * preparar el martes: lleva las tres marcas de la escena (quién, qué edad, la
 * frase textual) porque sin ellas lo que llegó es una réplica, y eso se decide
 * antes de la sesión, no durante.
 */
import { modoArbol, type Iceberg, type Jugada } from './estadoCdl';
import { linkWhatsApp } from './semana';
import { WHATSAPP_TERAPEUTA } from '../data/config';

function fechaLarga(iso: string): string {
  return new Date(iso + 'T12:00:00').toLocaleDateString('es', { weekday: 'long', day: 'numeric', month: 'long' });
}

const marca = (t?: string) => (t === 'bloquea' ? ' · bloquea' : t === 'desbloquea' ? ' · desbloquea' : '');

export function textoIceberg(i: Iceberg, nombre = ''): string {
  const l: string[] = [];
  const firma = `${nombre ? ` · ${nombre}` : ''} · ${fechaLarga(i.fecha)}`;

  if (modoArbol(i) === 'sembrar') {
    l.push(`*Mi Árbol sembrado*${firma}`);
    l.push('', `*El fruto:* ${i.bloqueo.trim()}`);
    if (i.verdad?.trim()) l.push(`*La verdad que lo sostuvo:* ${i.verdad.trim()}`);
    if (i.beneficio?.trim()) l.push(`*Lo que gané:* ${i.beneficio.trim()}`);
    if (i.amor?.trim()) l.push('', `*Abajo de todo:* ${i.amor.trim()}`);
    if (!i.cerrado) l.push('', '_Sin terminar._');
    return l.join('\n');
  }

  const ms = (i.mentiras ?? [i.mentira]).map((m, k) => m.trim() && `${k === i.fuerte ? '★ ' : '• '}${m.trim()}${marca(i.test?.[`m${k}`])}`).filter(Boolean);
  l.push(`*Mi Árbol*${firma}`);
  l.push('', `*El fruto:* ${i.bloqueo.trim()}`);
  if (ms.length) l.push('', '*Las mentiras:*', ...ms);
  if (i.beneficio?.trim()) l.push('', `*Lo que gano creyéndola:* ${i.beneficio.trim()}`);
  if (i.miedo.trim()) l.push('', `*El miedo:* ${i.miedo.trim()}`);
  if (i.dolor.trim()) l.push(`*El dolor:* ${i.dolor.trim()}`);
  if (i.origen?.trim() || i.quien?.trim()) {
    const marcas = [i.quien?.trim(), i.edad ? `a los ${i.edad}` : ''].filter(Boolean).join(' · ');
    l.push('', `*La raíz${marcas ? ` (${marcas})` : ''}:* ${i.origen?.trim() ?? ''}`);
    if (i.frase?.trim()) l.push(`*Lo que se dijo ahí:* “${i.frase.trim()}”`);
  }
  if (i.perdon.trim()) l.push(`*Lo que le digo:* ${i.perdon.trim()}`);
  if (i.hecho?.trim()) {
    l.push('', `*La prueba de este mes:* ${i.hecho.trim()}`);
    if (i.antes && i.despues) l.push(`*Cuánto creo la frase:* ${i.antes}/10 antes · ${i.despues}/10 dichas las dos juntas`);
  }
  if (i.verdad?.trim()) l.push('', `*El permiso:* ${i.verdad.trim()}${marca(i.test?.verdad)}`);
  if (!i.cerrado) l.push('', '_Sin terminar: me trabé en esta capa._');
  return l.join('\n');
}

export function textoJugada(j: Jugada, nombre = ''): string {
  return [
    `*Mi Jugada*${nombre ? ` · ${nombre}` : ''} · ${fechaLarga(j.fecha)}`,
    '', `*Lo que entrego:* ${j.que.trim()}`,
    `*La evidencia:* ${j.evidencia.trim()}`,
  ].join('\n');
}

export function abrirWhatsApp(texto: string): void {
  window.open(linkWhatsApp(texto, WHATSAPP_TERAPEUTA), '_blank', 'noopener');
}
