/** La Clínica del Líder — modo NUBE (login + accesos gestionados) o modo LOCAL (Puerta + códigos). */
import { useEffect, useState } from 'react';
import { Home, HeartPulse, Activity, Cross, ShieldCheck, LogOut } from 'lucide-react';
import Puerta from './pages/Puerta';
import Login from './pages/Login';
import Admin from './pages/Admin';
import Hoy from './pages/Hoy';
import NochePage from './pages/Noche';
import DosisPage from './pages/Dosis';
import Tratamiento from './pages/Tratamiento';
import Chequeo from './pages/Chequeo';
import Botiquin from './pages/Botiquin';
import Zona from './pages/Zona';
import Clinico from './pages/Clinico';
import IcebergPage from './pages/Iceberg';
import BotiquinFab from './components/BotiquinFab';
import Arranque from './components/Arranque';
import Logo from './components/Logo';
import { getPagina, setPagina, getAcceso, sembrarAccesoLocal, puedeGuardar, type PaginaId } from './lib/estadoCdl';
import { supabase, MODO_NUBE, getAccesoNube, type AccesoNube } from './lib/supabase';

const NAV: { id: PaginaId; label: string; Icon: typeof Home }[] = [
  { id: 'hoy', label: 'Hoy', Icon: Home },
  { id: 'tratamiento', label: 'Tratamiento', Icon: HeartPulse },
  { id: 'zona', label: 'Mi Zona', Icon: Activity },
  { id: 'botiquin', label: 'Botiquín', Icon: Cross },
];

type EstadoNube = 'cargando' | 'login' | 'sin-acceso' | 'listo';

export default function App() {
  const [pagina, setPaginaState] = useState<PaginaId>(getPagina());
  const [estadoNube, setEstadoNube] = useState<EstadoNube>(MODO_NUBE ? 'cargando' : 'listo');
  const [accesoNube, setAccesoNube] = useState<AccesoNube | null>(null);

  function navegar(p: PaginaId) {
    setPagina(p);
    setPaginaState(p);
    window.scrollTo({ top: 0 });
  }

  async function cargarAcceso() {
    const a = await getAccesoNube();
    if (!a) { setEstadoNube('sin-acceso'); return; }
    sembrarAccesoLocal(a.tier, a.fecha_inicio);
    setAccesoNube(a);
    setEstadoNube('listo');
  }

  useEffect(() => {
    if (!MODO_NUBE || !supabase) return;
    const hashEspecial = window.location.hash.includes('type=invite') || window.location.hash.includes('type=recovery');
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session || hashEspecial) setEstadoNube('login');
      else cargarAcceso();
    });
    const { data: sub } = supabase.auth.onAuthStateChange((evento) => {
      if (evento === 'SIGNED_OUT') { setAccesoNube(null); setEstadoNube('login'); }
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  async function salir() {
    await supabase?.auth.signOut();
  }

  function alEntrar() {
    window.history.replaceState(null, '', window.location.pathname);
    setEstadoNube('cargando');
    cargarAcceso();
  }

  // ══ Sin almacenamiento no hay app: todo el camino vive en este dispositivo ══
  if (!puedeGuardar()) {
    return (
      <div className="min-h-screen">
        <header className="pantalla pt-5"><Logo onClick={() => {}} /></header>
        <main className="pantalla pt-12 pagina-anim">
          <h1 className="t-display mb-5">Tu navegador no nos deja guardar nada.</h1>
          <p className="t-cuerpo mb-4">
            Todo tu camino —tus mediciones, tus días, lo que escribes— vive en este teléfono.
            Sin permiso para guardar, nada de eso se conserva.
          </p>
          <p className="t-cuerpo mb-4">
            Suele pasar por dos motivos: estás en una ventana de incógnito, o el navegador tiene
            bloqueados los datos de este sitio.
          </p>
          <p className="t-cuerpo">
            Abre este enlace en una ventana normal e instálalo como app desde el menú del navegador.
            Después vuelve a entrar y sigues donde estabas.
          </p>
        </main>
      </div>
    );
  }

  // ══ MODO NUBE: pantallas de acceso ══
  if (MODO_NUBE && estadoNube === 'cargando') return <Arranque />;
  if (MODO_NUBE && estadoNube === 'login') {
    return (
      <div className="min-h-screen">
        <header className="pantalla pt-5 flex items-center justify-between">
          <Logo onClick={() => {}} />
          <span className="t-micro" style={{ color: 'var(--texto-tenue)' }}>clínica digital</span>
        </header>
        <main className="pagina-anim"><Login onEntro={alEntrar} /></main>
      </div>
    );
  }
  if (MODO_NUBE && estadoNube === 'sin-acceso') {
    return (
      <div className="min-h-screen">
        <header className="pantalla pt-5"><Logo onClick={() => {}} /></header>
        <main className="pantalla pt-10 text-center pagina-anim">
          <h1 className="t-titulo mb-2">Tu cuenta existe — tu acceso todavía no.</h1>
          <p className="t-cuerpo mb-6">Escríbenos por WhatsApp con el email de tu compra y lo activamos en minutos.</p>
          <button className="btn-secundario w-full" onClick={salir}>Cerrar sesión</button>
        </main>
      </div>
    );
  }

  // ══ MODO LOCAL: la Puerta con códigos (mientras Supabase no esté configurado) ══
  const accesoLocal = getAcceso();
  if (!MODO_NUBE && accesoLocal === 'ninguno') {
    return (
      <div className="min-h-screen">
        <header className="pantalla pt-5 flex items-center justify-between">
          <Logo onClick={() => {}} />
          <span className="t-micro" style={{ color: 'var(--texto-tenue)' }}>clínica digital</span>
        </header>
        <main className="pagina-anim"><Puerta onActivado={() => navegar('hoy')} /></main>
      </div>
    );
  }

  const esAdmin = accesoNube?.rol === 'admin';
  const nav = esAdmin ? [...NAV, { id: 'admin' as PaginaId, label: 'Admin', Icon: ShieldCheck }] : NAV;
  const enFlujo = pagina === 'chequeo' || pagina === 'dosis' || pagina === 'noche' || pagina === 'clinico';

  return (
    <div className="min-h-screen">
      <aside className="sidebar">
        <div className="px-2 mb-8"><Logo onClick={() => navegar('hoy')} /></div>
        <nav className="flex flex-col gap-1.5 flex-1">
          {nav.map(({ id, label, Icon }) => (
            <button key={id} className={`sidebar-item ${pagina === id ? 'activo' : ''}`} onClick={() => navegar(id)}>
              <Icon size={19} strokeWidth={pagina === id ? 2.2 : 1.8} />
              {label}
            </button>
          ))}
        </nav>
        {MODO_NUBE && (
          <button className="sidebar-item mb-2" onClick={salir}><LogOut size={18} /> Cerrar sesión</button>
        )}
        <p className="t-micro px-2" style={{ color: 'var(--texto-tenue)' }}>La única clínica cuyo objetivo<br />es darte el alta.</p>
      </aside>

      <div className="con-sidebar">
        <header className="pantalla pt-5 flex items-center justify-between lg:hidden">
          <Logo onClick={() => navegar('hoy')} />
          {MODO_NUBE
            ? <button className="btn-fantasma flex items-center gap-1.5 pr-0" onClick={salir}><LogOut size={14} /> Salir</button>
            : <span className="t-micro" style={{ color: 'var(--texto-tenue)' }}>clínica digital</span>}
        </header>

        <main key={pagina} className="pagina-anim lg:pt-8">
          {pagina === 'hoy' && <Hoy navegar={navegar} />}
          {pagina === 'noche' && <NochePage navegar={navegar} />}
          {pagina === 'dosis' && <DosisPage navegar={navegar} />}
          {pagina === 'tratamiento' && <Tratamiento navegar={navegar} />}
          {pagina === 'chequeo' && <Chequeo onTerminado={() => navegar('hoy')} onSalir={() => navegar('hoy')} />}
          {pagina === 'botiquin' && <Botiquin />}
          {pagina === 'zona' && <Zona irAlChequeo={() => navegar('chequeo')} />}
          {pagina === 'iceberg' && <IcebergPage navegar={navegar} />}
          {pagina === 'clinico' && <Clinico navegar={navegar} />}
          {pagina === 'admin' && (esAdmin ? <Admin /> : <Hoy navegar={navegar} />)}
        </main>
      </div>

      {!enFlujo && pagina !== 'botiquin' && <BotiquinFab onClick={() => navegar('botiquin')} />}

      {!enFlujo && (
        <nav className="nav-inferior">
          {nav.map(({ id, label, Icon }) => (
            <button key={id} className={`nav-item ${pagina === id ? 'activo' : ''}`} onClick={() => navegar(id)}>
              <Icon size={21} strokeWidth={pagina === id ? 2.3 : 1.8} />
              {label}
            </button>
          ))}
        </nav>
      )}
    </div>
  );
}
