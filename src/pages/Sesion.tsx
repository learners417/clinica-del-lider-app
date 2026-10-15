/**
 * LA SESIÓN — entrada y cierre dentro de la app.
 *
 * Entrada (5 min): el compromiso anterior (cumplido o no, con el dato),
 * la emoción, el número y una cosa para lograr en esta hora.
 * Cierre (10 min): su verdad con sus palabras, la escala del 1 al 10,
 * qué falta para 10 y un compromiso con día y hora que va al calendario.
 */
import { useState } from 'react';
import { toast } from 'sonner';
import { CalendarPlus } from 'lucide-react';
import {
  getSesionHoy, guardarSesion, compromisoPendiente, hoyIso, listarSesiones,
  type Sesion, type PaginaId,
} from '../lib/estadoCdl';
import { Chips } from '../components/ui';
import { urlCalendario, DIA_AFUERA } from '../lib/semana';
import { MEDIDAS } from '../data/arbol';

const DIEZ = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'];
const lleno = (t?: string) => (t ?? '').trim().length >= 3;

export default function SesionPage({ navegar }: { navegar: (p: PaginaId) => void }) {
  const [sesion, setSesion] = useState<Sesion>(() => getSesionHoy() ?? {
    fecha: hoyIso(), trabajado: '', compromiso: '',
    tipo: new Date().getDay() === DIA_AFUERA ? 'afuera' : 'adentro',
  });
  const [pendiente, setPendiente] = useState<Sesion | null>(compromisoPendiente());
  const entradaHecha = Boolean(getSesionHoy());
  const [fase, setFase] = useState<'entrada' | 'cierre' | 'hecha'>(
    sesion.cerrada ? 'hecha' : entradaHecha ? 'cierre' : 'entrada',
  );

  const cambiar = (p: Partial<Sesion>) => setSesion({ ...sesion, ...p });

  function marcarAnterior(cumplido: boolean) {
    if (!pendiente) return;
    guardarSesion({ ...pendiente, cumplido });
    setPendiente(null);
  }

  function guardarEntrada() {
    guardarSesion(sesion);
    toast.success('Entrada registrada. Buena sesión.');
    setFase('cierre');
    window.scrollTo({ top: 0 });
  }

  function guardarCierre() {
    const s = { ...sesion, cerrada: true };
    guardarSesion(s);
    setSesion(s);
    setFase('hecha');
    toast.success('Sesión cerrada.');
    window.scrollTo({ top: 0 });
  }

  const puedeEntrar = !pendiente && Boolean(sesion.llegada) && lleno(sesion.trabajado);
  const puedeCerrar = lleno(sesion.verdad) && Boolean(sesion.escala)
    && (sesion.escala === 10 || lleno(sesion.falta)) && lleno(sesion.compromiso) && Boolean(sesion.cuando)
    && Boolean(sesion.medida);

  /* ── Hecha ── */
  if (fase === 'hecha') {
    const cuando = sesion.cuando ? new Date(sesion.cuando) : null;
    return (
      <div className="pantalla pt-6 pb-28 pagina-anim">
        <p className="t-micro" style={{ color: 'var(--acento)' }}>Sesión de {sesion.tipo === 'afuera' ? 'afuera' : 'adentro'} · cerrada</p>
        <h1 className="t-display mt-3 mb-5">Lo que te llevas.</h1>
        <p className="voz-maestro mb-6" style={{ fontSize: 21 }}>{sesion.verdad}</p>
        <div className="tarjeta p-5 mb-4">
          <p className="t-micro mb-2" style={{ color: 'var(--texto-tenue)' }}>Tu compromiso</p>
          <p className="t-titulo mb-2">{sesion.compromiso}</p>
          {cuando && <p className="t-cuerpo">{cuando.toLocaleString('es', { weekday: 'long', day: 'numeric', month: 'long', hour: '2-digit', minute: '2-digit' })}</p>}
          {sesion.medida && (
            <p className="t-cuerpo mt-3" style={{ color: 'var(--acento)' }}>
              Mueve tu {MEDIDAS.find((m) => m.id === sesion.medida)?.nombre}
            </p>
          )}
        </div>
        {cuando && (
          <a className="btn-primario w-full flex items-center justify-center gap-2" target="_blank" rel="noopener noreferrer"
            href={urlCalendario(`Mi compromiso · ${sesion.compromiso}`, `Lo que me llevo: ${sesion.verdad ?? ''}`, cuando)}>
            <CalendarPlus size={19} /> Ponerlo en mi calendario
          </a>
        )}
        <p className="t-cuerpo mt-5">Al empezar la próxima sesión vas a marcar si lo cumpliste.</p>
        <button className="btn-secundario w-full mt-6" onClick={() => navegar('hoy')}>Volver a Hoy</button>
      </div>
    );
  }

  /* ── Cierre ── */
  if (fase === 'cierre') {
    return (
      <div className="pantalla pt-6 pb-28 pagina-anim">
        <p className="t-micro" style={{ color: 'var(--acento)' }}>El cierre · los últimos 10 minutos</p>
        <h1 className="t-display mt-3 mb-3">¿Qué te llevas?</h1>
        <p className="t-cuerpo mb-5">Tu verdad de hoy, con tus palabras.</p>
        <textarea className="w-full px-5 py-4 mb-7" style={{ minHeight: 120 }} placeholder="Me llevo…"
          value={sesion.verdad ?? ''} onChange={(e) => cambiar({ verdad: e.target.value })} />

        <p className="t-sub mb-3">Del 1 al 10, ¿qué tan claro te quedó?</p>
        <Chips opciones={DIEZ} valor={sesion.escala ? String(sesion.escala) : undefined} onChange={(v) => cambiar({ escala: Number(v) })} />
        {sesion.escala !== undefined && sesion.escala < 10 && <>
          <p className="t-sub mt-6 mb-3">¿Qué falta para 10?</p>
          <textarea className="w-full px-5 py-4" style={{ minHeight: 90 }} placeholder="Me falta…"
            value={sesion.falta ?? ''} onChange={(e) => cambiar({ falta: e.target.value })} />
        </>}

        <p className="t-sub mt-7 mb-3">¿A qué te comprometes? Algo que se pueda ver.</p>
        <textarea className="w-full px-5 py-4 mb-4" style={{ minHeight: 90 }} placeholder="Voy a…"
          value={sesion.compromiso} onChange={(e) => cambiar({ compromiso: e.target.value })} />
        <p className="t-sub mb-3">¿Cuándo?</p>
        <input type="datetime-local" className="w-full px-5 py-3"
          value={sesion.cuando ?? ''} onChange={(e) => cambiar({ cuando: e.target.value })} />

        <p className="t-sub mt-7 mb-2">Si cumples eso, ¿qué medida de tu Tablero se mueve?</p>
        <p className="t-cuerpo mb-4">Una. Es la que vas a mirar en la medición del día 42 y del 84.</p>
        <div className="space-y-2">
          {MEDIDAS.map((m) => (
            <button key={m.id} className="tarjeta tarjeta-hover w-full text-left p-4" style={{
              borderColor: sesion.medida === m.id ? 'var(--acento)' : undefined,
              background: sesion.medida === m.id ? 'var(--acento-tinte)' : undefined,
            }} onClick={() => cambiar({ medida: m.id })}>
              <span className="t-sub">{m.nombre}</span>
              <span className="t-cuerpo block" style={{ fontSize: 16, color: 'var(--texto-tenue)' }}>{m.descriptor}</span>
            </button>
          ))}
        </div>

        <button className="btn-primario w-full mt-7" disabled={!puedeCerrar} onClick={guardarCierre}>Cerrar la sesión</button>
        <button className="btn-fantasma w-full mt-1" onClick={() => navegar('hoy')}>Volver</button>
      </div>
    );
  }

  /* ── Entrada ── */
  const anteriores = listarSesiones().filter((s) => s.fecha < hoyIso() && s.cumplido !== undefined);
  const cumplidos = anteriores.filter((s) => s.cumplido).length;
  return (
    <div className="pantalla pt-6 pb-28 pagina-anim">
      <p className="t-micro" style={{ color: 'var(--acento)' }}>La entrada · los primeros 5 minutos</p>
      <h1 className="t-display mt-3 mb-5">Empieza la sesión.</h1>

      <div className="flex gap-2 mb-7">
        {(['adentro', 'afuera'] as const).map((t) => (
          <button key={t} className="btn-secundario flex-1" style={{
            minHeight: 50, fontSize: 16,
            borderColor: sesion.tipo === t ? 'var(--acento)' : undefined,
            background: sesion.tipo === t ? 'var(--acento-tinte)' : undefined,
          }} onClick={() => cambiar({ tipo: t })}>
            {t === 'adentro' ? 'Adentro' : 'Afuera'}
          </button>
        ))}
      </div>

      {pendiente && (
        <div className="tarjeta p-5 mb-7" style={{ borderColor: 'var(--hairline-acento)' }}>
          <p className="t-micro mb-2" style={{ color: 'var(--acento)' }}>La revisión</p>
          <p className="t-sub mb-1">¿Cumpliste?</p>
          <p className="t-titulo mb-4">{pendiente.compromiso}</p>
          <div className="flex gap-2">
            <button className="btn-secundario flex-1" style={{ minHeight: 50, borderColor: 'var(--zona-verde)', color: 'var(--zona-verde)' }} onClick={() => marcarAnterior(true)}>Sí</button>
            <button className="btn-secundario flex-1" style={{ minHeight: 50, borderColor: 'var(--zona-roja)', color: 'var(--zona-roja)' }} onClick={() => marcarAnterior(false)}>No</button>
          </div>
        </div>
      )}
      {!pendiente && anteriores.length > 0 && (
        <p className="t-cuerpo mb-7">Compromisos cumplidos: <b>{cumplidos} de {anteriores.length}</b>.</p>
      )}

      <p className="t-sub mb-3">¿Con qué emoción llegas?</p>
      <input className="w-full px-5 py-3 mb-6" placeholder="Una palabra"
        value={sesion.emocion ?? ''} onChange={(e) => cambiar({ emocion: e.target.value })} />

      <p className="t-sub mb-3">¿Qué número te pones hoy?</p>
      <Chips opciones={DIEZ} valor={sesion.llegada ? String(sesion.llegada) : undefined} onChange={(v) => cambiar({ llegada: Number(v) })} />

      <p className="t-sub mt-7 mb-3">¿Una cosa que podamos lograr en esta hora?</p>
      <textarea className="w-full px-5 py-4" style={{ minHeight: 100 }} placeholder="En esta hora quiero…"
        value={sesion.trabajado} onChange={(e) => cambiar({ trabajado: e.target.value })} />

      <button className="btn-primario w-full mt-7" disabled={!puedeEntrar} onClick={guardarEntrada}>Empezar</button>
      <button className="btn-fantasma w-full mt-1" onClick={() => navegar('hoy')}>Volver</button>
    </div>
  );
}
