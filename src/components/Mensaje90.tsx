/** EL MENSAJE AL DÍA 84 — el paciente le escribe al que va a terminar. Se sella. Se abre en el Alta. */
import { useState } from 'react';
import { toast } from 'sonner';
import { Mail, MailOpen, Lock } from 'lucide-react';
import {
  getProtocolo, diaDelProtocolo, getMensaje90, sellarMensaje90, abrirMensaje90, puedeAbrirMensaje90,
} from '../lib/estadoCdl';
import { TOTAL_DIAS } from '../data/protocolo';
import { vibrar, LATIDO_HITO } from '../lib/haptics';

/* ══ La tarjeta que vive en HOY: sellar temprano · esperar · abrir al final ══ */
export function Mensaje90Tarjeta({ onAbrir }: { onAbrir?: () => void } = {}) {
  const [texto, setTexto] = useState('');
  const [, setV] = useState(0);
  const p = getProtocolo();
  if (!p) return null;

  const dia = Math.min(diaDelProtocolo(p), TOTAL_DIAS);
  const mensaje = getMensaje90();

  // 1 · Todavía no lo escribió (se ofrece en los primeros 20 días)
  if (!mensaje) {
    if (dia > 20) return null;
    return (
      <div className="tarjeta p-5 mb-4">
        <p className="flex items-center gap-2 t-sub mb-1"><Mail size={17} color="var(--calido)" /> Tu mensaje al día 84</p>
        <p className="t-cuerpo mb-3" style={{ fontSize: 16 }}>
          Escríbele unas líneas al hombre que va a terminar esto. No un discurso: la verdad de hoy — cómo estás
          llegando, por qué empezaste, qué no quieres olvidar. Se sella ahora y se abre solo el día 84, con tus
          números al lado.
        </p>
        <textarea
          value={texto}
          onChange={(e) => setTexto(e.target.value)}
          rows={4}
          placeholder="Hoy llego así…"
          className="w-full px-3 py-3 resize-none mb-3"
          style={{ fontSize: 16 }}
        />
        <button
          className="btn-secundario w-full"
          disabled={texto.trim().length < 30}
          onClick={() => {
            sellarMensaje90(texto.trim());
            vibrar(LATIDO_HITO);
            setTexto('');
            setV((v) => v + 1);
            toast.success('Sellado. Nos vemos el día 84.');
          }}
        >
          {texto.trim().length < 30 ? 'Escribe unas líneas más' : 'Sellar mi mensaje'}
        </button>
      </div>
    );
  }

  // 3 · Llegó el día 84 y todavía no lo abrió
  if (puedeAbrirMensaje90() && !mensaje.abierto) {
    return (
      <button
        className="tarjeta tarjeta-hover w-full text-left p-5 mb-4"
        style={{ borderColor: 'var(--acento)', borderWidth: 2 }}
        onClick={() => { abrirMensaje90(); vibrar(LATIDO_HITO); setV((v) => v + 1); onAbrir?.(); }}
      >
        <p className="flex items-center gap-2 t-sub mb-1"><MailOpen size={17} color="var(--acento)" /> Tu mensaje te espera</p>
        <p className="t-cuerpo" style={{ fontSize: 16 }}>Lo escribiste el Día {mensaje.dia}. Hoy se abre.</p>
      </button>
    );
  }

  // 4 · Ya lo abrió: queda a mano
  if (mensaje.abierto) return <Mensaje90Reveal compacto />;

  // 2 · Sellado, esperando
  return (
    <div className="tarjeta p-4 mb-4 flex items-center gap-3">
      <Lock size={17} color="var(--texto-tenue)" className="flex-none" />
      <p className="t-cuerpo" style={{ fontSize: 16 }}>
        Tu mensaje al día 84 está sellado. Se abre en <b>{TOTAL_DIAS - dia} días</b>.
      </p>
    </div>
  );
}

/* ══ La revelación: en la ceremonia del Alta y en el Tratamiento ══ */
export function Mensaje90Reveal({ compacto = false }: { compacto?: boolean }) {
  const mensaje = getMensaje90();
  if (!mensaje) return null;
  return (
    <div className={`tarjeta p-5 ${compacto ? 'mb-4' : 'mb-4 reveal-zona'}`} style={{ borderColor: 'var(--calido)' }}>
      <p className="flex items-center gap-2 t-sub mb-1"><MailOpen size={17} color="var(--calido)" /> Tu mensaje, escrito el Día {mensaje.dia}</p>
      <p className="t-micro mb-3" style={{ color: 'var(--texto-tenue)' }}>
        {new Date(mensaje.fecha + 'T12:00:00').toLocaleDateString('es')}
      </p>
      <p className="t-cuerpo" style={{ whiteSpace: 'pre-wrap', fontSize: 16, fontStyle: 'italic' }}>{mensaje.texto}</p>
      {!compacto && (
        <p className="t-cuerpo mt-4" style={{ fontSize: 16 }}>Eso escribió el que empezó. Léelo entero antes de seguir.</p>
      )}
    </div>
  );
}
