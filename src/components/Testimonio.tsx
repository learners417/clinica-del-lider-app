/**
 * EL TESTIMONIO DEL ALTA — las preguntas de Javo, una por pantalla.
 * Se responde antes de ver el certificado. Contarlo es parte del cierre:
 * reconocer lo que uno hizo también es trabajo.
 * El paciente decide si lo comparte con su terapeuta.
 */
import { useState } from 'react';
import { toast } from 'sonner';
import { Send } from 'lucide-react';
import { getTestimonio, guardarTestimonio, getNombre, hoyIso, type Testimonio } from '../lib/estadoCdl';
import { MODO_NUBE } from '../lib/supabase';
import { abrirWhatsApp } from '../lib/envio';
import { Chips } from './ui';

export const PREGUNTAS_TESTIMONIO = [
  { id: 'llegaste', pregunta: '¿Cómo llegaste a la Clínica?', ayuda: 'Cómo estabas ese día. Lo que hacía falta que cambiara.' },
  { id: 'si', pregunta: '¿Qué te terminó de dar el sí?', ayuda: 'Hubo resistencias. ¿Qué pudo más que ellas?' },
  { id: 'primeras', pregunta: '¿Cómo fueron tus primeras semanas?', ayuda: 'La noche, el costo, lo que cortaste.' },
  { id: 'cambio', pregunta: '¿Qué cambió?', ayuda: 'En tu cuerpo, en tu casa, en tu negocio. Con un ejemplo de esta semana.' },
  { id: 'revertir', pregunta: '¿Hay alguna posibilidad de que esto se revierta?', ayuda: 'O sientes que ya es tuyo. ¿Por qué?' },
] as const;

const DIEZ = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'];

function nuevo(): Testimonio {
  return { fecha: hoyIso(), respuestas: {}, compartido: false, cerrado: false };
}

export function textoTestimonio(t: Testimonio): string {
  const l = [`*Mi testimonio*${getNombre() ? ` · ${getNombre()}` : ''}`];
  for (const p of PREGUNTAS_TESTIMONIO) {
    const r = t.respuestas[p.id]?.trim();
    if (r) l.push('', `*${p.pregunta}*`, r);
  }
  if (t.recomienda) l.push('', `*Del 1 al 10, lo recomiendo:* ${t.recomienda}`);
  if (t.respuestas.aquien?.trim()) l.push(`*A quién:* ${t.respuestas.aquien.trim()}`);
  if (t.respuestas.ledirias?.trim()) l.push(`*Qué le diría:* ${t.respuestas.ledirias.trim()}`);
  return l.join('\n');
}

export default function TestimonioFlujo({ onTerminado }: { onTerminado: () => void }) {
  const [t, setT] = useState<Testimonio>(() => getTestimonio() ?? nuevo());
  const [paso, setPaso] = useState(() => (getTestimonio()?.cerrado ? PREGUNTAS_TESTIMONIO.length + 1 : 0));

  const total = PREGUNTAS_TESTIMONIO.length;
  const esRecomienda = paso === total;
  const esCierre = paso === total + 1;

  function cambiar(p: Partial<Testimonio>) { setT({ ...t, ...p }); }
  function responder(id: string, v: string) { cambiar({ respuestas: { ...t.respuestas, [id]: v } }); }

  function seguir() {
    const siguiente = paso + 1;
    const g = { ...t, cerrado: siguiente > total };
    guardarTestimonio(g);
    setT(g);
    setPaso(siguiente);
    window.scrollTo({ top: 0 });
  }

  function compartir() {
    if (MODO_NUBE) {
      const g = { ...t, compartido: !t.compartido };
      guardarTestimonio(g); setT(g);
      toast.success(g.compartido ? 'Tu terapeuta ya puede leerlo.' : 'Dejó de estar compartido.');
    } else {
      abrirWhatsApp(textoTestimonio(t));
      const g = { ...t, compartido: true };
      guardarTestimonio(g); setT(g);
    }
  }

  const barra = (
    <div className="flex gap-1 mb-7">
      {Array.from({ length: total + 1 }).map((_, i) => (
        <i key={i} className="flex-1" style={{ height: 2, borderRadius: 2, background: i <= paso ? 'var(--acento)' : 'rgba(21,19,15,.12)' }} />
      ))}
    </div>
  );

  if (esCierre) {
    return (
      <div className="text-left pagina-anim">
        <p className="t-micro mb-2" style={{ color: 'var(--acento)' }}>Tu testimonio</p>
        <h2 className="t-titulo mb-3">Lo contaste. Eso también es parte del Alta.</h2>
        <p className="t-cuerpo mb-5">Queda guardado para que lo leas cuando quieras. Tu terapeuta lo ve solo si lo compartes.</p>
        <button className="btn-secundario w-full flex items-center justify-center gap-2" onClick={compartir}>
          <Send size={18} /> {MODO_NUBE ? (t.compartido ? 'Dejar de compartir' : 'Compartirlo con mi terapeuta') : 'Mandarlo a mi terapeuta'}
        </button>
        <button className="btn-primario w-full mt-3" onClick={onTerminado}>Seguir</button>
      </div>
    );
  }

  if (esRecomienda) {
    return (
      <div className="text-left pagina-anim" key="recomienda">
        {barra}
        <p className="t-micro mb-2" style={{ color: 'var(--acento)' }}>Tu testimonio · {total + 1} de {total + 1}</p>
        <h2 className="t-titulo mb-4">Del 1 al 10, ¿qué tanto lo recomendarías?</h2>
        <Chips opciones={DIEZ} valor={t.recomienda ? String(t.recomienda) : undefined} onChange={(v) => cambiar({ recomienda: Number(v) })} />
        <p className="t-sub mt-6 mb-2">¿A quién?</p>
        <textarea className="w-full px-5 py-3" style={{ minHeight: 80 }} placeholder="A alguien que…"
          value={t.respuestas.aquien ?? ''} onChange={(e) => responder('aquien', e.target.value)} />
        <p className="t-sub mt-5 mb-2">¿Qué le dirías?</p>
        <textarea className="w-full px-5 py-3" style={{ minHeight: 100 }} placeholder="Le diría que…"
          value={t.respuestas.ledirias ?? ''} onChange={(e) => responder('ledirias', e.target.value)} />
        <button className="btn-primario w-full mt-6" disabled={!t.recomienda} onClick={seguir}>Cerrar mi testimonio</button>
        <button className="btn-fantasma w-full mt-1" onClick={() => setPaso(paso - 1)}>Volver</button>
      </div>
    );
  }

  const p = PREGUNTAS_TESTIMONIO[paso];
  const r = t.respuestas[p.id] ?? '';
  return (
    <div className="text-left pagina-anim" key={p.id}>
      {barra}
      <p className="t-micro mb-2" style={{ color: 'var(--acento)' }}>Tu testimonio · {paso + 1} de {total + 1}</p>
      <h2 className="t-titulo mb-2">{p.pregunta}</h2>
      <p className="t-cuerpo mb-5">{p.ayuda}</p>
      <textarea className="w-full px-5 py-4" style={{ minHeight: 170 }} placeholder="Escribe como lo contarías en voz alta."
        value={r} onChange={(e) => responder(p.id, e.target.value)} />
      <button className="btn-primario w-full mt-5" disabled={r.trim().length < 3} onClick={seguir}>Seguir</button>
      <button className="btn-fantasma w-full mt-1" onClick={() => (paso > 0 ? setPaso(paso - 1) : onTerminado())}>
        {paso > 0 ? 'Volver' : 'Lo hago después'}
      </button>
    </div>
  );
}
