/**
 * EL ANCLA — una sola frase, escrita por el paciente, que se le muestra todos los días.
 *
 * Es lo que lo devuelve: la frase que le apareció a él en una sesión o en una
 * tarea, con sus palabras. La app no la interpreta y no la mejora: la repite.
 * Por eso se escribe una vez y queda arriba de Hoy, antes de cualquier número.
 */
import { useState } from 'react';
import { toast } from 'sonner';
import { Anchor, Pencil } from 'lucide-react';
import { getAncla, setAncla } from '../lib/estadoCdl';

export default function Ancla() {
  const [texto, setTexto] = useState(getAncla());
  const [editando, setEditando] = useState(false);
  const [borrador, setBorrador] = useState(texto);

  function guardar() {
    const limpio = borrador.trim();
    if (limpio.length < 3) return;
    setAncla(limpio);
    setTexto(limpio);
    setEditando(false);
    toast.success('Tu ancla queda acá todos los días.');
  }

  if (editando) {
    return (
      <div className="tarjeta p-5 mb-5" style={{ borderLeft: '2px solid var(--acento)' }}>
        <p className="t-micro mb-3" style={{ color: 'var(--acento)' }}>Tu ancla</p>
        <p className="t-cuerpo mb-4">
          Una frase tuya, la que te devuelve cuando te vas. Con tus palabras, como te salió.
        </p>
        <textarea className="w-full px-5 py-4 mb-4" style={{ minHeight: 110 }} placeholder="La frase es…"
          value={borrador} onChange={(e) => setBorrador(e.target.value)} />
        <button className="btn-primario w-full" disabled={borrador.trim().length < 3} onClick={guardar}>
          Guardar mi ancla
        </button>
        <button className="btn-fantasma w-full mt-1" onClick={() => { setBorrador(texto); setEditando(false); }}>
          Volver
        </button>
      </div>
    );
  }

  if (!texto) {
    return (
      <button className="tarjeta tarjeta-hover w-full text-left p-5 mb-5 flex items-center gap-3"
        onClick={() => setEditando(true)}>
        <Anchor size={20} style={{ color: 'var(--acento)', flexShrink: 0 }} />
        <span className="t-sub">Escribe tu ancla</span>
      </button>
    );
  }

  return (
    <div className="tarjeta p-5 mb-5" style={{ borderLeft: '2px solid var(--acento)' }}>
      <div className="flex items-start justify-between gap-3">
        <p className="voz-maestro" style={{ fontSize: 21, lineHeight: 1.35 }}>{texto}</p>
        <button className="btn-fantasma" style={{ padding: 6 }} aria-label="Cambiar mi ancla"
          onClick={() => { setBorrador(texto); setEditando(true); }}>
          <Pencil size={18} />
        </button>
      </div>
    </div>
  );
}
