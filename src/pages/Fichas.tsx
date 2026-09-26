/**
 * FICHAS — la pantalla del terapeuta (rol equipo o admin).
 * Una lista de pacientes con la barandilla arriba de todo, y la ficha de cada uno:
 * lo de esta semana, sus números, su último Iceberg, su última sesión y su Jugada.
 */
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { RefreshCw, ChevronLeft, ChevronRight, AlertTriangle } from 'lucide-react';
import { supabase, type AccesoNube } from '../lib/supabase';
import {
  normalizarIceberg, type ChequeoGuardado, type EntradaDiario, type Iceberg, type Jugada, type Sesion, type ProtocoloActivo,
  type Consentimiento, type Columnas, type Testimonio, type LineaSemana,
} from '../lib/estadoCdl';
import { barandillaPendiente, aTiempo, promedio } from '../lib/ficha';
import { lineasDe, escribirLinea } from '../lib/lineas';
import { PREGUNTAS_TESTIMONIO } from '../components/Testimonio';
import { DIA_ADENTRO, DIA_AFUERA } from '../lib/semana';
import { indiceJugador } from '../data/arbol';
import { semanaDeDia, TOTAL_DIAS } from '../data/camino';

interface Barandilla { paciente_id: string; chequeo_fecha: string; hablada_en: string; nota: string }
type Estado = Record<string, unknown>;

const fecha = (iso?: string) => iso ? new Date(iso.length <= 10 ? iso + 'T12:00:00' : iso).toLocaleDateString('es', { day: 'numeric', month: 'long' }) : '';

function diaDe(fechaInicio: string): number {
  const d = Math.floor((Date.now() - new Date(fechaInicio + 'T00:00:00').getTime()) / 86400000) + 1;
  return Math.max(1, Math.min(d, TOTAL_DIAS));
}

function Dato({ titulo, valor, bien }: { titulo: string; valor: string; bien?: boolean }) {
  return (
    <div className="py-3" style={{ borderBottom: '1px solid var(--borde)' }}>
      <p className="t-micro mb-1" style={{ color: 'var(--texto-tenue)' }}>{titulo}</p>
      <p className="t-sub" style={{ color: bien === undefined ? undefined : bien ? 'var(--zona-verde)' : 'var(--zona-roja)' }}>{valor}</p>
    </div>
  );
}

function Linea({ t, v }: { t: string; v?: string }) {
  if (!v || !v.trim()) return null;
  return <p className="t-cuerpo mb-2"><b>{t}:</b> {v}</p>;
}

export default function Fichas() {
  const [pacientes, setPacientes] = useState<AccesoNube[]>([]);
  const [chequeos, setChequeos] = useState<Record<string, ChequeoGuardado[]>>({});
  const [barandillas, setBarandillas] = useState<Barandilla[]>([]);
  const [abierto, setAbierto] = useState<AccesoNube | null>(null);
  const [estado, setEstado] = useState<Estado>({});
  const [cargando, setCargando] = useState(false);
  const [nota, setNota] = useState('');
  const [lineas, setLineas] = useState<LineaSemana[]>([]);
  const [linea, setLinea] = useState('');

  async function cargarLista() {
    if (!supabase) return;
    setCargando(true);
    const [a, c, b] = await Promise.all([
      supabase.from('accesos').select('*').eq('rol', 'paciente').order('creado_en', { ascending: false }),
      supabase.from('estado_paciente').select('user_id, valor').eq('clave', 'cdl_chequeos'),
      supabase.from('barandilla').select('*'),
    ]);
    if (a.error) toast.error(a.error.message);
    setPacientes((a.data as AccesoNube[]) ?? []);
    setChequeos(Object.fromEntries((c.data ?? []).map((f: { user_id: string; valor: unknown }) => [f.user_id, f.valor as ChequeoGuardado[]])));
    setBarandillas((b.data as Barandilla[]) ?? []);
    setCargando(false);
  }

  async function abrir(p: AccesoNube) {
    if (!supabase) return;
    setAbierto(p); setEstado({}); setNota(''); setLinea(''); setLineas([]);
    const [{ data, error }, ls] = await Promise.all([
      supabase.from('estado_paciente').select('clave, valor').eq('user_id', p.user_id),
      lineasDe(p.user_id),
    ]);
    if (error) { toast.error(error.message); return; }
    setEstado(Object.fromEntries((data ?? []).map((f: { clave: string; valor: unknown }) => [f.clave, f.valor])));
    setLineas(ls);
    window.scrollTo({ top: 0 });
  }

  async function marcarHablada(pacienteId: string, chequeoFecha: string) {
    if (!supabase) return;
    const { data: { user } } = await supabase.auth.getUser();
    const { error } = await supabase.from('barandilla').upsert({ paciente_id: pacienteId, chequeo_fecha: chequeoFecha, hablada_por: user?.id, nota: nota.trim() });
    if (error) { toast.error(error.message); return; }
    toast.success('Barandilla marcada como hablada.');
    await cargarLista();
  }

  async function mandarLinea(pacienteId: string) {
    const error = await escribirLinea(pacienteId, linea);
    if (error) { toast.error(error); return; }
    toast.success('La línea ya está en su Hoy.');
    setLinea('');
    setLineas(await lineasDe(pacienteId));
  }

  useEffect(() => { void cargarLista(); }, []);

  const habladasDe = (id: string) => barandillas.filter((b) => b.paciente_id === id).map((b) => b.chequeo_fecha);
  const pendienteDe = (id: string) => barandillaPendiente(chequeos[id] ?? [], habladasDe(id));

  /* ── La ficha ── */
  if (abierto) {
    const nombre = (estado.cdl_nombre as string) || abierto.email;
    const chs = (estado.cdl_chequeos as ChequeoGuardado[]) ?? [];
    const diario = (estado.cdl_diario as EntradaDiario[]) ?? [];
    const icebergs = ((estado.cdl_iceberg as Iceberg[]) ?? []).map(normalizarIceberg);
    const sesiones = (estado.cdl_sesiones as Sesion[]) ?? [];
    const jugadas = (estado.cdl_jugadas as Jugada[]) ?? [];
    const protocolo = estado.cdl_protocolo as ProtocoloActivo | undefined;
    const inicio = protocolo?.fechaInicio ?? abierto.fecha_inicio;
    const dia = diaDe(inicio);
    const pend = pendienteDe(abierto.user_id);
    const hoy = new Date();

    const iceAT = aTiempo(icebergs.filter((i) => i.cerrado).map((i) => i.cerradoEn ?? i.fecha), DIA_ADENTRO, hoy, inicio);
    const jugAT = aTiempo(jugadas.map((j) => j.fecha), DIA_AFUERA, hoy, inicio);
    const revisadas = sesiones.filter((s) => s.cumplido !== undefined);
    const cumplidas = revisadas.filter((s) => s.cumplido).length;
    const escala = promedio(sesiones.map((s) => s.escala ?? NaN));
    const u7 = diario.slice(-7);
    const ultimoIce = icebergs.filter((i) => i.bloqueo.trim()).slice(-1)[0];
    const ultimaSes = sesiones.slice(-1)[0];
    const ultimaJug = jugadas.slice(-1)[0];
    const d0 = chs[0], ult = chs[chs.length - 1];
    const consentimiento = estado.cdl_consentimiento as Consentimiento | undefined;
    const descargas = (estado.cdl_descargas as string[]) ?? [];
    const columnas = (estado.cdl_columnas as Columnas[]) ?? [];
    const testimonio = estado.cdl_testimonio as Testimonio | undefined;

    return (
      <div className="pantalla pt-6 pb-28 pagina-anim">
        <button className="btn-fantasma flex items-center gap-1 pl-0 mb-3" onClick={() => setAbierto(null)}><ChevronLeft size={18} /> Pacientes</button>
        <p className="t-micro" style={{ color: 'var(--acento)' }}>Día {dia} · semana {semanaDeDia(dia).n} · {semanaDeDia(dia).nombre}</p>
        <h1 className="t-display mt-2 mb-2">{nombre}</h1>
        <p className="t-cuerpo mb-6" style={{ fontSize: 16 }}>
          {consentimiento ? `Consentimiento firmado el ${fecha(consentimiento.fecha)}` : 'Todavía no firmó el consentimiento'}
        </p>

        {pend && (
          <div className="tarjeta p-5 mb-5" style={{ borderColor: 'var(--zona-roja)', borderWidth: 2 }}>
            <p className="flex items-center gap-2 t-sub mb-2" style={{ color: 'var(--zona-roja)' }}><AlertTriangle size={19} /> La barandilla</p>
            <p className="t-cuerpo mb-3">
              El Chequeo del {fecha(pend.fecha)} marcó derivación{pend.phq9.motivoItem9 ? ' por el ítem 9' : ` (PHQ-9: ${pend.phq9.total})`}.
              Esta conversación abre la próxima sesión, antes que cualquier Iceberg, y se coordina con quien lo atienda.
            </p>
            <textarea className="w-full px-4 py-3 mb-3" style={{ minHeight: 80 }} placeholder="Qué se habló y con quién se coordinó"
              value={nota} onChange={(e) => setNota(e.target.value)} />
            <button className="btn-primario w-full" disabled={nota.trim().length < 3} onClick={() => marcarHablada(abierto.user_id, pend.fecha)}>Marcar como hablada</button>
          </div>
        )}

        <div className="tarjeta p-5 mb-5" style={{ borderColor: 'var(--hairline-acento)' }}>
          <p className="t-micro mb-2" style={{ color: 'var(--acento)' }}>La línea de su semana</p>
          <p className="t-cuerpo mb-3">Una frase. Le aparece fijada arriba de todo en Hoy.</p>
          <textarea className="w-full px-4 py-3" style={{ minHeight: 90 }} maxLength={280} placeholder="Esta semana…"
            value={linea} onChange={(e) => setLinea(e.target.value)} />
          <button className="btn-primario w-full mt-3" disabled={linea.trim().length < 3} onClick={() => mandarLinea(abierto.user_id)}>Fijarla en su Hoy</button>
          {lineas.map((l) => (
            <div key={l.id} className="py-3" style={{ borderBottom: '1px solid var(--borde)' }}>
              <p className="t-micro mb-1" style={{ color: 'var(--texto-tenue)' }}>{fecha(l.fecha)}</p>
              <p className="t-cuerpo">{l.texto}</p>
            </div>
          ))}
        </div>

        <div className="tarjeta p-5 mb-5">
          <p className="t-micro mb-1" style={{ color: 'var(--acento)' }}>La validación</p>
          <Dato titulo="Iceberg a tiempo (últimas semanas)" valor={iceAT.total ? `${iceAT.hechas} de ${iceAT.total}` : 'Todavía sin semanas vencidas'} bien={iceAT.total ? iceAT.hechas / iceAT.total >= 0.9 : undefined} />
          <Dato titulo="Jugada a tiempo (últimas semanas)" valor={jugAT.total ? `${jugAT.hechas} de ${jugAT.total}` : 'Todavía sin semanas vencidas'} bien={jugAT.total ? jugAT.hechas / jugAT.total >= 0.9 : undefined} />
          <Dato titulo="Compromisos cumplidos" valor={revisadas.length ? `${cumplidas} de ${revisadas.length}` : 'Sin revisar todavía'} bien={revisadas.length ? cumplidas / revisadas.length >= 0.8 : undefined} />
          <Dato titulo="Escala de cierre promedio" valor={escala !== null ? `${escala} / 10` : 'Sin sesiones cerradas'} bien={escala !== null ? escala >= 8 : undefined} />
        </div>

        <div className="tarjeta p-5 mb-5">
          <p className="t-micro mb-2" style={{ color: 'var(--acento)' }}>Sus números</p>
          {d0 && <p className="t-cuerpo mb-2"><b>Índice del Jugador:</b> {indiceJugador(d0.rueda)} el Día 0{ult && ult !== d0 ? ` · ${indiceJugador(ult.rueda)} el ${fecha(ult.fecha)}` : ''}</p>}
          {u7.length ? (
            <p className="t-cuerpo mb-2"><b>Últimos {u7.length} días:</b> sueño {promedio(u7.map((e) => e.horasSueno))} hs · trabajo {promedio(u7.map((e) => e.horasTrabajo))} hs · energía {promedio(u7.map((e) => e.energia))}/5</p>
          ) : <p className="t-cuerpo mb-2">Sin Signos registrados.</p>}
          {u7.filter((e) => e.nota.trim()).slice(-3).map((e) => (
            <p key={e.fecha} className="t-cuerpo" style={{ fontSize: 16, fontStyle: 'italic' }}>{fecha(e.fecha)} · “{e.nota}”</p>
          ))}
        </div>

        <div className="tarjeta p-5 mb-5">
          <p className="t-micro mb-2" style={{ color: 'var(--acento)' }}>Su último Iceberg {ultimoIce ? `· ${fecha(ultimoIce.fecha)}${ultimoIce.cerrado ? '' : ' · sin terminar'}` : ''}</p>
          {!ultimoIce ? <p className="t-cuerpo">Todavía no hizo ninguno.</p> : <>
            <Linea t="Lo que se ve" v={ultimoIce.bloqueo} />
            {(ultimoIce.mentiras ?? []).filter((m) => m.trim()).map((m, k) => (
              <p key={k} className="t-cuerpo mb-1" style={{ fontWeight: k === ultimoIce.fuerte ? 700 : 400 }}>
                {k === ultimoIce.fuerte ? '★ ' : '· '}{m}{ultimoIce.test?.[`m${k}`] ? ` · ${ultimoIce.test[`m${k}`]}` : ''}
              </p>
            ))}
            <div className="mb-2" />
            <Linea t="El miedo" v={ultimoIce.miedo} />
            <Linea t="El dolor" v={ultimoIce.dolor} />
            <Linea t={`El origen${ultimoIce.edad ? ` (a los ${ultimoIce.edad})` : ''}`} v={ultimoIce.origen} />
            <Linea t="Lo que le dice" v={ultimoIce.perdon} />
            <Linea t="La prueba de este mes" v={ultimoIce.hecho} />
            {ultimoIce.antes && ultimoIce.despues ? <p className="t-cuerpo mb-2"><b>Cuánto cree la frase:</b> {ultimoIce.antes}/10 → {ultimoIce.despues}/10</p> : null}
            <Linea t="El permiso" v={ultimoIce.verdad} />
            {!ultimoIce.cerrado && <p className="t-sub mt-2" style={{ color: 'var(--acento)' }}>Se trabó acá: la sesión empieza en la primera capa vacía.</p>}
          </>}
        </div>

        <div className="tarjeta p-5 mb-5">
          <p className="t-micro mb-2" style={{ color: 'var(--acento)' }}>Su última sesión {ultimaSes ? `· ${fecha(ultimaSes.fecha)} · ${ultimaSes.tipo ?? ''}` : ''}</p>
          {!ultimaSes ? <p className="t-cuerpo">Sin sesiones registradas.</p> : <>
            <Linea t="Objetivo" v={ultimaSes.trabajado} />
            <Linea t="Se llevó" v={ultimaSes.verdad} />
            {ultimaSes.escala ? <p className="t-cuerpo mb-2"><b>Claridad:</b> {ultimaSes.escala}/10{ultimaSes.falta ? ` · le falta: ${ultimaSes.falta}` : ''}</p> : null}
            <Linea t="Compromiso" v={ultimaSes.compromiso ? `${ultimaSes.compromiso}${ultimaSes.cuando ? ` · ${new Date(ultimaSes.cuando).toLocaleString('es', { weekday: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}` : ''}` : ''} />
          </>}
        </div>

        <div className="tarjeta p-5 mb-5">
          <p className="t-micro mb-2" style={{ color: 'var(--acento)' }}>Su última Jugada {ultimaJug ? `· ${fecha(ultimaJug.fecha)}` : ''}</p>
          {!ultimaJug ? <p className="t-cuerpo">Sin jugadas entregadas.</p> : <>
            <Linea t="Entregó" v={ultimaJug.que} />
            <Linea t="Evidencia" v={ultimaJug.evidencia} />
          </>}
        </div>

        <div className="tarjeta p-5 mb-5">
          <p className="t-micro mb-2" style={{ color: 'var(--acento)' }}>Sus Descargas</p>
          <p className="t-cuerpo">{descargas.length
            ? `${descargas.length} en total · la última el ${fecha(descargas[descargas.length - 1])}. El texto no se guarda: pregúntale qué frase le costó más escribir.`
            : 'Todavía no hizo ninguna.'}</p>
        </div>

        {columnas.map((c) => (
          <div key={c.dia} className="tarjeta p-5 mb-5">
            <p className="t-micro mb-2" style={{ color: 'var(--acento)' }}>Sus dos columnas · día {c.dia}</p>
            <Linea t="Le faltó recibir" v={c.recibir} />
            <Linea t="Faltó de sí" v={c.demi} />
          </div>
        ))}

        {testimonio?.compartido && (
          <div className="tarjeta p-5 mb-5">
            <p className="t-micro mb-2" style={{ color: 'var(--acento)' }}>Su testimonio · compartido</p>
            {PREGUNTAS_TESTIMONIO.map((p) => <Linea key={p.id} t={p.pregunta} v={testimonio.respuestas[p.id]} />)}
            {testimonio.recomienda ? <p className="t-cuerpo mb-2"><b>Lo recomienda:</b> {testimonio.recomienda}/10</p> : null}
            <Linea t="A quién" v={testimonio.respuestas.aquien} />
            <Linea t="Qué le diría" v={testimonio.respuestas.ledirias} />
          </div>
        )}

        <button className="btn-secundario w-full" onClick={() => abrir(abierto)}>Actualizar la ficha</button>
      </div>
    );
  }

  /* ── La lista ── */
  const ordenados = [...pacientes].sort((a, b) =>
    Number(Boolean(pendienteDe(b.user_id))) - Number(Boolean(pendienteDe(a.user_id)))
    || Number(b.tier === 'acompanado') - Number(a.tier === 'acompanado'));

  return (
    <div className="pantalla pt-6 pb-28 pagina-anim">
      <div className="flex items-center justify-between mb-1">
        <p className="t-micro" style={{ color: 'var(--acento)' }}>El equipo</p>
        <button className="btn-fantasma flex items-center gap-1.5" onClick={cargarLista} disabled={cargando}>
          <RefreshCw size={15} className={cargando ? 'pulso-latido' : ''} /> Actualizar
        </button>
      </div>
      <h1 className="t-display mt-2 mb-6">Fichas</h1>
      {pacientes.length === 0 && !cargando && <p className="t-cuerpo">Todavía no hay pacientes.</p>}
      {ordenados.map((p) => {
        const pend = pendienteDe(p.user_id);
        return (
          <button key={p.user_id} className="tarjeta tarjeta-hover w-full text-left p-4 mb-3 flex items-center gap-3"
            style={{ borderColor: pend ? 'var(--zona-roja)' : undefined }} onClick={() => abrir(p)}>
            <span className="flex-1 min-w-0">
              <span className="t-sub block" style={{ overflowWrap: 'anywhere' }}>{p.email}</span>
              <span className="t-cuerpo block" style={{ fontSize: 16 }}>
                {p.tier === 'acompanado' ? 'Acompañado' : p.tier === 'solo' ? 'Solo' : 'Apaga la Cabeza'} · día {diaDe(p.fecha_inicio)}
              </span>
              {pend && <span className="t-sub block mt-1" style={{ color: 'var(--zona-roja)', fontSize: 16 }}>Barandilla sin hablar</span>}
            </span>
            <ChevronRight size={18} color="var(--texto-tenue)" className="flex-none" />
          </button>
        );
      })}
    </div>
  );
}
