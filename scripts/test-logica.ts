/** Tests de la lógica clínica de CdL. Corre con esbuild+node (npm run test:logica). */
import { CBI_ITEMS, calcularCbi } from '../src/data/cbi';
import { calcularPhq9, PHQ9_ITEMS } from '../src/data/phq9';
import { zonaDesdeCbi } from '../src/data/zonas';
import {
  rachaDesde, normalizarIceberg, firmarConsentimiento, getConsentimiento, registrarDescarga, listarDescargas,
  guardarColumnas, listarColumnas, alGuardar, CLAVES,
  guardarIceberg, listarIcebergs, modoArbol, resumenEscena, raicesAbiertas, esperandoHecho, yuxtaponerEn,
  getAncla, setAncla, armarRespaldo, diaDelProtocolo, fechaUltimoDia,
} from '../src/lib/estadoCdl';
import { textoIceberg } from '../src/lib/envio';
import { completo, primerPasoPendiente, pasosDe, PASOS_LIMPIAR, PASOS_SEMBRAR, CAPAS } from '../src/pages/Iceberg';
import { planSync, SINCRONIZADAS } from '../src/lib/sync';
import { TOTAL_DIAS, HITO_MEDIO, HITO_CONTRATO } from '../src/data/camino';
import { barandillaPendiente, aTiempo, promedio } from '../src/lib/ficha';
import { proximoDia, ventanaEntrega, entregadoEnVentana, urlCalendario, linkWhatsApp, isoLocal } from '../src/lib/semana';

let fallos = 0;
function ok(cond: boolean, msg: string) {
  if (cond) { console.log('  ✓', msg); } else { fallos++; console.error('  ✗ FALLO:', msg); }
}

console.log('CBI:');
{
  // Todo "Siempre" (100): el ítem invertido t4 debe restar → trabajo < 100
  const todas100 = Object.fromEntries(CBI_ITEMS.map(i => [i.id, 100]));
  const r = calcularCbi(todas100);
  ok(r.personal === 100, 'personal=100 con todas "Siempre"');
  ok(r.trabajo === Math.round((6 * 100 + 0) / 7), `trabajo=${r.trabajo} refleja el ítem invertido (energía para familia)`);
  ok(r.equipo === 100, 'equipo=100');
  // Todo "Nunca" (0): invertido suma → trabajo > 0
  const todas0 = Object.fromEntries(CBI_ITEMS.map(i => [i.id, 0]));
  const r0 = calcularCbi(todas0);
  ok(r0.personal === 0 && r0.equipo === 0, 'personal y equipo = 0 con todas "Nunca"');
  ok(r0.trabajo === Math.round(100 / 7), `trabajo=${r0.trabajo} (solo el invertido puntúa)`);
  ok(r0.promedio === Math.round((0 + r0.trabajo + 0) / 3), 'promedio bien calculado');
}

console.log('PHQ-9:');
{
  const base = Object.fromEntries(PHQ9_ITEMS.map(i => [i.id, 0]));
  ok(calcularPhq9(base).derivar === false, 'todo 0 → no deriva');
  const catorce = calcularPhq9({ ...base, q1: 3, q2: 3, q3: 3, q4: 3, q5: 2 });
  ok(catorce.total === 14 && catorce.derivar === false, 'total 14 → no deriva (umbral es 15)');
  const quince = calcularPhq9({ ...base, q1: 3, q2: 3, q3: 3, q4: 3, q5: 3 });
  ok(quince.total === 15 && quince.derivar === true, 'total 15 → deriva');
  const item9 = calcularPhq9({ ...base, q9: 1 });
  ok(item9.derivar === true && item9.motivoItem9 === true, 'ítem 9 > 0 → deriva SIEMPRE, aun con total bajo');
}

console.log('Zonas:');
{
  ok(zonaDesdeCbi(100).id === 'roja' && zonaDesdeCbi(65).id === 'roja', 'CBI 65-100 → roja');
  ok(zonaDesdeCbi(64).id === 'naranja' && zonaDesdeCbi(50).id === 'naranja', 'CBI 50-64 → naranja');
  ok(zonaDesdeCbi(49).id === 'amarilla' && zonaDesdeCbi(40).id === 'amarilla', 'CBI 40-49 → amarilla');
  ok(zonaDesdeCbi(39).id === 'verde' && zonaDesdeCbi(25).id === 'verde', 'CBI 25-39 → verde');
  ok(zonaDesdeCbi(24).id === 'azul' && zonaDesdeCbi(0).id === 'azul', 'CBI 0-24 → azul');
}

console.log('Racha:');
{
  ok(rachaDesde([], '2026-07-12') === 0, 'sin entradas → 0');
  ok(rachaDesde(['2026-07-12'], '2026-07-12') === 1, 'solo hoy → 1');
  ok(rachaDesde(['2026-07-10', '2026-07-11', '2026-07-12'], '2026-07-12') === 3, '3 días seguidos → 3');
  ok(rachaDesde(['2026-07-10', '2026-07-11'], '2026-07-12') === 2, 'hoy sin registrar → racha viva desde ayer = 2');
  ok(rachaDesde(['2026-07-09', '2026-07-11', '2026-07-12'], '2026-07-12') === 2, 'hueco corta la racha');
  // Cruce de mes: 30/06 + 01/07 + 02/07
  ok(rachaDesde(['2026-06-29', '2026-06-30', '2026-07-01', '2026-07-02'], '2026-07-02') === 4, 'cruce de mes junio→julio → 4');
  // Cruce de año
  ok(rachaDesde(['2025-12-31', '2026-01-01'], '2026-01-01') === 2, 'cruce de año → 2');
}

console.log('La semana (martes adentro, jueves afuera):');
{
  const jue24 = new Date(2026, 8, 24, 10, 0);            // jueves 24 sep 2026
  ok(isoLocal(proximoDia(2, jue24)) === '2026-09-29', 'el próximo martes desde el jueves 24 es el 29');
  ok(isoLocal(proximoDia(4, jue24)) === '2026-09-24', 'el jueves cuenta como hoy');
  const vI = ventanaEntrega(2, jue24);
  ok(vI.desde === '2026-09-23' && vI.hasta === '2026-09-28', 'ventana del Iceberg: miércoles 23 a lunes 28');
  ok(vI.vence.getDate() === 28 && vI.vence.getHours() === 21, 'el Iceberg vence el lunes a las 21:00');
  const vJ = ventanaEntrega(4, new Date(2026, 8, 25));   // viernes 25
  ok(vJ.desde === '2026-09-25' && vJ.hasta === '2026-09-30', 'ventana de la Jugada: viernes 25 a miércoles 30');
  ok(entregadoEnVentana(['2026-09-27'], vI), 'un Iceberg del domingo cuenta para el martes');
  ok(!entregadoEnVentana(['2026-09-21'], vI), 'uno de la semana anterior no cuenta');
  ok(entregadoEnVentana(['2026-09-29'], vI), 'hecho el mismo martes, antes de la sesión, cuenta');
  const u = urlCalendario('Compromiso', 'detalle', new Date(Date.UTC(2026, 8, 30, 12, 0)), 30);
  ok(u.includes('dates=20260930T120000Z%2F20260930T123000Z'), 'el link del calendario lleva inicio y fin en UTC');
  ok(linkWhatsApp('hola mundo', '+54 9 294 000') === 'https://wa.me/549294000?text=hola%20mundo', 'WhatsApp limpia el número y codifica el texto');
}

console.log('Iceberg v2:');
{
  const viejo = { id: '1', fecha: '2026-09-20', bloqueo: 'x', mentira: 'no valgo', miedo: '', dolor: '', perdon: '', cerrado: true };
  const n = normalizarIceberg(viejo);
  ok(n.mentiras?.[0] === 'no valgo' && n.fuerte === 0, 'un Iceberg viejo abre con su mentira como la más fuerte');
  const nuevo = { ...viejo, mentiras: ['a', 'b'], fuerte: 1 };
  ok(normalizarIceberg(nuevo) === nuevo, 'uno nuevo no se toca');
}

console.log('Sincronización (lo más nuevo gana, clave por clave):');
{
  const p = planSync({ a: 100, b: 300 }, ['a', 'b', 'c'], { a: 200, b: 100, d: 50 });
  ok(p.bajar.includes('a') && p.bajar.includes('d'), 'baja lo que en la nube es más nuevo o no está en el teléfono');
  ok(p.subir.includes('b') && p.subir.includes('c'), 'sube lo más nuevo del teléfono y lo que la nube no tiene');
  ok(!p.subir.includes('a') && !p.bajar.includes('b'), 'nunca sube y baja la misma clave');
  const igual = planSync({ a: 100 }, ['a'], { a: 100 });
  ok(igual.bajar.length === 0 && igual.subir.length === 0, 'con la misma hora no se mueve nada');
  const viejo = planSync({}, ['a'], { a: 10 });
  ok(viejo.bajar[0] === 'a' && viejo.subir.length === 0, 'datos locales sin marca ceden ante la nube');
}

console.log('La ficha del terapeuta:');
{
  const ch = (fecha: string, derivar: boolean) => ({ fecha, phq9: { total: 5, derivar, motivoItem9: derivar } }) as never;
  ok(barandillaPendiente([ch('2026-09-15', true)], [])?.fecha === '2026-09-15', 'una derivación sin hablar aparece');
  ok(barandillaPendiente([ch('2026-09-15', true)], ['2026-09-15']) === null, 'hablada, desaparece');
  ok(barandillaPendiente([ch('2026-09-15', false)], []) === null, 'sin derivación no hay barandilla');
  const hoy = new Date(2026, 9, 14, 12);                   // miércoles 14 oct
  const r = aTiempo(['2026-09-28', '2026-10-05'], 2, hoy, '2026-09-15', 4);
  ok(r.total === 4 && r.hechas === 2, `Iceberg a tiempo: ${r.hechas} de ${r.total} (martes 22 y 29 sep, 6 y 13 oct)`);
  ok(aTiempo([], 2, hoy, '2026-10-10', 4).total === 1, 'antes de empezar no cuenta');
  ok(promedio([8, 9, NaN]) === 8.5 && promedio([]) === null, 'el promedio ignora lo vacío');
}

console.log('v1.3 · consentimiento, Descarga, columnas y lo que viaja a la nube:');
{
  const mem = new Map<string, string>();
  (globalThis as unknown as { localStorage: Storage }).localStorage = {
    getItem: (k: string) => mem.get(k) ?? null,
    setItem: (k: string, v: string) => { mem.set(k, String(v)); },
    removeItem: (k: string) => { mem.delete(k); },
    clear: () => mem.clear(), key: () => null, length: 0,
  } as Storage;

  ok(getConsentimiento() === null, 'sin firmar, no hay consentimiento');
  firmarConsentimiento('  Maxi Diez ');
  const c = getConsentimiento();
  ok(c !== null && c.nombre === 'Maxi Diez' && c.version >= 1, 'firmado queda con nombre, fecha y versión');

  const escritas: string[] = [];
  alGuardar((k) => escritas.push(k));
  registrarDescarga(); registrarDescarga();
  ok(listarDescargas().length === 2, 'cada Descarga deja solo su día');
  ok(escritas.filter((k) => k === CLAVES.descargas).length === 2, 'cada Descarga avisa para subir a la nube');
  alGuardar(null);

  guardarColumnas({ fecha: '2026-10-27', dia: 42, recibir: 'a', demi: 'b' });
  guardarColumnas({ fecha: '2026-10-28', dia: 42, recibir: 'a2', demi: 'b2' });
  guardarColumnas({ fecha: '2026-12-08', dia: 84, recibir: 'c', demi: 'd' });
  const cols = listarColumnas();
  ok(cols.length === 2 && cols[0].recibir === 'a2' && cols[1].dia === 84, 'una fila por medición, la última gana, en orden');

  ok([CLAVES.consentimiento, CLAVES.descargas, CLAVES.columnas, CLAVES.testimonio].every((k) => SINCRONIZADAS.includes(k)), 'lo nuevo sube a la cuenta');
  ok(!SINCRONIZADAS.includes(CLAVES.lineas), 'las líneas de la semana bajan del terapeuta, no se suben');
  ok(!SINCRONIZADAS.includes(CLAVES.clinicoChat) && !SINCRONIZADAS.includes(CLAVES.borrador), 'el chat del Clínico y el borrador se quedan en el teléfono');

  console.log('\nEl Árbol v4 · los dos sentidos y las tres marcas de la escena:');
  // Sigue corriendo con el localStorage de memoria de arriba.
  const limpiar = {
    id: 'a1', fecha: '2026-10-12', modo: 'limpiar' as const,
    bloqueo: 'No cobré las tres facturas de septiembre', mentira: 'Si cobro pierdo al cliente',
    mentiras: ['Si cobro pierdo al cliente'], fuerte: 0,
    beneficio: 'Me ahorro la cara del otro', miedo: '', dolor: '', perdon: '',
    origen: 'En la cocina, mi papá contando billetes', quien: 'papá', edad: 9,
    frase: 'Acá la plata no se habla', cerrado: false,
  };
  guardarIceberg(limpiar);
  ok(modoArbol(limpiar) === 'limpiar', 'un árbol sin modo declarado se limpia');
  ok(modoArbol({ ...limpiar, modo: 'sembrar' }) === 'sembrar', 'el modo sembrar se respeta');
  ok(resumenEscena(limpiar) === 'con papá · a los 9', 'la escena se resume con quién y a qué edad');
  ok(resumenEscena({ ...limpiar, quien: undefined, edad: undefined }) === '', 'sin persona ni edad no hay escena que mostrar');
  ok(raicesAbiertas().some((x) => x.id === 'a1'), 'un árbol abierto con escena es una raíz abierta: el Clínico la ve');
  ok(esperandoHecho().some((x) => x.id === 'a1'), 'sin hecho con fecha, el árbol espera uno');

  // Un fruto sembrado se carga como el hecho con fecha del árbol que se limpia.
  ok(yuxtaponerEn('a1', 'El 9 de octubre le cobré a Rodrigo y siguió siendo cliente'), 'el fruto sembrado se carga en el árbol elegido');
  ok(!yuxtaponerEn('no-existe', 'x'), 'no se carga en un árbol que no existe');
  const conHecho = listarIcebergs().find((x) => x.id === 'a1');
  ok(conHecho?.hecho?.startsWith('El 9 de octubre'), 'el hecho quedó guardado, sin tocar el resto del árbol');
  ok(conHecho?.origen === limpiar.origen && conHecho?.frase === limpiar.frase, 'la raíz y la frase textual no se pisan');
  ok(!esperandoHecho().some((x) => x.id === 'a1'), 'ya con hecho, deja de esperar');

  // El texto que el terapeuta lee el lunes a la noche.
  const txtL = textoIceberg(conHecho!, 'Maxi');
  ok(txtL.startsWith('*Mi Árbol* · Maxi'), 'el envío se llama Árbol y lleva el nombre');
  ok(txtL.includes('papá · a los 9') && txtL.includes('Acá la plata no se habla'),
    'el envío lleva las tres marcas: quién, qué edad y la frase textual');
  ok(txtL.includes('Lo que gano creyéndola'), 'el beneficio viaja como capa propia');
  ok(txtL.includes('Sin terminar'), 'un árbol abierto avisa que quedó a mitad');

  const sembrado = {
    id: 'a2', fecha: '2026-10-13', modo: 'sembrar' as const,
    bloqueo: 'Le cobré a Rodrigo el jueves', mentira: '', mentiras: [], miedo: '', dolor: '', perdon: '',
    verdad: 'Cobrar es parte del servicio', beneficio: 'Rodrigo pagó al día siguiente',
    amor: 'Me trato como alguien que vale lo que cobra', enlazado: 'a1', cerrado: true,
  };
  guardarIceberg(sembrado);
  const txtS = textoIceberg(sembrado, 'Maxi');
  ok(txtS.startsWith('*Mi Árbol sembrado*'), 'el árbol sembrado se envía como sembrado');
  ok(txtS.includes('*Abajo de todo:* Me trato como alguien que vale lo que cobra'), 'el amor propio viaja abajo de todo');
  ok(!txtS.includes('Las mentiras'), 'un árbol sembrado no inventa mentiras');
  ok(!esperandoHecho().some((x) => x.id === 'a2'), 'un árbol sembrado nunca espera un hecho: él es el hecho');

  // El ancla: la frase del consultante, textual, que el Clínico puede devolver.
  ok(getAncla() === '', 'sin ancla, cadena vacía');
  setAncla('  No soy el que no puede.  ');
  ok(getAncla() === 'No soy el que no puede.', 'el ancla se guarda sin espacios de sobra');
  const respaldo = armarRespaldo().datos;
  ok(respaldo[CLAVES.ancla] === 'No soy el que no puede.', 'el ancla entra en el respaldo');
  ok(Object.keys(respaldo).includes(CLAVES.iceberg), 'los árboles entran en el respaldo');

  console.log('\nEl recorrido del Árbol · qué deja pasar cada pantalla:');
  ok(PASOS_LIMPIAR.length === 14 && PASOS_SEMBRAR.length === 5, 'catorce pantallas para limpiar, cinco para sembrar');
  ok(pasosDe(limpiar).length === 14 && pasosDe(sembrado).length === 5, 'cada árbol recorre las pantallas de su modo');
  ok(PASOS_LIMPIAR.indexOf('beneficio') === PASOS_LIMPIAR.indexOf('fuerte') + 1
    && PASOS_LIMPIAR.indexOf('miedo') === PASOS_LIMPIAR.indexOf('beneficio') + 1,
    'el beneficio tiene su pantalla, entre elegir la mentira y el miedo');
  ok(CAPAS.length === 6 && CAPAS.every((c) => c.prueba.includes('?')), 'las seis capas traen su prueba escrita');

  // Un fruto que es un pensamiento no pasa de la primera pantalla por longitud, pero
  // la regla que importa es la de la escena: sin persona y sin edad no hay raíz.
  ok(!completo({ ...limpiar, origen: 'siempre fui así', quien: '', edad: undefined }, 'origen'),
    'sin persona con nombre ni edad, el origen no deja seguir');
  ok(!completo({ ...limpiar, quien: 'papá', edad: undefined }, 'origen'), 'con persona pero sin edad, tampoco');
  ok(completo(limpiar, 'origen'), 'con escena, persona y edad, sí');
  ok(completo({ ...limpiar, frase: '' }, 'frase'), 'si en esa escena nadie dijo nada, se sigue de largo');
  ok(!completo({ ...limpiar, beneficio: '' }, 'beneficio'), 'el beneficio no se puede saltear');
  ok(!completo({ ...limpiar, mentiras: ['una', 'dos'] }, 'mentiras'), 'con dos mentiras todavía no se baja');
  ok(completo({ ...limpiar, mentiras: ['una', 'dos', 'tres'] }, 'mentiras'), 'con tres, sí');
  ok(!completo({ ...sembrado, amor: '' }, 'amor'), 'sembrar sin el amor propio no cierra');
  ok(completo({ ...sembrado, enlazado: undefined }, 'yuxta'), 'enlazar es opcional: el fruto vale por sí mismo');

  // Un árbol a medio hacer abre donde se trabó, no al principio.
  const aMedias = { ...limpiar, beneficio: '', mentiras: ['una', 'dos', 'tres'], fuerte: 0 };
  ok(PASOS_LIMPIAR[primerPasoPendiente(aMedias)] === 'beneficio', 'un árbol a medias abre en la primera capa vacía');

  console.log('\nLas 84 fechas del camino · las dos cuentas tienen que dar lo mismo:');
  const p84 = { tier: 'acompanado' as const, fechaInicio: '2026-08-04', dosisHechas: [] };
  ok(diaDelProtocolo(p84, '2026-08-04') === 1, 'el día de arranque es el día 1');
  ok(diaDelProtocolo(p84, '2026-09-14') === HITO_MEDIO, `el ${HITO_MEDIO} cae el 14 de septiembre`);
  ok(diaDelProtocolo(p84, '2026-10-26') === HITO_CONTRATO, `el ${HITO_CONTRATO} cae el 26 de octubre`);
  ok(fechaUltimoDia('2026-08-04T12:00:00') === '26 de octubre de 2026',
    'la fecha que se le promete es la del día 84, no la del 85');
  ok(TOTAL_DIAS === HITO_CONTRATO && HITO_MEDIO * 2 === HITO_CONTRATO, 'el camino son dos mitades de 42, medidas en 0, 42 y 84');
}

if (fallos > 0) { console.error(`\n${fallos} test(s) FALLARON`); process.exit(1); }
console.log('\nTODOS LOS TESTS PASAN ✓');
