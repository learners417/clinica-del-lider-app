/**
 * Enviar a mi terapeuta — mientras los datos viven en el teléfono, el Iceberg
 * y la Jugada viajan por WhatsApp como texto. Cuando la ficha esté en la nube,
 * este envío se reemplaza por la ficha del terapeuta.
 */
import type { Iceberg, Jugada } from './estadoCdl';
import { linkWhatsApp } from './semana';
import { WHATSAPP_TERAPEUTA } from '../data/config';

function fechaLarga(iso: string): string {
  return new Date(iso + 'T12:00:00').toLocaleDateString('es', { weekday: 'long', day: 'numeric', month: 'long' });
}

const marca = (t?: string) => (t === 'bloquea' ? ' · bloquea' : t === 'desbloquea' ? ' · desbloquea' : '');

export function textoIceberg(i: Iceberg, nombre = ''): string {
  const ms = (i.mentiras ?? [i.mentira]).map((m, k) => m.trim() && `${k === i.fuerte ? '★ ' : '• '}${m.trim()}${marca(i.test?.[`m${k}`])}`).filter(Boolean);
  const l: string[] = [];
  l.push(`*Mi Iceberg*${nombre ? ` · ${nombre}` : ''} · ${fechaLarga(i.fecha)}`);
  l.push('', `*Lo que se ve:* ${i.bloqueo.trim()}`);
  if (ms.length) l.push('', '*Las mentiras:*', ...ms);
  if (i.miedo.trim()) l.push('', `*El miedo:* ${i.miedo.trim()}`);
  if (i.dolor.trim()) l.push(`*El dolor:* ${i.dolor.trim()}`);
  if (i.origen?.trim()) l.push('', `*El origen${i.edad ? ` (a los ${i.edad})` : ''}:* ${i.origen.trim()}`);
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
