/** La Dosis — la unidad diaria del Reinicio: Señal → Acción → Registro. */
import { useEffect, useState } from 'react';
import { CheckCircle2, ArrowRight, Lock, Stethoscope } from 'lucide-react';
import { DOSIS, faseDeDia, TOTAL_DIAS } from '../data/protocolo';
import { AudioJavo, VideoJavo } from '../components/Contenido';
import { calcularFocos, refuerzoDelDia } from '../lib/enfasis';
import { vibrar, LATIDO_HECHO } from '../lib/haptics';
import { getUltimoChequeo as ultimoChequeoEnfasis } from '../lib/estadoCdl';
import { getProtocolo, marcarDosisHecha, proximaDosis, diaDelProtocolo, getEntradaHoy, getUltimoChequeo } from '../lib/estadoCdl';
import type { PaginaId } from '../lib/estadoCdl';

export default function DosisPage({ navegar }: { navegar: (p: PaginaId) => void }) {
  const protocolo = getProtocolo();
  useEffect(() => { if (!protocolo) navegar('hoy'); }, [protocolo]);
  if (!protocolo) return null;
  const dia = proximaDosis(protocolo);
  const diaActual = Math.min(diaDelProtocolo(protocolo), TOTAL_DIAS);

  // Tratamiento completo: las 90 hechas
  if (protocolo.dosisHechas.length >= TOTAL_DIAS) {
    return (
      <div className="pantalla pt-10 pb-28 text-center">
        <CheckCircle2 size={44} color="var(--acento)" className="mx-auto mb-4 reveal-zona" />
        <h1 className="t-titulo mb-2">Las 90 Dosis: hechas.</h1>
        <p className="t-cuerpo mb-6">El Tratamiento está completo. Tu bitácora y tu comparación de mediciones te esperan en la pestaña Tratamiento.</p>
        <button className="btn-primario w-full" onClick={() => navegar('tratamiento')}>Ver mi día 85</button>
      </div>
    );
  }

  // Al día: la de hoy está hecha — la de mañana se libera mañana (dosificación real)
  if (dia > diaActual) {
    return (
      <div className="pantalla pt-10 pb-28 text-center">
        <CheckCircle2 size={44} color="var(--acento)" className="mx-auto mb-4" />
        <h1 className="t-titulo mb-2">Por hoy, hecho.</h1>
        <p className="t-cuerpo mb-6">La Dosis del Día {dia} se libera mañana. El Tratamiento dosifica a propósito: un día, una acción. Hoy ya hiciste la tuya.</p>
        <button className="btn-primario w-full" onClick={() => navegar('hoy')}>Volver a Hoy</button>
      </div>
    );
  }
  const dosis = DOSIS.find((d) => d.dia === dia);
  const fase = faseDeDia(dia);
  const [hecha, setHecha] = useState(false);
  const diarioHoy = Boolean(getEntradaHoy());
  const necesitaChequeo = dia === 1 && !getUltimoChequeo();

  if (!dosis) {
    // Día sin dosis escrita todavía (>14 en v0.5)
    return (
      <div className="pantalla pt-6 pb-28">
        <button className="btn-fantasma pl-0" onClick={() => navegar('hoy')}>‹ Volver</button>
        <p className="t-micro mt-2" style={{ color: 'var(--acento)' }}>Fase {fase.id} · {fase.nombre} · Día {dia} de {TOTAL_DIAS}</p>
        <h1 className="t-titulo mt-2 mb-3">Tu próxima Dosis se libera al avanzar.</h1>
        <p className="t-cuerpo mb-4">Las Dosis de esta fase están en producción clínica — se liberan antes de que llegues. Mientras tanto, tu trabajo de hoy sigue siendo el mismo de siempre:</p>
        <button className="btn-primario w-full" onClick={() => navegar('hoy')}>Registrar mis Signos Vitales</button>
      </div>
    );
  }

  function terminar() {
    marcarDosisHecha(dosis!.dia);
    vibrar(LATIDO_HECHO);
    setHecha(true);
  }

  if (hecha) {
    return (
      <div className="pantalla pt-10 pb-28 text-center">
        <CheckCircle2 size={44} color="var(--acento)" className="mx-auto mb-4 reveal-zona" />
        <h1 className="t-titulo mb-2">Dosis del Día {dosis.dia}: hecha.</h1>
        <p className="t-cuerpo mb-6">El registro cierra el día. Tus Signos Vitales son la evidencia de tu Tratamiento.</p>
        {!diarioHoy && <button className="btn-primario w-full mb-3" onClick={() => navegar('hoy')}>Cerrar con mis Signos Vitales</button>}
        <button className="btn-secundario w-full" onClick={() => navegar('hoy')}>Volver a Hoy</button>
      </div>
    );
  }

  return (
    <div className="pantalla pt-6 pb-28">
      <button className="btn-fantasma pl-0" onClick={() => navegar('hoy')}>‹ Salir</button>
      <p className="t-micro mt-2" style={{ color: 'var(--acento)' }}>Fase {fase.id} · {fase.nombre} · Día {dosis.dia} de {TOTAL_DIAS}</p>
      <h1 className="t-display mt-2 mb-1">{dosis.titulo}</h1>
      <p className="t-micro mb-5" style={{ color: 'var(--texto-tenue)' }}>{dosis.duracion} · una sola acción</p>

      <VideoJavo dia={dosis.dia} />
      <div className="tarjeta p-5 mb-4">
        <p className="t-micro mb-2" style={{ color: 'var(--calido)' }}>La Señal</p>
        <p className={dosis.maestro ? 'voz-maestro' : 't-cuerpo'} style={dosis.maestro ? undefined : { fontSize: 15.5 }}>{dosis.senal}</p>
      </div>

      <div className="tarjeta p-5 mb-6" style={{ borderColor: 'var(--hairline-acento)' }}>
        <p className="t-micro mb-2" style={{ color: 'var(--acento)' }}>La Acción de hoy</p>
        <p className="t-sub" style={{ fontSize: 15.5, lineHeight: '24px' }}>{dosis.accion}</p>
      </div>

      {(() => {
        const ch = ultimoChequeoEnfasis();
        if (!ch) return null;
        const r = refuerzoDelDia(dosis.dia, calcularFocos(ch.rueda));
        if (!r) return null;
        return (
          <div className="tarjeta p-4 mb-4" style={{ borderColor: r.foco.color }}>
            <p className="t-micro mb-1.5" style={{ color: r.foco.color }}>Tu énfasis · {r.foco.nombre}</p>
            <p className="t-cuerpo" style={{ fontSize: 13.5 }}>{r.texto}</p>
          </div>
        );
      })()}
      {[4, 7, 18, 19].includes(dosis.dia) && <AudioJavo id="apagado" titulo="El Apagado" />}
      {[27, 60, 76].includes(dosis.dia) && <AudioJavo id="senal" titulo="La Señal" />}
      {dosis.dia === 79 && <AudioJavo id="carta" titulo="La Carta, guiada" />}
      {[44, 45, 48].includes(dosis.dia) && <AudioJavo id="despliegue" titulo="El Despliegue" />}
      {necesitaChequeo && (
        <button className="btn-primario w-full mb-3" onClick={() => navegar('chequeo')}>Hacer mi Chequeo primero (7 min)</button>
      )}
      <button
        className={necesitaChequeo ? 'btn-secundario w-full' : 'btn-primario w-full'}
        disabled={necesitaChequeo}
        onClick={terminar}
      >
        <span className="flex items-center justify-center gap-2">{necesitaChequeo ? 'El Día 1 empieza midiendo' : 'Hecha'} <ArrowRight size={18} /></span>
      </button>
      <button className="btn-fantasma w-full mt-2 flex items-center justify-center gap-2" onClick={() => navegar('clinico')}>
        <Stethoscope size={15} /> Pregúntale al Clínico sobre esta Dosis
      </button>
      <p className="t-cuerpo mt-2 text-center" style={{ fontSize: 12 }}>Si hoy no puedes, la Dosis te espera. El protocolo no castiga — mide.</p>
    </div>
  );
}
