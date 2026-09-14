/** ADMIN — gestión de accesos (solo rol admin): crear paciente, invitar por email, cambiar tier. */
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { UserPlus, RefreshCw } from 'lucide-react';
import { supabase, type AccesoNube } from '../lib/supabase';

const TIERS = [
  { id: 'apaga', label: 'Apaga la Cabeza ($33)' },
  { id: 'solo', label: 'El Reinicio ($333)' },
  { id: 'acompanado', label: 'Acompañado ($999)' },
] as const;

async function llamarApi(metodo: string, body?: unknown) {
  const { data: { session } } = await supabase!.auth.getSession();
  const res = await fetch('/api/admin/usuarios', {
    method: metodo,
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${session?.access_token ?? ''}` },
    body: body ? JSON.stringify(body) : undefined,
  });
  const json = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(json.error || `Error ${res.status}`);
  return json;
}

export default function Admin() {
  const [accesos, setAccesos] = useState<AccesoNube[]>([]);
  const [cargando, setCargando] = useState(false);
  const [email, setEmail] = useState('');
  const [tier, setTier] = useState<string>('apaga');

  async function cargar() {
    setCargando(true);
    try {
      const { accesos } = await llamarApi('GET');
      setAccesos(accesos);
    } catch (e) {
      toast.error((e as Error).message);
    } finally {
      setCargando(false);
    }
  }

  useEffect(() => { cargar(); }, []);

  async function crear() {
    if (!email.trim()) { toast('Escribe el email del paciente.'); return; }
    setCargando(true);
    try {
      await llamarApi('POST', { email: email.trim(), tier });
      toast.success(`Invitación enviada a ${email.trim()} · ${TIERS.find((t) => t.id === tier)?.label}`);
      setEmail('');
      await cargar();
    } catch (e) {
      toast.error((e as Error).message);
    } finally {
      setCargando(false);
    }
  }

  async function cambiarTier(user_id: string, nuevo: string) {
    try {
      await llamarApi('PATCH', { user_id, tier: nuevo });
      toast.success('Acceso actualizado.');
      await cargar();
    } catch (e) {
      toast.error((e as Error).message);
    }
  }

  return (
    <div className="pantalla-ancha pt-6 pb-28">
      <div className="flex items-center justify-between mb-1">
        <p className="t-micro" style={{ color: 'var(--calido)' }}>Administración</p>
        <button className="btn-fantasma flex items-center gap-1.5" onClick={cargar} disabled={cargando}>
          <RefreshCw size={14} className={cargando ? 'pulso-latido' : ''} /> Actualizar
        </button>
      </div>
      <h1 className="t-titulo mb-4">Accesos de la clínica</h1>

      <div className="tarjeta p-5 mb-5">
        <p className="flex items-center gap-2 t-sub mb-3"><UserPlus size={17} color="var(--acento)" /> Dar de alta un paciente</p>
        <div className="flex flex-col lg:flex-row gap-2">
          <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" placeholder="email@delpaciente.com"
            className="flex-1 px-4" style={{ minHeight: 50 }} />
          <select value={tier} onChange={(e) => setTier(e.target.value)}
            className="px-3 rounded-2xl" style={{ minHeight: 50, background: 'var(--fondo)', border: '1px solid var(--borde-fuerte)', color: 'var(--texto)' }}>
            {TIERS.map((t) => <option key={t.id} value={t.id}>{t.label}</option>)}
          </select>
          <button className="btn-primario" style={{ minHeight: 50, padding: '0 20px' }} onClick={crear} disabled={cargando}>Invitar</button>
        </div>
        <p className="t-cuerpo mt-3" style={{ fontSize: 12 }}>Le llega un email de invitación: entra, crea su contraseña, y su acceso ya está activo con el tier elegido.</p>
      </div>

      <div className="tarjeta p-5">
        <p className="t-sub mb-3">Pacientes ({accesos.length})</p>
        {accesos.length === 0 && <p className="t-cuerpo">Todavía no hay accesos creados.</p>}
        <div className="space-y-3">
          {accesos.map((a) => (
            <div key={a.user_id} className="flex flex-col lg:flex-row lg:items-center gap-2 py-2" style={{ borderBottom: '1px solid var(--borde)' }}>
              <div className="flex-1 min-w-0">
                <p className="t-sub" style={{ fontSize: 14, overflowWrap: 'anywhere' }}>{a.email}</p>
                <p className="t-micro" style={{ color: 'var(--texto-tenue)' }}>
                  {a.rol !== 'paciente' ? `${a.rol} · ` : ''}inició {a.fecha_inicio}
                </p>
              </div>
              <select value={a.tier} onChange={(e) => cambiarTier(a.user_id, e.target.value)}
                className="px-3 rounded-xl" style={{ minHeight: 44, background: 'var(--fondo)', border: '1px solid var(--borde)', color: 'var(--texto)', fontSize: 13 }}>
                {TIERS.map((t) => <option key={t.id} value={t.id}>{t.label}</option>)}
              </select>
            </div>
          ))}
        </div>
      </div>

      <p className="t-cuerpo mt-5" style={{ fontSize: 12 }}>
        Los datos clínicos (Chequeos, Signos, Dosis) viven en el dispositivo de cada paciente — la sincronización a la nube es la fase 2B.
        Para el seguimiento semanal del Acompañado, el paciente comparte su semana por WhatsApp con su clínico.
      </p>
    </div>
  );
}
