/**
 * LA JUGADA — el entregable de afuera, para la sesión del jueves.
 * Un entregable del negocio con su evidencia: foto, link o número. Entrega: miércoles 21:00.
 */
import { useState } from 'react';
import { toast } from 'sonner';
import { Send, Trash2 } from 'lucide-react';
import { listarJugadas, guardarJugada, borrarJugada, hoyIso, getNombre, type Jugada, type PaginaId } from '../lib/estadoCdl';
import { textoJugada, abrirWhatsApp } from '../lib/envio';
import { ventanaEntrega, textoVence, DIA_AFUERA } from '../lib/semana';

const lleno = (t?: string) => (t ?? '').trim().length >= 3;

export default function JugadaPage({ navegar }: { navegar: (p: PaginaId) => void }) {
  const [lista, setLista] = useState<Jugada[]>(listarJugadas());
  const [que, setQue] = useState('');
  const [evidencia, setEvidencia] = useState('');
  const v = ventanaEntrega(DIA_AFUERA);

  function enviar(j: Jugada) {
    abrirWhatsApp(textoJugada(j, getNombre()));
    guardarJugada({ ...j, enviado: hoyIso() });
    setLista(listarJugadas());
  }

  function entregar() {
    const j: Jugada = { id: String(Date.now()), fecha: hoyIso(), que: que.trim(), evidencia: evidencia.trim() };
    guardarJugada(j);
    setLista(listarJugadas()); setQue(''); setEvidencia('');
    toast.success('Jugada registrada.');
    enviar(j);
  }

  return (
    <div className="pantalla pt-6 pb-28 pagina-anim">
      <p className="t-micro" style={{ color: 'var(--acento)' }}>La tarea del miércoles · {textoVence(v)}</p>
      <h1 className="t-display mt-3 mb-4">La Jugada</h1>
      <p className="t-cuerpo mb-7">Lo que quedó comprometido para el negocio el jueves pasado, entregado. Con evidencia: una foto, un link o un número.</p>

      <p className="t-sub mb-3">¿Qué entregas?</p>
      <textarea className="w-full px-5 py-4 mb-5" style={{ minHeight: 110 }} placeholder="Entrego…"
        value={que} onChange={(e) => setQue(e.target.value)} />
      <p className="t-sub mb-3">La evidencia</p>
      <textarea className="w-full px-5 py-4" style={{ minHeight: 90 }} placeholder="El link, el número o qué muestra la foto"
        value={evidencia} onChange={(e) => setEvidencia(e.target.value)} />

      <button className="btn-primario w-full mt-6 flex items-center justify-center gap-2" disabled={!lleno(que) || !lleno(evidencia)} onClick={entregar}>
        <Send size={18} /> Entregar y enviar a mi terapeuta
      </button>
      <p className="t-cuerpo mt-3" style={{ fontSize: 16 }}>Si la evidencia es una foto, adjúntala en el mismo chat de WhatsApp.</p>

      {lista.length > 0 && (
        <div className="mt-10">
          <p className="t-micro mb-4" style={{ color: 'var(--texto-tenue)' }}>Tus jugadas</p>
          {[...lista].reverse().map((j) => (
            <div key={j.id} className="py-4" style={{ borderBottom: '1px solid var(--borde)' }}>
              <p className="t-micro mb-2" style={{ color: 'var(--texto-tenue)' }}>
                {new Date(j.fecha + 'T12:00:00').toLocaleDateString('es', { day: 'numeric', month: 'long' })}{j.enviado ? ' · enviada' : ''}
              </p>
              <p className="t-sub mb-1">{j.que}</p>
              <p className="t-cuerpo" style={{ fontSize: 17 }}>{j.evidencia}</p>
              <div className="flex gap-4 mt-2">
                <button className="btn-fantasma flex items-center gap-2" style={{ padding: 0 }} onClick={() => enviar(j)}><Send size={16} /> Reenviar</button>
                <button className="btn-fantasma flex items-center gap-2" style={{ padding: 0 }}
                  onClick={() => { if (confirm('¿Borrar esta Jugada?')) { borrarJugada(j.id); setLista(listarJugadas()); } }}><Trash2 size={16} /> Borrar</button>
              </div>
            </div>
          ))}
        </div>
      )}

      <button className="btn-secundario w-full mt-8" onClick={() => navegar('hoy')}>Volver a Hoy</button>
    </div>
  );
}
