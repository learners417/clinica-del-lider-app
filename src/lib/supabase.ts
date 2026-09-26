/** Cliente Supabase — si las variables no están, la app corre en modo local (códigos). */
import { createClient, type SupabaseClient } from '@supabase/supabase-js';

// En los tests (node) no hay import.meta.env: la app queda en modo local.
const env = (import.meta.env ?? {}) as Record<string, string | undefined>;
const url = env.VITE_SUPABASE_URL;
const anon = env.VITE_SUPABASE_ANON_KEY;

export const supabase: SupabaseClient | null = url && anon ? createClient(url, anon) : null;
export const MODO_NUBE = Boolean(supabase);

export interface AccesoNube {
  user_id: string;
  email: string;
  tier: 'apaga' | 'solo' | 'acompanado';
  rol: 'paciente' | 'equipo' | 'admin';
  fecha_inicio: string;
}

export async function getAccesoNube(): Promise<AccesoNube | null> {
  if (!supabase) return null;
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;
  const { data } = await supabase.from('accesos').select('*').eq('user_id', user.id).maybeSingle();
  return (data as AccesoNube) ?? null;
}
