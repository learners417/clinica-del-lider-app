/** EL TRATAMIENTO — con protocolo activo: el mapa, los Sistemas, los hitos, la bitácora. Sin él: la oferta. */
import { useMemo, useState } from 'react';
import { toast } from 'sonner';
import { useState as useStateAlta } from 'react';
import { Check, Circle, Activity, BookOpen, Award } from 'lucide-react';
import CertificadoAlta from '../components/CertificadoAlta';
import { Mensaje90Reveal } from '../components/Mensaje90';
import { getMensaje90 } from '../lib/estadoCdl';
import { zonaDesdeCbi } from '../data/zonas';
import { getNombre } from '../lib/estadoCdl';
import { PuntoZona } from '../components/ui';
import { validarCodigo } from '../lib/codigosFundador';
import { FASES_VITAL, HITOS, DOSIS_ESCRITAS, TOTAL_DIAS, faseDeDia } from '../data/protocolo';
import { SISTEMAS, estadoSistema, ESTADO_SISTEMA_LABEL } from '../data/sistemas';
import { calcularFocos } from '../lib/enfasis';
import { estadoMedida as descriptorArea } from '../data/arbol';
import { HITO_MEDIO, HITO_CONTRATO, SUBIDA_CONTRATO } from '../data/camino';
import { indiceJugador } from '../data/arbol';
import {
  getProtocolo, activarProtocolo, diaDelProtocolo, proximaDosis, listarChequeos,
  listarBitacora, listarDiario, calcularRacha, fechaDia90, type PaginaId,
} from '../lib/estadoCdl';

export default function Tratamiento({ navegar }: { navegar: (p: PaginaId) => void }) {
  const protocolo = getProtocolo();
  // Sin Chequeo no hay línea de partida contra la cual medir nada.
  if (protocolo && listarChequeos().length === 0) {
    return (
      <div className="pantalla pt-10 pb-28 pagina-anim">
        <p className="t-micro" style={{ color: 'var(--acento)' }}>Antes de empezar</p>
        <h1 className="t-display mt-3 mb-4">Primero, tu punto de partida.</h1>
        <p className="t-cuerpo mb-7">
          Tu camino ya está activo. Empieza por el Chequeo: sin esa medición no hay contra qué comparar
          el día 42 ni el día 84.
        </p>
        <button className="btn-primario w-full" onClick={() => navegar('chequeo')}>Hacer mi Chequeo</button>
      </div>
    );
  }
  if (protocolo) return <MiTratamiento navegar={navegar} />;
  return <OfertaTratamiento navegar={navegar} />;
}

/* ═══ Sin camino activo: no se vende nada acá, se activa con código ═══ */
function OfertaTratamiento({ navegar }: { navegar: (p: PaginaId) => void }) {
  const [codigo, setCodigo] = useState('');

  function activar() {
    const tier = validarCodigo(codigo);
    if (!tier || tier === 'apaga') { toast.error('Ese código no activa el Tratamiento. Revísalo con la clínica.'); return; }
    activarProtocolo(tier);
    toast.success('El Tratamiento está activo. Empezamos.');
    navegar('hoy');
  }

  return (
    <div className="pantalla pt-6 pb-28">
      <p className="t-micro" style={{ color: 'var(--calido)' }}>El Tratamiento</p>
      <h1 className="t-titulo mt-1 mb-2">84 días en dos viajes. Una acción por día. Tres mediciones.</h1>
      <p className="t-cuerpo mb-2">
        Semanas 1-2: duermes. Semanas 3-5: cortas lo que te drena. Semanas 6-9: reconstruyes — cuerpo, comida,
        orden, y las personas que estabas perdiendo. Semanas 10-12: lo vuelves sistema. Semana 13: el Personaje
        se despide, y el instrumento decide: el alta — o seguimos gratis.
      </p>
      <p className="t-sub mb-6">No te enseñamos a liderar. Te devolvemos el liderazgo sobre ti mismo.</p>

      <div className="tarjeta p-6">
        <p className="t-sub mb-2">Tu camino todavía no está activo.</p>
        <p className="t-cuerpo">Escribe a la clínica y lo activamos con tu código.</p>
      </div>

      <div className="tarjeta p-5 mt-4">
        <p className="t-sub mb-2">¿Tienes tu código del Tratamiento?</p>
        <div className="flex gap-2">
          <input value={codigo} onChange={(e) => setCodigo(e.target.value.toUpperCase())} placeholder="REINICIO-XXXX-XXXX"
            className="flex-1 px-3" style={{ minHeight: 50, fontFamily: 'var(--font-display)', letterSpacing: '0.04em' }} />
          <button className="btn-primario" style={{ minHeight: 50, padding: '0 18px' }} onClick={activar}>Activar</button>
        </div>
      </div>
    </div>
  );
}

/* ═══ Protocolo activo: MI TRATAMIENTO ═══ */
function MiTratamiento({ navegar }: { navegar: (p: PaginaId) => void }) {
  const p = getProtocolo()!;
  const dia = Math.min(diaDelProtocolo(p), TOTAL_DIAS);
  const diaReal = diaDelProtocolo(p);
  const proxima = proximaDosis(p);
  const fase = faseDeDia(dia);
  const bitacora = listarBitacora();

  const hitos = useMemo(() => {
    const racha = calcularRacha();
    const noches7 = listarDiario().slice(-7).filter((e) => e.horasSueno >= 7).length;
    const post = listarChequeos().map((c) => c.fecha.slice(0, 10)).filter((f) => f > p.fechaInicio);
    const fechaMas = (dias: number) => {
      const [y, m, d] = p.fechaInicio.split('-').map(Number);
      const t = new Date(y, m - 1, d + dias);
      return `${t.getFullYear()}-${String(t.getMonth() + 1).padStart(2, '0')}-${String(t.getDate()).padStart(2, '0')}`;
    };
    return {
      'semana-signos': racha >= 7,
      'noches-7h': noches7 >= 5,
      'medicion-medio': post.some((f) => f >= fechaMas(HITO_MEDIO - 1)),
      'medicion-contrato': post.some((f) => f >= fechaMas(HITO_CONTRATO - 1)),
    } as Record<string, boolean>;
  }, [p, dia]);

  const dia91 = diaReal >= TOTAL_DIAS + 1;

  return (
    <div className="pantalla pt-6 pb-28">
      <p className="t-micro" style={{ color: 'var(--acento)' }}>EL EJE · {p.tier === 'acompanado' ? 'Acompañado' : 'Solo'}</p>
      <h1 className="t-titulo mt-1 mb-1">Día {dia} de {TOTAL_DIAS}</h1>
      <p className="t-cuerpo mb-4">Fase {fase.id} · {fase.nombre} — {fase.resumen}</p>
      <div className="barra mb-5"><div style={{ width: `${Math.round((dia / TOTAL_DIAS) * 100)}%`, background: 'var(--acento)' }} /></div>

      {/* día 85: la bitácora se revela */}
      {dia91 && bitacora.length > 0 && (
        <div className="tarjeta p-5 mb-4" style={{ borderColor: 'var(--acento)', borderWidth: 2 }}>
          <p className="flex items-center gap-2 t-sub mb-2"><Award size={17} color="var(--acento)" /> día 85 · Tu historia, escrita por ti</p>
          <p className="t-cuerpo mb-3" style={{ fontSize: 16 }}>A lo largo del camino dejaste {bitacora.length} líneas honestas. Léelas en orden — esa es tu historia real, sin guion. Si quieres, grábate noventa segundos contándola: ese es tu testimonio.</p>
          <div className="space-y-2" style={{ maxHeight: 260, overflowY: 'auto' }}>
            {bitacora.map((l) => (
              <p key={l.fecha} className="t-cuerpo" style={{ fontSize: 16 }}><span className="t-micro" style={{ color: 'var(--texto-tenue)' }}>{l.fecha}</span> — {l.nota}</p>
            ))}
          </div>
        </div>
      )}

      <button className="tarjeta tarjeta-hover w-full text-left p-5 mb-4" style={{ borderColor: 'var(--hairline-acento)' }} onClick={() => navegar('dosis')}>
        <p className="t-micro mb-1" style={{ color: 'var(--acento)' }}>Tu próxima Dosis</p>
        <p className="t-sub" style={{ fontSize: 16 }}>Día {proxima} · {p.dosisHechas.length} hechas</p>
      </button>

      <div className="tarjeta p-5 mb-4">
        <p className="t-sub mb-3">El mapa de las 5 fases</p>
        <div className="space-y-3">
          {FASES_VITAL.map((f) => {
            const activa = f.id === fase.id;
            const pasada = dia > f.dias[1];
            return (
              <div key={f.id} className="flex items-start gap-3" style={{ opacity: activa ? 1 : 0.5 }}>
                <span className="t-dato flex-none" style={{ fontSize: 16, color: pasada ? 'var(--acento)' : activa ? 'var(--texto)' : 'var(--texto-tenue)', width: 20 }}>{f.id}</span>
                <div>
                  <p className="t-sub">{f.nombre} <span className="t-micro" style={{ color: 'var(--texto-tenue)' }}>· D{f.dias[0]}–{f.dias[1]}</span>{activa && <span className="t-micro ml-2" style={{ color: 'var(--acento)' }}>estás aquí</span>}</p>
                </div>
              </div>
            );
          })}
        </div>
        <p className="t-cuerpo mt-3" style={{ fontSize: 16 }}>Las {DOSIS_ESCRITAS} Dosis del Tratamiento están escritas. Se dosifican: una por día, siempre.</p>
      </div>

      {(() => {
        const ch = listarChequeos()[0];
        if (!ch) return null;
        const focos = calcularFocos(ch.rueda);
        return (
          <div className="tarjeta p-5 mb-4">
            <p className="t-sub mb-1">Tus 3 focos</p>
            <p className="t-cuerpo mb-3" style={{ fontSize: 16 }}>Tu Chequeo marcó estas tres áreas como las más caídas. El Tratamiento es el mismo para todos — en tus días clave, el acento va aquí.</p>
            <div className="space-y-2">
              {focos.map((f) => (
                <div key={f.id} className="flex items-center gap-3">
                  <PuntoZona color={f.color} size={10} />
                  <p className="t-sub flex-1" style={{ fontSize: 16 }}>{f.nombre}</p>
                  <span className="t-micro" style={{ color: 'var(--texto-tenue)' }}>{descriptorArea(f.valor)}</span>
                </div>
              ))}
            </div>
          </div>
        );
      })()}

      {/* Los Sistemas Instalados */}
      <div className="tarjeta p-5 mb-4">
        <p className="t-sub mb-1">Tus Sistemas Instalados</p>
        <p className="t-cuerpo mb-3" style={{ fontSize: 16 }}>El Tratamiento no son 90 acciones sueltas: son 10 sistemas que quedan operando. Instalado → sostenido 14 días → tuyo.</p>
        <div className="space-y-2.5">
          {SISTEMAS.map((s) => {
            const est = estadoSistema(s, p.dosisHechas, dia);
            const activo = est !== 'pendiente';
            return (
              <div key={s.id} className="flex items-start gap-2.5" style={{ opacity: activo ? 1 : 0.45 }}>
                {activo ? <Check size={17} color={est === 'tuyo' ? 'var(--acento)' : 'var(--texto-suave)'} className="mt-0.5 flex-none" /> : <Circle size={14} color="var(--texto-tenue)" className="mt-1 flex-none" />}
                <div className="flex-1">
                  <p className="t-sub" style={{ fontSize: 16 }}>{s.nombre}</p>
                  <p className="t-cuerpo" style={{ fontSize: 16 }}>{activo ? s.descripcion : ''}</p>
                </div>
                <span className="t-micro flex-none" style={{ color: est === 'tuyo' ? 'var(--acento)' : 'var(--texto-tenue)' }}>{ESTADO_SISTEMA_LABEL[est]}</span>
              </div>
            );
          })}
        </div>
      </div>

      <div className="tarjeta p-5 mb-4">
        <p className="t-sub mb-3">Tus hitos</p>
        <div className="space-y-2.5">
          {HITOS.map((h) => (
            <div key={h.id} className="flex items-start gap-2.5">
              {hitos[h.id] ? <Check size={17} color="var(--acento)" className="mt-0.5 flex-none" /> : <Circle size={15} color="var(--texto-tenue)" className="mt-1 flex-none" />}
              <div>
                <p className="t-sub" style={{ fontSize: 16, opacity: hitos[h.id] ? 1 : 0.7 }}>{h.nombre}</p>
                <p className="t-cuerpo" style={{ fontSize: 16 }}>{h.descripcion}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="tarjeta p-5 mb-4">
        <p className="flex items-center gap-2 t-sub mb-1"><Activity size={16} color="var(--acento)" /> Tus mediciones</p>
        <p className="t-cuerpo mb-3" style={{ fontSize: 16 }}>Día {HITO_MEDIO} y día {HITO_CONTRATO}, el mismo instrumento. Tu último día: <b>{fechaDia90(p.fechaInicio + 'T12:00:00')}</b>.</p>
        <button className="btn-secundario w-full" disabled={dia < 45} onClick={() => navegar('chequeo')}>
          {dia < HITO_MEDIO ? `La medición se abre el día ${HITO_MEDIO} (faltan ${HITO_MEDIO - dia})` : 'Hacer mi medición oficial'}
        </button>
      </div>

      {bitacora.length > 0 && !dia91 && (
        <div className="tarjeta p-4 mb-4 flex items-center gap-3">
          <BookOpen size={18} color="var(--calido)" className="flex-none" />
          <p className="t-cuerpo" style={{ fontSize: 16 }}>Tu bitácora lleva <b>{bitacora.length} líneas</b>. El día 85 se te revela entera — es tu historia, escrita por ti.</p>
        </div>
      )}

      <MiAlta />

      <div className="flex items-center gap-2 justify-center">
        <PuntoZona color="var(--acento)" size={8} />
        <p className="t-micro" style={{ color: 'var(--texto-tenue)' }}>Garantía por contrato activa</p>
      </div>
    </div>
  );
}

/* El acceso permanente al certificado, cuando está ganado. */
function MiAlta() {
  const [abierto, setAbierto] = useStateAlta(false);
  const p = getProtocolo();
  const chequeos = listarChequeos();
  if (!p || chequeos.length < 2) return null;
  const dia = diaDelProtocolo(p);
  const ultimo = chequeos[chequeos.length - 1];
  const base = chequeos[0];
  const ganado = dia >= HITO_CONTRATO && indiceJugador(ultimo.rueda) - indiceJugador(base.rueda) >= SUBIDA_CONTRATO;
  if (!ganado) return null;
  return (
    <div className="tarjeta p-5 mb-4" style={{ borderColor: 'var(--acento)' }}>
      <p className="flex items-center gap-2 t-sub mb-2"><Award size={17} color="var(--acento)" /> Tu Alta</p>
      {abierto ? (
        <>
          {getMensaje90()?.abierto && <Mensaje90Reveal compacto />}
          <CertificadoAlta nombre={getNombre()} indiceInicial={indiceJugador(base.rueda)} indiceFinal={indiceJugador(ultimo.rueda)} fecha={ultimo.fecha.slice(0, 10)} />
        </>
      ) : (
        <button className="btn-secundario w-full" onClick={() => setAbierto(true)}>Ver mi certificado del Alta</button>
      )}
    </div>
  );
}
