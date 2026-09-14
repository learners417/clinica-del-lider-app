/** Alta automática post-compra (webhook): POST {email, tier} con header x-alta-key. */
import { createClient } from '@supabase/supabase-js';

export const config = { runtime: 'nodejs' };

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Solo POST.' });
  const clave = process.env.ALTA_KEY;
  if (!clave || req.headers['x-alta-key'] !== clave) return res.status(401).json({ error: 'Clave inválida.' });
  const url = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return res.status(501).json({ error: 'Supabase sin configurar.' });
  const svc = createClient(url, key, { auth: { persistSession: false } });

  const { email, tier = 'apaga' } = req.body || {};
  if (!email) return res.status(400).json({ error: 'Falta email.' });
  const redirectTo = `https://${req.headers.host}`;
  const { data: inv, error: e1 } = await svc.auth.admin.inviteUserByEmail(email, { redirectTo });
  // Si ya existía, buscamos su id para actualizar el tier (nunca degradar un tier superior)
  let user_id = inv?.user?.id;
  if (e1 && /already/i.test(e1.message)) {
    const { data } = await svc.from('accesos').select('user_id, tier').eq('email', email).maybeSingle();
    user_id = data?.user_id;
    const orden = { apaga: 0, solo: 1, acompanado: 2 } as Record<string, number>;
    if (data && orden[tier] <= orden[data.tier]) return res.status(200).json({ ok: true, nota: 'Ya tenía ese acceso o superior.' });
  } else if (e1) return res.status(500).json({ error: e1.message });
  if (!user_id) return res.status(500).json({ error: 'Sin usuario.' });
  const { error: e2 } = await svc.from('accesos').upsert({ user_id, email, tier });
  if (e2) return res.status(500).json({ error: e2.message });
  return res.status(200).json({ ok: true });
}
