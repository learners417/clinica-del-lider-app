/** Gestión de accesos — GET lista · POST crea+invita · PATCH cambia tier. Solo rol admin. */
import { createClient } from '@supabase/supabase-js';

export const config = { runtime: 'nodejs' };

function servicio() {
  const url = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return null;
  return createClient(url, key, { auth: { persistSession: false } });
}

export default async function handler(req: any, res: any) {
  const svc = servicio();
  if (!svc) return res.status(501).json({ error: 'Supabase sin configurar en el servidor.' });

  // ¿Quién llama? Verificamos su JWT y su rol admin.
  const token = (req.headers.authorization || '').replace('Bearer ', '');
  if (!token) return res.status(401).json({ error: 'Sin sesión.' });
  const { data: { user } } = await svc.auth.getUser(token);
  if (!user) return res.status(401).json({ error: 'Sesión inválida.' });
  const { data: yo } = await svc.from('accesos').select('rol').eq('user_id', user.id).maybeSingle();
  if (yo?.rol !== 'admin') return res.status(403).json({ error: 'Solo el admin gestiona accesos.' });

  if (req.method === 'GET') {
    const { data, error } = await svc.from('accesos').select('*').order('creado_en', { ascending: false });
    if (error) return res.status(500).json({ error: error.message });
    return res.status(200).json({ accesos: data });
  }

  if (req.method === 'POST') {
    const { email, tier, rol = 'paciente' } = req.body || {};
    if (!email || !tier) return res.status(400).json({ error: 'Faltan email o tier.' });
    const redirectTo = `https://${req.headers.host}`;
    const { data: inv, error: e1 } = await svc.auth.admin.inviteUserByEmail(email, { redirectTo });
    if (e1 || !inv.user) return res.status(500).json({ error: e1?.message || 'No se pudo invitar.' });
    const { error: e2 } = await svc.from('accesos').upsert({ user_id: inv.user.id, email, tier, rol });
    if (e2) return res.status(500).json({ error: e2.message });
    return res.status(200).json({ ok: true, user_id: inv.user.id });
  }

  if (req.method === 'PATCH') {
    const { user_id, tier, rol } = req.body || {};
    if (!user_id) return res.status(400).json({ error: 'Falta user_id.' });
    const cambios: Record<string, string> = {};
    if (tier) cambios.tier = tier;
    if (rol) cambios.rol = rol;
    const { error } = await svc.from('accesos').update(cambios).eq('user_id', user_id);
    if (error) return res.status(500).json({ error: error.message });
    return res.status(200).json({ ok: true });
  }

  return res.status(405).json({ error: 'Método no permitido.' });
}
