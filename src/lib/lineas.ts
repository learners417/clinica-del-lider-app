/** La línea de la semana — el terapeuta la escribe desde la ficha; el paciente la ve fijada en Hoy. */
import { supabase } from './supabase';
import { listarLineas, guardarLineasCache, type LineaSemana } from './estadoCdl';

interface Fila { id: string; texto: string; creado_en: string }
const aLinea = (f: Fila): LineaSemana => ({ id: f.id, texto: f.texto, fecha: f.creado_en });

/** Paciente: baja sus líneas y las deja en el teléfono (para verlas también sin red). */
export async function cargarMisLineas(): Promise<LineaSemana[]> {
  if (!supabase) return listarLineas();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return listarLineas();
  const { data, error } = await supabase.from('lineas').select('id, texto, creado_en')
    .eq('paciente_id', user.id).order('creado_en', { ascending: false }).limit(20);
  if (error || !data) return listarLineas();
  const l = (data as Fila[]).map(aLinea);
  guardarLineasCache(l);
  return l;
}

/** Equipo: las líneas de un paciente. */
export async function lineasDe(pacienteId: string): Promise<LineaSemana[]> {
  if (!supabase) return [];
  const { data } = await supabase.from('lineas').select('id, texto, creado_en')
    .eq('paciente_id', pacienteId).order('creado_en', { ascending: false }).limit(20);
  return ((data as Fila[]) ?? []).map(aLinea);
}

/** Equipo: escribe la línea de esta semana. */
export async function escribirLinea(pacienteId: string, texto: string): Promise<string | null> {
  if (!supabase) return 'Sin conexión con la nube.';
  const { data: { user } } = await supabase.auth.getUser();
  const { error } = await supabase.from('lineas').insert({ paciente_id: pacienteId, texto: texto.trim(), autor: user?.id });
  return error ? error.message : null;
}
