/**
 * Sincronización con la nube (fase 2B).
 *
 * El teléfono sigue siendo la fuente de trabajo: la app lee y escribe en localStorage.
 * Cada escritura queda marcada con su hora y sube a Supabase (tabla estado_paciente)
 * un segundo y medio después. Al entrar, lo más nuevo gana, clave por clave.
 * Si en el mismo teléfono entra otra persona, lo del anterior se borra antes de bajar lo suyo.
 */
import { supabase } from './supabase';
import { CLAVES, alGuardar } from './estadoCdl';

/** Lo que viaja a la nube. El chat del Clínico, el borrador y la página abierta se quedan en el teléfono. */
export const SINCRONIZADAS: string[] = [
  CLAVES.nombre, CLAVES.chequeos, CLAVES.diario, CLAVES.protocolo, CLAVES.apaga,
  CLAVES.informes, CLAVES.mensaje90, CLAVES.iceberg, CLAVES.sesiones, CLAVES.jugadas,
  CLAVES.consentimiento, CLAVES.descargas, CLAVES.columnas, CLAVES.testimonio, CLAVES.ikigai,
];

const K_TS = 'cdl_sync_ts';
const K_DUENO = 'cdl_sync_dueno';

type Marcas = Record<string, number>;

/** Lógica pura: qué baja y qué sube, comparando la hora local con la de la nube. */
export function planSync(local: Marcas, presentes: string[], remoto: Marcas): { bajar: string[]; subir: string[] } {
  const bajar = Object.keys(remoto).filter((c) => remoto[c] > (local[c] ?? 0));
  const subir = presentes.filter((c) => !(c in remoto) || (local[c] ?? 0) > remoto[c]);
  return { bajar, subir };
}

function leerMarcas(): Marcas {
  try { return JSON.parse(localStorage.getItem(K_TS) || '{}') as Marcas; } catch { return {}; }
}
function escribirMarcas(m: Marcas): void {
  try { localStorage.setItem(K_TS, JSON.stringify(m)); } catch { /* noop */ }
}

let usuario: string | null = null;
const pendientes = new Set<string>();
let temporizador: ReturnType<typeof setTimeout> | null = null;

async function subir(claves: string[]): Promise<void> {
  if (!supabase || !usuario || claves.length === 0) return;
  const marcas = leerMarcas();
  const filas = claves.flatMap((clave) => {
    const raw = localStorage.getItem(clave);
    if (raw === null) return [];
    try {
      return [{ user_id: usuario!, clave, valor: JSON.parse(raw), actualizado: new Date(marcas[clave] ?? Date.now()).toISOString() }];
    } catch { return []; }
  });
  if (filas.length === 0) return;
  const { error } = await supabase.from('estado_paciente').upsert(filas, { onConflict: 'user_id,clave' });
  if (error) { claves.forEach((c) => pendientes.add(c)); throw error; }
}

export async function vaciarPendientes(): Promise<void> {
  if (temporizador) { clearTimeout(temporizador); temporizador = null; }
  const claves = [...pendientes];
  pendientes.clear();
  try { await subir(claves); } catch (e) { console.warn('[sync] quedó pendiente', e); }
}

function programar(): void {
  if (temporizador) clearTimeout(temporizador);
  temporizador = setTimeout(() => { void vaciarPendientes(); }, 1500);
}


/**
 * Baja de la nube lo que sea más nuevo que lo del teléfono y sube lo que la nube no tiene.
 * Devuelve cuántas claves bajaron (si bajó algo, la pantalla tiene que refrescarse).
 */
async function traer(userId: string): Promise<number> {
  if (!supabase) return 0;
  try {
    const { data, error } = await supabase.from('estado_paciente').select('clave, valor, actualizado').eq('user_id', userId);
    if (error) throw error;
    const remoto: Marcas = {};
    const valores: Record<string, unknown> = {};
    for (const f of data ?? []) {
      remoto[f.clave] = Date.parse(f.actualizado);
      valores[f.clave] = f.valor;
    }
    const marcas = leerMarcas();
    const presentes = SINCRONIZADAS.filter((c) => localStorage.getItem(c) !== null);
    const { bajar, subir: aSubir } = planSync(marcas, presentes, remoto);
    for (const c of bajar) {
      localStorage.setItem(c, JSON.stringify(valores[c]));
      marcas[c] = remoto[c];
    }
    for (const c of aSubir) if (!marcas[c]) marcas[c] = Date.now();
    escribirMarcas(marcas);
    await subir(aSubir);
    return bajar.length;
  } catch (e) {
    console.warn('[sync] sin nube por ahora; se sigue con el teléfono', e);
    return 0;
  }
}

/**
 * Se llama una vez al entrar, antes de mostrar la app. Nunca tira error:
 * sin red, la app sigue con lo del teléfono y sube cuando vuelva.
 */
export async function sincronizar(userId: string): Promise<void> {
  if (!supabase) return;
  usuario = userId;

  // Otra persona en este teléfono: lo anterior no es de quien entra.
  const dueno = localStorage.getItem(K_DUENO);
  if (dueno && dueno !== userId) {
    Object.values(CLAVES).forEach((c) => { try { localStorage.removeItem(c); } catch { /* noop */ } });
    localStorage.removeItem(K_TS);
  }
  localStorage.setItem(K_DUENO, userId);

  await traer(userId);

  alGuardar((clave) => {
    if (!SINCRONIZADAS.includes(clave)) return;
    const m = leerMarcas(); m[clave] = Date.now(); escribirMarcas(m);
    pendientes.add(clave);
    programar();
  });

  if (typeof window !== 'undefined' && !(window as unknown as { __cdlSync?: boolean }).__cdlSync) {
    (window as unknown as { __cdlSync?: boolean }).__cdlSync = true;
    window.addEventListener('online', () => { SINCRONIZADAS.forEach((c) => pendientes.add(c)); void vaciarPendientes(); });
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'hidden') { void vaciarPendientes(); return; }
      // Al volver a la app: si en otro teléfono se escribió algo, se baja antes de seguir,
      // así lo que escriba acá no pisa lo que escribió allá.
      if (!usuario || pendientes.size) return;
      void traer(usuario).then((bajaron) => { if (bajaron > 0) location.reload(); });
    });
  }
}

/** Al cerrar sesión: sube lo pendiente y deja de escuchar. */
export async function cortarSync(): Promise<void> {
  await vaciarPendientes();
  alGuardar(null);
  usuario = null;
}
