/** LOGIN — la entrada con usuario y contraseña (modo nube). El invitado llega por email y crea su clave aquí. */
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { LogIn } from 'lucide-react';
import PulsoAmbiente from '../components/PulsoAmbiente';
import { supabase } from '../lib/supabase';

type Vista = 'login' | 'recuperar' | 'nueva-clave';

export default function Login({ onEntro }: { onEntro: () => void }) {
  const [vista, setVista] = useState<Vista>('login');
  const [email, setEmail] = useState('');
  const [clave, setClave] = useState('');
  const [cargando, setCargando] = useState(false);

  // El invitado (o quien recupera) llega con un token en la URL → Supabase abre sesión y avisa
  useEffect(() => {
    if (!supabase) return;
    const { data: sub } = supabase.auth.onAuthStateChange((evento) => {
      if (evento === 'PASSWORD_RECOVERY') setVista('nueva-clave');
      if (evento === 'SIGNED_IN' && window.location.hash.includes('type=invite')) setVista('nueva-clave');
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  async function entrar() {
    if (!supabase || cargando) return;
    setCargando(true);
    const { error } = await supabase.auth.signInWithPassword({ email: email.trim(), password: clave });
    setCargando(false);
    if (error) { toast.error('Email o contraseña incorrectos.'); return; }
    onEntro();
  }

  async function recuperar() {
    if (!supabase || cargando || !email.trim()) { toast('Escribe tu email primero.'); return; }
    setCargando(true);
    const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), { redirectTo: window.location.origin });
    setCargando(false);
    if (error) { toast.error(error.message); return; }
    toast.success('Te enviamos un enlace a tu email para crear una contraseña nueva.');
    setVista('login');
  }

  async function guardarClave() {
    if (!supabase || cargando) return;
    if (clave.length < 8) { toast.error('La contraseña necesita al menos 8 caracteres.'); return; }
    setCargando(true);
    const { error } = await supabase.auth.updateUser({ password: clave });
    setCargando(false);
    if (error) { toast.error(error.message); return; }
    toast.success('Contraseña guardada. Bienvenido a la clínica.');
    onEntro();
  }

  return (
    <div className="pantalla pt-10 lg:pt-16 pb-16" style={{ maxWidth: '26rem' }}>
      <PulsoAmbiente opacidad={0.45} />
      <p className="t-micro mt-6" style={{ color: 'var(--calido)' }}>La Clínica del Líder</p>
      <h1 className="t-titulo mt-2 mb-1">
        {vista === 'nueva-clave' ? 'Crea tu contraseña' : vista === 'recuperar' ? 'Recuperar acceso' : 'Tu clínica te espera'}
      </h1>
      <p className="t-cuerpo mb-6">
        {vista === 'nueva-clave'
          ? 'Un paso y entras: elige la contraseña de tu cuenta.'
          : 'Entra con el email con el que compraste tu acceso.'}
      </p>

      <div className="tarjeta p-5">
        {vista !== 'nueva-clave' && (
          <>
            <p className="t-micro mb-1.5" style={{ color: 'var(--texto-tenue)' }}>Email</p>
            <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" autoComplete="email"
              placeholder="tu@email.com" className="w-full px-4 mb-4" style={{ minHeight: 52 }} />
          </>
        )}
        {vista !== 'recuperar' && (
          <>
            <p className="t-micro mb-1.5" style={{ color: 'var(--texto-tenue)' }}>{vista === 'nueva-clave' ? 'Tu contraseña nueva' : 'Contraseña'}</p>
            <input value={clave} onChange={(e) => setClave(e.target.value)} type="password"
              autoComplete={vista === 'nueva-clave' ? 'new-password' : 'current-password'}
              placeholder="••••••••" className="w-full px-4 mb-4" style={{ minHeight: 52 }}
              onKeyDown={(e) => { if (e.key === 'Enter') (vista === 'nueva-clave' ? guardarClave() : entrar()); }} />
          </>
        )}
        <button className="btn-primario w-full flex items-center justify-center gap-2" disabled={cargando}
          onClick={vista === 'nueva-clave' ? guardarClave : vista === 'recuperar' ? recuperar : entrar}>
          <LogIn size={18} /> {vista === 'nueva-clave' ? 'Guardar y entrar' : vista === 'recuperar' ? 'Enviarme el enlace' : 'Entrar'}
        </button>
        {vista === 'login' && (
          <button className="btn-fantasma w-full mt-2" onClick={() => setVista('recuperar')}>Olvidé mi contraseña</button>
        )}
        {vista === 'recuperar' && (
          <button className="btn-fantasma w-full mt-2" onClick={() => setVista('login')}>Volver</button>
        )}
      </div>

      <p className="t-cuerpo text-center mt-6" style={{ fontSize: 16 }}>
        ¿Todavía no tienes cuenta? Tu acceso se crea al comprar — revisa el email de invitación de la clínica.
      </p>
    </div>
  );
}
