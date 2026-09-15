/**
 * estadoCdl — capa de estado v0 (modo invitado, localStorage).
 * Diseñada como adaptador: en fase 2 estas mismas firmas se implementan
 * contra Supabase (proyecto NUEVO de CdL) sin tocar las pantallas.
 */
import type { CbiResultado } from '../data/cbi';
import { TOTAL_DIAS } from '../data/camino';
import type { Phq9Resultado } from '../data/phq9';
import type { ZonaId } from '../data/zonas';

const K = {
  nombre: 'cdl_nombre',
  chequeos: 'cdl_chequeos',
  diario: 'cdl_diario',
  pagina: 'cdl_pagina',
  borrador: 'cdl_chequeo_borrador',
  protocolo: 'cdl_protocolo',
  clinicoUsos: 'cdl_clinico_usos',
  clinicoChat: 'cdl_clinico_chat',
  apaga: 'cdl_apaga',
  informes: 'cdl_informes',
  mensaje90: 'cdl_mensaje_90',
};

/* ── Respaldo y restauración ──
   Todo el estado clínico vive en este dispositivo. Si el paciente limpia el
   navegador o cambia de teléfono, se pierde. Estas dos funciones son el seguro:
   un archivo que puede guardar donde quiera y volver a cargar. */

export interface Respaldo {
  version: 1;
  fecha: string;
  datos: Record<string, unknown>;
}

/** Junta todo el estado guardado en un solo objeto. */
export function armarRespaldo(): Respaldo {
  const datos: Record<string, unknown> = {};
  for (const clave of Object.values(K)) {
    try {
      const raw = localStorage.getItem(clave);
      if (raw !== null) datos[clave] = JSON.parse(raw);
    } catch { /* noop */ }
  }
  return { version: 1, fecha: new Date().toISOString(), datos };
}

/** Descarga el respaldo como archivo. Devuelve el nombre del archivo. */
export function descargarRespaldo(nombre = 'clinica'): string {
  const r = armarRespaldo();
  const archivo = `${nombre.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-respaldo-${r.fecha.slice(0, 10)}.json`;
  const url = URL.createObjectURL(new Blob([JSON.stringify(r)], { type: 'application/json' }));
  const a = document.createElement('a');
  a.href = url; a.download = archivo; a.click();
  setTimeout(() => URL.revokeObjectURL(url), 2000);
  return archivo;
}

/** Restaura desde un respaldo. Pisa lo que haya en este dispositivo. */
export function restaurarRespaldo(texto: string): { ok: boolean; error?: string } {
  let r: Respaldo;
  try { r = JSON.parse(texto) as Respaldo; }
  catch { return { ok: false, error: 'El archivo no se puede leer.' }; }
  if (!r || r.version !== 1 || typeof r.datos !== 'object') {
    return { ok: false, error: 'Ese archivo no es un respaldo de la Clínica.' };
  }
  const validas = new Set<string>(Object.values(K));
  let escritas = 0;
  for (const [clave, valor] of Object.entries(r.datos)) {
    if (!validas.has(clave)) continue;
    try { localStorage.setItem(clave, JSON.stringify(valor)); escritas++; } catch { /* noop */ }
  }
  if (escritas === 0) return { ok: false, error: 'El respaldo no traía datos de la Clínica.' };
  return { ok: true };
}

function leer<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function guardar(key: string, valor: unknown): boolean {
  try {
    localStorage.setItem(key, JSON.stringify(valor));
    return true;
  } catch {
    return false;
  }
}

/**
 * ¿Este navegador nos deja guardar? Sin esto la app no puede funcionar:
 * todo el camino del paciente vive en este dispositivo.
 * Falla en incógnito y con el almacenamiento del sitio bloqueado.
 */
export function puedeGuardar(): boolean {
  try {
    const prueba = '__cdl_prueba__';
    localStorage.setItem(prueba, '1');
    const ok = localStorage.getItem(prueba) === '1';
    localStorage.removeItem(prueba);
    return ok;
  } catch {
    return false;
  }
}

/* ── Perfil invitado ── */
export function getNombre(): string {
  return leer<string>(K.nombre, '');
}
export function setNombre(nombre: string): void {
  guardar(K.nombre, nombre.trim());
}

/* ── Chequeo ── */
export interface ContextoLider {
  lidera: string;
  personas: string;
  edad: string;
  motivo: string;
  /** Desde cuándo lo carga. Opcional: los chequeos viejos no lo tienen. */
  desde?: string;
}

export interface ChequeoGuardado {
  fecha: string; // ISO
  contexto: ContextoLider;
  cbi: CbiResultado;
  phq9: Phq9Resultado;
  rueda: Record<string, number>; // medidaId -> 0-100 crudo (el Tablero)
  eneagramaTipos: number[];
  /** El cuerpo el Día 0: la línea de la que se parte. */
  cuerpo?: {
    acoste: string;      // "HH:MM"
    levante: string;     // "HH:MM"
    despertares: number; // índice 0..3
    energia0: number;    // 1..10
    apagar: number[];    // índices de APAGADORES
    ventanaAM: number;   // minutos reales
    ventanaPM: number;
  };
  /** Sus palabras, tal como las escribió. Se le devuelven en el día 42 y el 84. */
  palabras?: {
    porquehoy: string;
    costo: string;
    oculto: string;
    quien: string;
    escena: string;
  };
  firma?: string;
  habitos: {
    horasSueno: number;
    entrenosSemana: number;
    horasTrabajo: number;
    cafeinaDia: number;
  };
  zona: ZonaId;
}

export function listarChequeos(): ChequeoGuardado[] {
  return leer<ChequeoGuardado[]>(K.chequeos, []);
}
export function getUltimoChequeo(): ChequeoGuardado | null {
  const todos = listarChequeos();
  return todos.length ? todos[todos.length - 1] : null;
}
export function guardarChequeo(c: ChequeoGuardado): void {
  const todos = listarChequeos();
  todos.push(c);
  guardar(K.chequeos, todos);
}

/* ── Borrador del Chequeo (autoguardado / reanudar) ──
 * "La vida interrumpe" es la causa #1 de abandono documentada:
 * cada respuesta se persiste y el flujo reanuda exactamente donde quedó. */
export interface BorradorChequeo {
  fase: string;
  nombre: string;
  contexto: Partial<ContextoLider>;
  cbiResp: Record<string, number>;
  cbiIdx: number;
  phqResp: Record<string, number>;
  phqIdx: number;
  rueda: Record<string, number>;
  habitos: { horasSueno: number; entrenosSemana: number; horasTrabajo: number; cafeinaDia: number };
  eneaSel: number[];
  cuerpo?: ChequeoGuardado['cuerpo'];
  palabras?: Partial<NonNullable<ChequeoGuardado['palabras']>>;
  firma?: string;
}

export function leerBorrador(): BorradorChequeo | null {
  return leer<BorradorChequeo | null>(K.borrador, null);
}
export function guardarBorrador(b: BorradorChequeo): void {
  guardar(K.borrador, b);
}
export function limpiarBorrador(): void {
  try { localStorage.removeItem(K.borrador); } catch { /* noop */ }
}

/** Fecha del último día del camino a partir de un ISO, formateada en castellano. */
export function fechaDia90(desdeIso: string): string {
  const d = new Date(desdeIso);
  d.setDate(d.getDate() + TOTAL_DIAS_PROTOCOLO);
  return d.toLocaleDateString('es', { day: 'numeric', month: 'long', year: 'numeric' });
}

/* ── Diario del Líder (Signos Vitales) ── */
export interface EntradaDiario {
  fecha: string; // yyyy-mm-dd
  estado: number; // 1-5
  energia: number; // 1-5
  horasSueno: number;
  horasTrabajo: number;
  nota: string;
}

export function hoyIso(): string {
  const d = new Date();
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${d.getFullYear()}-${mm}-${dd}`;
}

export function listarDiario(): EntradaDiario[] {
  return leer<EntradaDiario[]>(K.diario, []);
}
export function getEntradaHoy(): EntradaDiario | null {
  return listarDiario().find((e) => e.fecha === hoyIso()) ?? null;
}
export function guardarEntradaDiario(e: EntradaDiario): void {
  const todas = listarDiario().filter((x) => x.fecha !== e.fecha);
  todas.push(e);
  todas.sort((a, b) => a.fecha.localeCompare(b.fecha));
  guardar(K.diario, todas);
}

/**
 * Racha (función pura, testeable): días consecutivos con entrada,
 * contando hacia atrás desde `desde` (o el día anterior si hoy no registró).
 */
export function rachaDesde(fechasRegistradas: string[], desde: string): number {
  const fechas = new Set(fechasRegistradas);
  if (fechas.size === 0) return 0;
  const [y, m, d] = desde.split('-').map(Number);
  const cursor = new Date(y, m - 1, d);
  if (!fechas.has(desde)) cursor.setDate(cursor.getDate() - 1);
  let racha = 0;
  for (;;) {
    const mm = String(cursor.getMonth() + 1).padStart(2, '0');
    const dd = String(cursor.getDate()).padStart(2, '0');
    const iso = `${cursor.getFullYear()}-${mm}-${dd}`;
    if (!fechas.has(iso)) break;
    racha += 1;
    cursor.setDate(cursor.getDate() - 1);
  }
  return racha;
}

/** Racha: días consecutivos con entrada, contando hacia atrás desde hoy (o ayer). */
export function calcularRacha(): number {
  return rachaDesde(listarDiario().map((e) => e.fecha), hoyIso());
}

/* ── Navegación persistida ── */
export type PaginaId = 'hoy' | 'chequeo' | 'botiquin' | 'zona' | 'tratamiento' | 'dosis' | 'noche' | 'clinico' | 'admin';
const PAGINAS: PaginaId[] = ['hoy', 'chequeo', 'botiquin', 'zona', 'tratamiento', 'dosis', 'noche', 'clinico', 'admin'];

export function getPagina(): PaginaId {
  const p = leer<string>(K.pagina, 'hoy');
  // Los flujos no son destinos: al recargar se vuelve a Hoy.
  if (p === 'chequeo' || p === 'dosis' || p === 'noche' || p === 'clinico') return 'hoy';
  return (PAGINAS as string[]).includes(p) ? (p as PaginaId) : 'hoy';
}
export function setPagina(p: PaginaId): void {
  guardar(K.pagina, p);
}

/* ── EL REINICIO: estado del protocolo activo ── */
export interface ProtocoloActivo {
  tier: 'solo' | 'acompanado';
  fechaInicio: string; // yyyy-mm-dd
  dosisHechas: number[];
}

export function getProtocolo(): ProtocoloActivo | null {
  return leer<ProtocoloActivo | null>(K.protocolo, null);
}

export function activarProtocolo(tier: 'solo' | 'acompanado'): ProtocoloActivo {
  const p: ProtocoloActivo = { tier, fechaInicio: hoyIso(), dosisHechas: [] };
  guardar(K.protocolo, p);
  return p;
}

/** Día del protocolo (1..90+) según la fecha de inicio. */
export function diaDelProtocolo(p: ProtocoloActivo, hoy: string = hoyIso()): number {
  const [y1, m1, d1] = p.fechaInicio.split('-').map(Number);
  const [y2, m2, d2] = hoy.split('-').map(Number);
  const ms = new Date(y2, m2 - 1, d2).getTime() - new Date(y1, m1 - 1, d1).getTime();
  return Math.max(1, Math.floor(ms / 86400000) + 1);
}

/** La próxima Dosis pendiente (nunca se acumulan: siempre hay UNA próxima). */
export function proximaDosis(p: ProtocoloActivo): number {
  const dia = Math.min(diaDelProtocolo(p), 90);
  for (let d = 1; d <= dia; d++) {
    if (!p.dosisHechas.includes(d)) return d;
  }
  return Math.min(dia + 1, 90);
}

export function marcarDosisHecha(dia: number): void {
  const p = getProtocolo();
  if (!p || p.dosisHechas.includes(dia)) return;
  p.dosisHechas.push(dia);
  p.dosisHechas.sort((a, b) => a - b);
  guardar(K.protocolo, p);
}


/* ── El Clínico: contador gratis + historial local ── */
export interface MensajeClinico { rol: 'user' | 'assistant'; texto: string; }

export function getClinicoUsos(): number {
  return leer<number>(K.clinicoUsos, 0);
}
export function sumarClinicoUso(): void {
  guardar(K.clinicoUsos, getClinicoUsos() + 1);
}
export function getClinicoChat(): MensajeClinico[] {
  return leer<MensajeClinico[]>(K.clinicoChat, []);
}
export function guardarClinicoChat(msgs: MensajeClinico[]): void {
  guardar(K.clinicoChat, msgs.slice(-40));
}

/* ── APAGA LA CABEZA: acceso $33 (las 5 noches) ── */
export interface ApagaActivo {
  fechaInicio: string; // yyyy-mm-dd
  nochesHechas: number[];
  ultimaNocheFecha?: string; // yyyy-mm-dd de la última noche marcada
}

export function getApaga(): ApagaActivo | null {
  return leer<ApagaActivo | null>(K.apaga, null);
}
export function activarApaga(): ApagaActivo {
  const a: ApagaActivo = { fechaInicio: hoyIso(), nochesHechas: [] };
  guardar(K.apaga, a);
  return a;
}
export function marcarNocheHecha(n: number): void {
  const a = getApaga();
  if (!a || a.nochesHechas.includes(n)) return;
  a.nochesHechas.push(n);
  a.nochesHechas.sort((x, y) => x - y);
  a.ultimaNocheFecha = hoyIso();
  guardar(K.apaga, a);
}

/** ¿Ya hizo su noche de HOY? (una noche por día calendario — es un protocolo nocturno) */
export function nocheDeHoyHecha(a: ApagaActivo): boolean {
  return a.ultimaNocheFecha === hoyIso();
}
export function proximaNoche(a: ApagaActivo): number {
  for (let n = 1; n <= 5; n++) if (!a.nochesHechas.includes(n)) return n;
  return 5;
}

/** El nivel de acceso vigente (el protocolo pisa al apaga). */
export type Acceso = 'ninguno' | 'apaga' | 'solo' | 'acompanado';
export function getAcceso(): Acceso {
  const p = getProtocolo();
  if (p) return p.tier;
  if (getApaga()) return 'apaga';
  return 'ninguno';
}

/* ── La Bitácora: las líneas honestas acumuladas (el testimonio del día 85) ── */
export interface LineaBitacora { fecha: string; nota: string; }
export function listarBitacora(): LineaBitacora[] {
  return listarDiario()
    .filter((e) => e.nota.trim().length > 0)
    .map((e) => ({ fecha: e.fecha, nota: e.nota }));
}

/** ¿Es horario de madrugada? (el Clínico cambia de modo entre 0:00 y 5:00) */
export function esMadrugada(hora: number = new Date().getHours()): boolean {
  return hora >= 0 && hora < 5;
}

/** Modo nube: siembra el estado local según el acceso de la base (sin pisar el progreso existente). */
export function sembrarAccesoLocal(tier: 'apaga' | 'solo' | 'acompanado', fechaInicio: string): void {
  if (tier === 'apaga') {
    if (!getApaga()) guardar(K.apaga, { fechaInicio, nochesHechas: [] } satisfies ApagaActivo);
    return;
  }
  const p = getProtocolo();
  if (!p) {
    guardar(K.protocolo, { tier, fechaInicio, dosisHechas: [] } satisfies ProtocoloActivo);
  } else if (p.tier !== tier) {
    p.tier = tier; // upgrade/downgrade de tier sin perder el progreso
    guardar(K.protocolo, p);
  }
}

/* ── EL INFORME SEMANAL: el Clínico lee tu semana ── */
export interface InformeSemanal { fecha: string; texto: string; }

export function listarInformes(): InformeSemanal[] {
  return leer<InformeSemanal[]>(K.informes, []);
}
export function guardarInforme(texto: string): void {
  const lista = listarInformes();
  lista.push({ fecha: hoyIso(), texto });
  guardar(K.informes, lista.slice(-20));
}
export function ultimoInforme(): InformeSemanal | null {
  const lista = listarInformes();
  return lista.length ? lista[lista.length - 1] : null;
}
export function registrosUltimos7(): EntradaDiario[] {
  const corte = new Date();
  corte.setDate(corte.getDate() - 7);
  const iso = `${corte.getFullYear()}-${String(corte.getMonth() + 1).padStart(2, '0')}-${String(corte.getDate()).padStart(2, '0')}`;
  return listarDiario().filter((e) => e.fecha > iso);
}
/** Elegible: Tratamiento activo + 5 registros en la semana + sin informe en los últimos 6 días. */
export function puedeGenerarInforme(): boolean {
  if (!getProtocolo()) return false;
  if (registrosUltimos7().length < 5) return false;
  const ult = ultimoInforme();
  if (!ult) return true;
  const [y, m, d] = ult.fecha.split('-').map(Number);
  const hace6 = new Date();
  hace6.setDate(hace6.getDate() - 6);
  return new Date(y, m - 1, d) < new Date(hace6.getFullYear(), hace6.getMonth(), hace6.getDate());
}

const TOTAL_DIAS_PROTOCOLO = TOTAL_DIAS;

/* ── EL MENSAJE AL DÍA 90: se sella al empezar, se abre en el Alta ── */
export interface Mensaje90 { fecha: string; dia: number; texto: string; abierto?: string }

export function getMensaje90(): Mensaje90 | null {
  return leer<Mensaje90 | null>(K.mensaje90, null);
}

/** Se sella una sola vez: un mensaje reescrito ya no es un mensaje del que empezó. */
export function sellarMensaje90(texto: string): boolean {
  if (getMensaje90()) return false;
  const p = getProtocolo();
  const dia = p ? Math.min(diaDelProtocolo(p), TOTAL_DIAS_PROTOCOLO) : 1;
  guardar(K.mensaje90, { fecha: hoyIso(), dia, texto } satisfies Mensaje90);
  return true;
}

/** Solo el último día (o después) y solo con Tratamiento activo. */
export function puedeAbrirMensaje90(): boolean {
  const p = getProtocolo();
  if (!p || !getMensaje90()) return false;
  return diaDelProtocolo(p) >= TOTAL_DIAS_PROTOCOLO;
}

export function abrirMensaje90(): Mensaje90 | null {
  const m = getMensaje90();
  if (!m || !puedeAbrirMensaje90()) return m;
  if (!m.abierto) { m.abierto = hoyIso(); guardar(K.mensaje90, m); }
  return m;
}
