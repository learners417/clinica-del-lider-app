/** El Botiquín de Urgencia — siempre disponible puertas adentro. Primera ayuda, no tratamiento. */
import { useEffect, useState, type ReactNode } from 'react';
import { Cross } from 'lucide-react';
import { AudioJavo } from '../components/Contenido';
import { HERRAMIENTAS, BOTIQUIN_AVISO, type Herramienta } from '../data/botiquin';

export default function Botiquin() {
  const [activa, setActiva] = useState<Herramienta | null>(null);
  if (activa) return <HerramientaGuiada h={activa} onSalir={() => setActiva(null)} />;

  return (
    <div className="pantalla pt-6 pb-28">
      <p className="t-micro flex items-center gap-1.5" style={{ color: 'var(--zona-roja)' }}><Cross size={13} strokeWidth={2.6} /> El Botiquín de Urgencia</p>
      <div className="mt-4"><AudioJavo id="pausa3" titulo="La Pausa de 3 minutos" /></div>
      <h1 className="text-xl font-extrabold mt-1 mb-1">Para el momento crítico</h1>
      <p className="text-sm mb-5" style={{ color: 'var(--texto-suave)' }}>Herramientas de 2 a 3 minutos. Gratis, siempre — pase lo que pase con tu plan.</p>
      <div className="space-y-3">
        {HERRAMIENTAS.map((h) => (
          <button key={h.id} className="tarjeta tarjeta-hover w-full text-left p-5" onClick={() => setActiva(h)}>
            <div className="flex items-center gap-3">
              <span className="grid place-items-center rounded-2xl flex-none" style={{ width: 48, height: 48, background: 'var(--acento-tinte)' }}>
                <h.Icono size={22} color="var(--acento)" />
              </span>
              <div>
                <p className="t-sub" style={{ fontSize: 16 }}>{h.nombre}</p>
                <p className="t-cuerpo" style={{ fontSize: 16 }}>{h.cuando}</p>
              </div>
            </div>
          </button>
        ))}
      </div>
      <div className="tarjeta p-4 mt-6" style={{ borderColor: 'var(--borde-fuerte)' }}>
        <p className="text-base leading-relaxed" style={{ color: 'var(--texto-suave)' }}>{BOTIQUIN_AVISO}</p>
      </div>
    </div>
  );
}

function HerramientaGuiada({ h, onSalir }: { h: Herramienta; onSalir: () => void }) {
  const [empezo, setEmpezo] = useState(false);
  const [i, setI] = useState(0);
  const [seg, setSeg] = useState(h.pasos[0].dur);
  const [inhala, setInhala] = useState(true);

  const paso = h.pasos[i];
  const ultimo = i === h.pasos.length - 1;

  useEffect(() => {
    if (!empezo) return;
    setSeg(h.pasos[i].dur);
    const int = setInterval(() => {
      setSeg((s) => (s <= 1 ? 0 : s - 1));
    }, 1000);
    return () => clearInterval(int);
  }, [i, empezo, h.pasos]);

  // Animación de respiración: alterna inhala/exhala
  useEffect(() => {
    if (!empezo || !paso.respirar) return;
    const ritmo = paso.respirar === 'ciclo' ? 3500 : 5000;
    const int = setInterval(() => setInhala((v) => !v), ritmo);
    return () => clearInterval(int);
  }, [empezo, paso]);

  if (!empezo) {
    return (
      <PantallaBotiquin onSalir={onSalir}>
        <span className="inline-grid place-items-center rounded-3xl mb-4" style={{ width: 64, height: 64, background: 'var(--acento-tinte)' }}>
          <h.Icono size={30} color="var(--acento)" />
        </span>
        <h2 className="t-titulo mb-3">{h.nombre}</h2>
        <p className="text-sm leading-relaxed mb-6" style={{ color: 'var(--texto-suave)' }}>{h.intro}</p>
        <button className="btn-cobre w-full" onClick={() => setEmpezo(true)}>Empezar ahora</button>
      </PantallaBotiquin>
    );
  }

  return (
    <PantallaBotiquin onSalir={onSalir}>
      <p className="text-base font-bold uppercase tracking-widest mb-5" style={{ color: 'var(--calido)' }}>{h.nombre} · {i + 1}/{h.pasos.length}</p>
      {paso.respirar && (
        <div className={`circulo-respirar mb-6 ${inhala ? 'inhala' : 'exhala'}`} />
      )}
      <h2 className="text-xl font-extrabold mb-2">{paso.titulo}</h2>
      <p className="text-sm leading-relaxed mb-4" style={{ color: 'var(--texto-suave)' }}>{paso.sub}</p>
      {seg > 0 && <p className="text-base mb-4" style={{ color: 'var(--texto-tenue)' }}>{seg}s…</p>}
      {!ultimo && <button className="btn-primario w-full" onClick={() => setI(i + 1)}>Siguiente →</button>}
      {ultimo && (
        <>
          <p className="voz-maestro mb-5">{h.cierre}</p>
          <button className="btn-primario w-full" onClick={onSalir}>Volví a mí. Salir</button>
        </>
      )}
    </PantallaBotiquin>
  );
}

function PantallaBotiquin({ children, onSalir }: { children: ReactNode; onSalir: () => void }) {
  return (
    <div className="pantalla pt-6 pb-28 text-center">
      <button className="block text-left text-sm font-bold mb-6" style={{ color: 'var(--texto-tenue)' }} onClick={onSalir}>‹ Salir</button>
      {children}
    </div>
  );
}
