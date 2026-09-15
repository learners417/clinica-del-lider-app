/**
 * El Chequeo 2.0 — la puerta de La Clínica del Líder.
 * Cuatro actos: Conocerte → Medirte → Tu vida → Tu Zona.
 * Autoguardado por respuesta ("la vida interrumpe"): reanuda donde quedó.
 */
import { useEffect, useMemo, useState, type ReactNode } from 'react';
import { toast } from 'sonner';
import { Check, ShieldCheck, Clock3, FileCheck2, Loader2 } from 'lucide-react';
import PulsoAmbiente from '../components/PulsoAmbiente';
import { CBI_ITEMS, CBI_OPCIONES, CBI_SUBESCALA_LABEL, calcularCbi } from '../data/cbi';
import { PHQ9_INTRO, PHQ9_ITEMS, PHQ9_OPCIONES, calcularPhq9 } from '../data/phq9';
import { ENEAGRAMA_TIPOS } from '../data/eneagrama';
import { MEDIDAS, FRECUENCIA, indiceJugador, lectura, focos as focosTablero,
  promedioColumna, puntaje as puntajeMedida, colorPuntaje } from '../data/arbol';
import { HITO_MEDIO, HITO_CONTRATO, SUBIDA_CONTRATO, VIAJES, SEMANAS } from '../data/camino';
import { APAGADORES, VENTANA, VENTANA_MIN, horasDormidas, avisaAlClinico } from '../data/onboarding';
import ArbolTablero from '../components/ArbolTablero';
import { CONTEXTO } from '../data/contexto';
import { ZONAS, zonaDesdeCbi } from '../data/zonas';
import {
  getNombre, setNombre, guardarChequeo, leerBorrador, guardarBorrador, limpiarBorrador,
  fechaDia90, type ChequeoGuardado, type ContextoLider,
} from '../lib/estadoCdl';
import ZonaBadge from '../components/ZonaBadge';
import { Opcion, Chips, Stepper, BarraActos, PuntoZona } from '../components/ui';
import { getProtocolo } from '../lib/estadoCdl';
import CeremoniaMedicion from '../components/CeremoniaMedicion';

const ABIERTAS = [
  { id: 'porquehoy', min: 40, pregunta: '¿Y por qué hoy?', ayuda: 'Algo pasó. Pudiste entrar el año pasado y entraste ahora.' },
  { id: 'costo', min: 60, pregunta: 'Si todo sigue exactamente igual, ¿dónde estás dentro de un año?', ayuda: 'Escribe lo que ves, no lo que temes que pase.' },
  { id: 'oculto', min: 40, pregunta: '¿Qué es lo que no le dices a nadie?', ayuda: 'Esto queda sellado. Se abre el día 84 y lo abres tú.' },
  { id: 'quien', min: 40, pregunta: '¿Quién te necesita entero?', ayuda: 'Con nombre. Y qué cambia para esa persona si lo logras.' },
  { id: 'escena', min: 60, pregunta: 'Un martes a las siete de la tarde, dentro de doce semanas: ¿dónde estás y qué estás haciendo?', ayuda: 'Una escena concreta. Qué se ve, qué se escucha, quién está.' },
];

type Fase =
  | 'intro' | 'contexto'
  | 'cbiIntro' | 'cbi' | 'inter1' | 'inter2'
  | 'phqIntro' | 'phq' | 'derivacion'
  | 'rueda' | 'habitos' | 'eneagrama'
  | 'cuerpo' | 'ventana' | 'palabrasIntro' | 'palabras' | 'firma'
  | 'procesando' | 'resultado' | 'dia90';

const HABITOS_INICIAL = { horasSueno: 6, entrenosSemana: 0, horasTrabajo: 55, cafeinaDia: 2 };

/** Peso acumulado para la barra (encuadre de avance). */
function progresoDe(fase: Fase, ctxIdx: number, cbiIdx: number, phqIdx: number): number {
  const total = 40;
  let hecho = 0;
  const orden: Fase[] = ['intro', 'contexto', 'cbiIntro', 'cbi', 'inter1', 'inter2', 'phqIntro', 'phq', 'derivacion', 'rueda', 'habitos', 'eneagrama', 'cuerpo', 'ventana', 'palabrasIntro', 'palabras', 'firma', 'procesando', 'resultado', 'dia90'];
  const antes = (f: Fase) => orden.indexOf(fase) > orden.indexOf(f);
  hecho += antes('contexto') ? 1 : 0;
  hecho += fase === 'contexto' ? ctxIdx : antes('cbiIntro') ? 4 : 0;
  hecho += antes('cbi') ? 1 : 0;
  hecho += fase === 'cbi' ? cbiIdx : antes('phqIntro') ? 19 : 0;
  hecho += antes('phq') ? 1 : 0;
  hecho += fase === 'phq' ? phqIdx : antes('rueda') ? 9 : 0;
  hecho += antes('habitos') ? 1 : 0;
  hecho += antes('eneagrama') ? 1 : 0;
  hecho += antes('procesando') ? 1 : 0;
  if (fase === 'procesando' || fase === 'resultado' || fase === 'dia90') return 100;
  return Math.min(99, Math.round((hecho / total) * 100));
}

function actoDe(fase: Fase): { n: number; nombre: string } {
  if (fase === 'intro' || fase === 'contexto') return { n: 1, nombre: 'Conocerte' };
  if (['cbiIntro', 'cbi', 'inter1', 'inter2', 'phqIntro', 'phq', 'derivacion'].includes(fase)) return { n: 2, nombre: 'Medirte' };
  if (['rueda', 'habitos', 'eneagrama', 'cuerpo', 'ventana'].includes(fase)) return { n: 3, nombre: 'Tu vida' };
  if (['palabrasIntro', 'palabras', 'firma'].includes(fase)) return { n: 4, nombre: 'En tus palabras' };
  return { n: 4, nombre: 'Tu Zona' };
}

export default function Chequeo({ onTerminado, onSalir }: { onTerminado: () => void; onSalir: () => void }) {
  const borrador = useMemo(() => leerBorrador(), []);
  const faseInicial: Fase = borrador && !['procesando', 'resultado', 'dia90'].includes(borrador.fase)
    ? (borrador.fase as Fase) : 'intro';

  const [fase, setFase] = useState<Fase>(faseInicial);
  const [nombre, setNombreLocal] = useState(borrador?.nombre ?? getNombre());
  const [ctx, setCtx] = useState<Partial<ContextoLider>>(borrador?.contexto ?? {});
  const [ctxIdx, setCtxIdx] = useState(() => borrador ? CONTEXTO.findIndex((p) => !(borrador.contexto ?? {})[p.id]) : 0);
  const [cbiResp, setCbiResp] = useState<Record<string, number>>(borrador?.cbiResp ?? {});
  const [cbiIdx, setCbiIdx] = useState(borrador?.cbiIdx ?? 0);
  const [phqResp, setPhqResp] = useState<Record<string, number>>(borrador?.phqResp ?? {});
  const [phqIdx, setPhqIdx] = useState(borrador?.phqIdx ?? 0);
  const [rueda, setRueda] = useState<Record<string, number>>(
    borrador?.rueda ?? {},
  );
  const [habitos, setHabitos] = useState(borrador?.habitos ?? HABITOS_INICIAL);
  const [eneaSel, setEneaSel] = useState<number[]>(borrador?.eneaSel ?? []);
  const [cuerpo, setCuerpo] = useState(borrador?.cuerpo ?? {
    acoste: '23:30', levante: '07:00', despertares: 0, energia0: 5,
    apagar: [] as number[], ventanaAM: 10, ventanaPM: 10,
  });
  const [palabras, setPalabras] = useState<Record<string, string>>(
    (borrador?.palabras as Record<string, string>) ?? {}
  );
  const [palIdx, setPalIdx] = useState(0);
  const [firma, setFirma] = useState(borrador?.firma ?? '');
  const [guardado, setGuardado] = useState<ChequeoGuardado | null>(null);

  // Aviso de reanudación (una sola vez)
  useEffect(() => {
    if (borrador && faseInicial !== 'intro') toast('Retomamos tu Chequeo donde quedó.', { duration: 2500 });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Autoguardado: cada respuesta persiste.
  useEffect(() => {
    if (fase === 'procesando' || fase === 'resultado' || fase === 'dia90') return;
    guardarBorrador({ fase, nombre, contexto: ctx, cbiResp, cbiIdx, phqResp, phqIdx, rueda, habitos, eneaSel, cuerpo, palabras, firma });
  }, [fase, nombre, ctx, cbiResp, cbiIdx, phqResp, phqIdx, rueda, habitos, eneaSel, cuerpo, palabras, firma]);

  const progreso = progresoDe(fase, Math.max(0, ctxIdx), cbiIdx, phqIdx);
  const acto = actoDe(fase);

  function responderCbi(valor: number) {
    const item = CBI_ITEMS[cbiIdx];
    setCbiResp((r) => ({ ...r, [item.id]: valor }));
    if (cbiIdx === 5) { setCbiIdx(6); setFase('inter1'); return; }
    if (cbiIdx === 12) { setCbiIdx(13); setFase('inter2'); return; }
    if (cbiIdx === 18) { setFase('phqIntro'); return; }
    setCbiIdx(cbiIdx + 1);
  }

  function responderPhq(valor: number) {
    const item = PHQ9_ITEMS[phqIdx];
    const nuevas = { ...phqResp, [item.id]: valor };
    setPhqResp(nuevas);
    if (phqIdx + 1 < PHQ9_ITEMS.length) { setPhqIdx(phqIdx + 1); return; }
    setFase(calcularPhq9(nuevas).derivar ? 'derivacion' : 'rueda');
  }

  function terminarMedicion() {
    const cbi = calcularCbi(cbiResp);
    const phq9 = calcularPhq9(phqResp);
    const chequeo: ChequeoGuardado = {
      fecha: new Date().toISOString(),
      contexto: {
        lidera: ctx.lidera ?? '', personas: ctx.personas ?? '', edad: ctx.edad ?? '', motivo: ctx.motivo ?? '',
      },
      cbi, phq9, rueda, eneagramaTipos: eneaSel, habitos, cuerpo,
      palabras: {
        porquehoy: palabras.porquehoy ?? '', costo: palabras.costo ?? '',
        oculto: palabras.oculto ?? '', quien: palabras.quien ?? '', escena: palabras.escena ?? '',
      },
      firma: firma.trim(),
      zona: zonaDesdeCbi(cbi.promedio).id,
    };
    setNombre(nombre);
    guardarChequeo(chequeo);
    limpiarBorrador();
    setGuardado(chequeo);
    setFase('procesando');
  }

  /* ═══════════ ACTO 1 · CONOCERTE ═══════════ */

  if (fase === 'intro') {
    return (
      <Marco acto={acto} progreso={progreso} onSalir={onSalir}>
        <PulsoAmbiente opacidad={0.45} />
        <p className="t-micro mt-5" style={{ color: 'var(--calido)' }}>El Chequeo</p>
        <h1 className="t-display mt-2 mb-4">No puedes liderar lo que no mides.</h1>
        <div className="flex flex-wrap gap-x-4 gap-y-2 mb-5">
          <span className="flex items-center gap-1.5 t-micro" style={{ color: 'var(--texto-suave)' }}><Clock3 size={13} /> 7 minutos</span>
          <span className="flex items-center gap-1.5 t-micro" style={{ color: 'var(--texto-suave)' }}><FileCheck2 size={13} /> Instrumentos validados</span>
          <span className="flex items-center gap-1.5 t-micro" style={{ color: 'var(--texto-suave)' }}><ShieldCheck size={13} /> Confidencial</span>
        </div>
        <div className="tarjeta p-5 mb-5">
          <p className="voz-maestro">
            "Yo también llegué fundido a mi propio Chequeo. Dirigía dos empresas y no recordaba
            mi última noche de siete horas. Lo que vas a hacer ahora no es un test de revista:
            son instrumentos validados. Nadie te juzga aquí. Solo vamos a ver dónde estás parado
            — para saber por dónde empezar."
          </p>
          <p className="t-micro mt-3" style={{ color: 'var(--texto-tenue)' }}>— Javo</p>
        </div>
        <p className="t-sub mb-2">¿Cómo te llamas?</p>
        <input
          value={nombre}
          onChange={(e) => setNombreLocal(e.target.value)}
          placeholder="Tu nombre"
          className="w-full px-4 py-4 mb-5"
          style={{ minHeight: 54 }}
        />
        <button className="btn-primario w-full" disabled={!nombre.trim()} onClick={() => { setCtxIdx(0); setFase('contexto'); }}>
          Empezar mi Chequeo
        </button>
        <p className="t-cuerpo mt-4 text-center" style={{ fontSize: 12 }}>
          Tus respuestas son tuyas: quedan guardadas solo en este dispositivo y no se comparten.
        </p>
      </Marco>
    );
  }

  if (fase === 'contexto') {
    const idx = Math.max(0, ctxIdx);
    const p = CONTEXTO[idx] ?? CONTEXTO[0];
    return (
      <Marco acto={acto} progreso={progreso} onSalir={onSalir}>
        <Encabezado etiqueta={`Pregunta ${idx + 1} de ${CONTEXTO.length}`} titulo={p.titulo} sub={p.sub} />
        <Chips
          opciones={p.opciones}
          valor={ctx[p.id]}
          onChange={(v) => {
            const nuevo = { ...ctx, [p.id]: v };
            setCtx(nuevo);
            if (idx + 1 < CONTEXTO.length) setCtxIdx(idx + 1);
            else setFase('cbiIntro');
          }}
        />
        {idx > 0 && <Volver onClick={() => setCtxIdx(idx - 1)} />}
      </Marco>
    );
  }

  /* ═══════════ ACTO 2 · MEDIRTE ═══════════ */

  if (fase === 'cbiIntro') {
    return (
      <Marco acto={acto} progreso={progreso} onSalir={onSalir}>
        <Encabezado etiqueta="Tu agotamiento, medido" titulo={`Bien, ${nombre}. Ahora te medimos de verdad.`} />
        <p className="t-cuerpo mb-4">
          19 preguntas de un instrumento clínico validado (CBI). Responde por tus <b>últimas semanas</b>,
          no por tu mejor día. Al final: tu Zona Vital y tu informe completo.
        </p>
        <p className="t-cuerpo mb-6">Tres secciones: tu energía, tu trabajo, y liderar personas.</p>
        <button className="btn-primario w-full" onClick={() => setFase('cbi')}>Empezar la medición</button>
      </Marco>
    );
  }

  if (fase === 'cbi') {
    const item = CBI_ITEMS[cbiIdx];
    const seccion = item.sub === 'personal' ? 'Tu energía' : item.sub === 'trabajo' ? 'Tu trabajo' : 'Liderar personas';
    return (
      <Marco acto={acto} progreso={progreso} onSalir={onSalir}>
        <Encabezado etiqueta={`${seccion} · ${cbiIdx + 1} de 19`} titulo={item.texto} />
        <div className="space-y-2.5">
          {CBI_OPCIONES.map((op) => (
            <Opcion key={op.valor} label={op.label} activa={cbiResp[item.id] === op.valor} onClick={() => responderCbi(op.valor)} />
          ))}
        </div>
        {cbiIdx > 0 && cbiIdx !== 6 && cbiIdx !== 13 && <Volver onClick={() => setCbiIdx(cbiIdx - 1)} />}
      </Marco>
    );
  }

  if (fase === 'inter1') {
    const parcial = calcularCbi(cbiResp).personal;
    return (
      <Marco acto={acto} progreso={progreso} onSalir={onSalir}>
        <p className="t-micro mb-3" style={{ color: 'var(--calido)' }}>Primera lectura</p>
        <h2 className="t-titulo mb-4">Tu agotamiento personal, medido:</h2>
        <p className="t-display reveal-zona mb-2" style={{ color: parcial >= 50 ? 'var(--zona-roja)' : 'var(--zona-verde)' }}>{parcial} / 100</p>
        <div className="barra mb-5"><div style={{ width: `${parcial}%`, background: parcial >= 50 ? 'var(--zona-roja)' : 'var(--zona-verde)' }} /></div>
        <p className="t-cuerpo mb-3">
          {parcial >= 50
            ? 'Por encima de 50 es zona roja. La mayoría de los líderes que llegan aquí están ahí — no es debilidad: es la consecuencia lógica de cómo estás viviendo. Y de ahí se sale.'
            : 'Por debajo de 50. Buena señal — ahora veamos qué pasa con tu trabajo y tu equipo.'}
        </p>
        <p className="t-cuerpo mb-6">Faltan 13 preguntas para tu Zona Vital.</p>
        <button className="btn-primario w-full" onClick={() => setFase('cbi')}>Seguir midiendo</button>
      </Marco>
    );
  }

  if (fase === 'inter2') {
    return (
      <Marco acto={acto} progreso={progreso} onSalir={onSalir}>
        <p className="t-micro mb-3" style={{ color: 'var(--calido)' }}>Antes de la última sección</p>
        <h2 className="t-titulo mb-4">Así funciona tu progresión aquí</h2>
        <div className="tarjeta p-4 mb-5 space-y-3">
          {ZONAS.map((z) => (
            <div key={z.id} className="flex items-center gap-3">
              <PuntoZona color={z.color} />
              <span className="t-sub">{z.nombre}</span>
              <span className="t-micro ml-auto" style={{ color: 'var(--texto-tenue)' }}>{z.rango}</span>
            </div>
          ))}
        </div>
        <p className="t-cuerpo mb-6">
          Tu Chequeo define dónde empiezas. <b>La evidencia real define cómo avanzas</b> — ver contenido
          no mueve la Zona; el cambio verificado, sí. Quedan 6 preguntas.
        </p>
        <button className="btn-primario w-full" onClick={() => setFase('cbi')}>Última sección</button>
      </Marco>
    );
  }

  if (fase === 'phqIntro') {
    return (
      <Marco acto={acto} progreso={progreso} onSalir={onSalir}>
        <Encabezado etiqueta="Cuidarte de verdad" titulo="9 preguntas más — las más importantes" />
        <p className="t-cuerpo mb-3">
          Son de un tamizaje estándar de salud mental. No diagnostican: nos permiten <b>cuidarte de verdad</b>
          — y si algo merece más que una app, decírtelo con honestidad.
        </p>
        <p className="t-cuerpo mb-6">{PHQ9_INTRO}</p>
        <button className="btn-primario w-full" onClick={() => setFase('phq')}>Continuar</button>
      </Marco>
    );
  }

  if (fase === 'phq') {
    const item = PHQ9_ITEMS[phqIdx];
    return (
      <Marco acto={acto} progreso={progreso} onSalir={onSalir}>
        <Encabezado etiqueta={`Estado de ánimo · ${phqIdx + 1} de 9`} titulo={item.texto} />
        <div className="space-y-2.5">
          {PHQ9_OPCIONES.map((op) => (
            <Opcion key={op.valor} label={op.label} activa={phqResp[item.id] === op.valor} onClick={() => responderPhq(op.valor)} />
          ))}
        </div>
        {phqIdx > 0 && <Volver onClick={() => setPhqIdx(phqIdx - 1)} />}
      </Marco>
    );
  }

  if (fase === 'derivacion') {
    return (
      <Marco acto={acto} progreso={progreso} onSalir={onSalir}>
        <div className="tarjeta p-6" style={{ borderColor: 'var(--calido)' }}>
          <p className="t-micro mb-3" style={{ color: 'var(--calido)' }}>Antes de seguir, algo importante</p>
          <h2 className="t-titulo mb-3">Lo que estás atravesando merece más que una app.</h2>
          <p className="t-cuerpo mb-3">
            Tus respuestas muestran señales que queremos tomar en serio. Esto no es un diagnóstico —
            es una señal de cuidado. La Clínica del Líder acompaña a personas agotadas, pero este
            momento tuyo merece el apoyo de un profesional de la salud mental.
          </p>
          <p className="t-sub mb-3">
            Te recomendamos hablar esta semana con un psicólogo o un médico de confianza.
            Si sientes que estás en peligro, contacta ahora al servicio de emergencias de tu país.
          </p>
          <p className="t-cuerpo">
            Tus Signos Vitales y el Botiquín quedan disponibles para ti. Y cuando un profesional te esté
            acompañando, este lugar te espera.
          </p>
        </div>
        <button className="btn-primario w-full mt-5" onClick={() => setFase('rueda')}>Entendido, terminar mi Chequeo</button>
      </Marco>
    );
  }

  /* ═══════════ ACTO 3 · TU VIDA ═══════════ */

  if (fase === 'rueda') {
    const idx = Math.max(0, MEDIDAS.findIndex((m) => rueda[m.id] === undefined));
    const medida = MEDIDAS[idx] ?? MEDIDAS[MEDIDAS.length - 1];
    function responderTablero(valor: number) {
      const nuevas = { ...rueda, [medida.id]: valor };
      setRueda(nuevas);
      if (MEDIDAS.every((m) => nuevas[m.id] !== undefined)) setFase('habitos');
    }
    return (
      <Marco acto={acto} progreso={progreso} onSalir={onSalir}>
        <Encabezado
          etiqueta={`Tu Tablero · ${idx + 1} de ${MEDIDAS.length}`}
          titulo={medida.pregunta}
          sub="No hay respuestas buenas. La unica que sirve es la que es verdad hoy."
        />
        <div className="flex flex-col gap-3">
          {FRECUENCIA.map((f) => (
            <button
              key={f.valor}
              className={`opcion${rueda[medida.id] === f.valor ? ' activa' : ''}`}
              onClick={() => responderTablero(f.valor)}
            >
              {f.label}
            </button>
          ))}
        </div>
        {idx > 0 && (
          <button
            className="btn-fantasma w-full mt-4"
            onClick={() => {
              const previa = MEDIDAS[idx - 1];
              const copia = { ...rueda };
              delete copia[previa.id];
              setRueda(copia);
            }}
          >
            Volver
          </button>
        )}
      </Marco>
    );
  }

  if (fase === 'habitos') {
    return (
      <Marco acto={acto} progreso={progreso} onSalir={onSalir}>
        <Encabezado etiqueta="Tus hábitos" titulo="Los números de tu semana real" sub="Promedios honestos, no los que te gustaría tener." />
        <div className="tarjeta px-4 py-2">
          <Stepper label="Horas de sueño por noche" valor={habitos.horasSueno} min={3} max={10} paso={0.5} onChange={(v) => setHabitos({ ...habitos, horasSueno: v })} />
          <Stepper label="Entrenamientos por semana" valor={habitos.entrenosSemana} min={0} max={7} onChange={(v) => setHabitos({ ...habitos, entrenosSemana: v })} />
          <Stepper label="Horas de trabajo por semana" valor={habitos.horasTrabajo} min={20} max={100} paso={5} onChange={(v) => setHabitos({ ...habitos, horasTrabajo: v })} />
          <Stepper label="Cafés o estimulantes por día" valor={habitos.cafeinaDia} min={0} max={10} onChange={(v) => setHabitos({ ...habitos, cafeinaDia: v })} />
        </div>
        <button className="btn-primario w-full mt-5" onClick={() => setFase('eneagrama')}>Seguir</button>
      </Marco>
    );
  }

  if (fase === 'eneagrama') {
    const toggle = (tipo: number) => {
      setEneaSel((sel) => sel.includes(tipo) ? sel.filter((t) => t !== tipo) : sel.length < 3 ? [...sel, tipo] : sel);
    };
    return (
      <Marco acto={acto} progreso={progreso} onSalir={onSalir}>
        <Encabezado etiqueta="Autoconocimiento · último paso" titulo="¿Con cuáles te identificas más?" sub="Elige hasta 3. Es un espejo, no una etiqueta." />
        <div className="space-y-2.5">
          {ENEAGRAMA_TIPOS.map((t) => (
            <Opcion key={t.tipo} label={t.afirmacion} activa={eneaSel.includes(t.tipo)} onClick={() => toggle(t.tipo)} />
          ))}
        </div>
        <button className="btn-primario w-full mt-6" onClick={() => setFase('cuerpo')}>Seguir</button>
        <button className="w-full mt-2 t-sub py-3" style={{ color: 'var(--texto-tenue)' }} onClick={() => setFase('cuerpo')}>Saltar este paso</button>
      </Marco>
    );
  }

  /* ═══════════ ACTO 3b · TU CUERPO HOY ═══════════ */

  if (fase === 'cuerpo') {
    const listo = cuerpo.energia0 > 0;
    return (
      <Marco acto={acto} progreso={progreso} onSalir={onSalir}>
        <Encabezado etiqueta="Tu cuerpo hoy" titulo="La línea de la que partimos" sub="En doce semanas se vuelve a medir, con los mismos datos." />
        <div className="tarjeta p-5 space-y-5">
          <div className="flex gap-3">
            <div className="flex-1">
              <label className="t-micro block mb-2" style={{ color: 'var(--texto-tenue)' }}>Anoche me acosté</label>
              <input type="time" className="w-full px-4 py-3" value={cuerpo.acoste}
                onChange={(e) => setCuerpo({ ...cuerpo, acoste: e.target.value })} />
            </div>
            <div className="flex-1">
              <label className="t-micro block mb-2" style={{ color: 'var(--texto-tenue)' }}>Me levanté</label>
              <input type="time" className="w-full px-4 py-3" value={cuerpo.levante}
                onChange={(e) => setCuerpo({ ...cuerpo, levante: e.target.value })} />
            </div>
          </div>
          <p className="t-cuerpo">Dormiste <b>{horasDormidas(cuerpo.acoste, cuerpo.levante)}</b> horas.</p>
        </div>

        <p className="t-sub mt-7 mb-3">¿Cuántas veces te despertaste durante la noche?</p>
        <div className="chips">
          {['Ninguna', 'Una', 'Dos', 'Tres o más'].map((l, i) => (
            <button key={l} className={`chip${cuerpo.despertares === i ? ' activo' : ''}`}
              onClick={() => setCuerpo({ ...cuerpo, despertares: i })}>{l}</button>
          ))}
        </div>

        <p className="t-sub mt-7 mb-1">Al abrir los ojos esta mañana, ¿con cuánta energía arrancaste?</p>
        <p className="t-cuerpo mb-3">Uno es a rastras. Diez es entero.</p>
        <div className="grid grid-cols-5 gap-2">
          {Array.from({ length: 10 }, (_, i) => i + 1).map((n) => (
            <button key={n} className={`opcion justify-center${cuerpo.energia0 === n ? ' activa' : ''}`}
              style={{ minHeight: 60, padding: 0 }}
              onClick={() => setCuerpo({ ...cuerpo, energia0: n })}>{n}</button>
          ))}
        </div>

        <p className="t-sub mt-7 mb-1">¿Con qué te apagas de noche?</p>
        <p className="t-cuerpo mb-3">Marca todo lo que sea cierto. Sin adjetivos: esto no se juzga, se mide.</p>
        <div className="chips">
          {APAGADORES.map((l, i) => (
            <button key={l} className={`chip${cuerpo.apagar.includes(i) ? ' activo' : ''}`}
              onClick={() => setCuerpo({
                ...cuerpo,
                apagar: cuerpo.apagar.includes(i) ? cuerpo.apagar.filter((x) => x !== i) : [...cuerpo.apagar, i],
              })}>{l}</button>
          ))}
        </div>

        <button className="btn-primario w-full mt-8" disabled={!listo} onClick={() => setFase('ventana')}>Seguir</button>
      </Marco>
    );
  }

  if (fase === 'ventana') {
    return (
      <Marco acto={acto} progreso={progreso} onSalir={onSalir}>
        <Encabezado etiqueta="Tu tiempo real" titulo="¿Cuántos minutos tienes de verdad?" sub="Sé exacto. Tu camino se va a construir dentro de ese tiempo, no dentro del que te gustaría tener." />
        <p className="t-sub mb-3">Por la mañana, antes de que alguien te pida algo</p>
        <div className="chips">
          {VENTANA.map((l, i) => (
            <button key={`am${l}`} className={`chip${cuerpo.ventanaAM === VENTANA_MIN[i] ? ' activo' : ''}`}
              onClick={() => setCuerpo({ ...cuerpo, ventanaAM: VENTANA_MIN[i] })}>{l}</button>
          ))}
        </div>
        <p className="t-sub mt-7 mb-3">Por la noche, antes de dormir</p>
        <div className="chips">
          {VENTANA.map((l, i) => (
            <button key={`pm${l}`} className={`chip${cuerpo.ventanaPM === VENTANA_MIN[i] ? ' activo' : ''}`}
              onClick={() => setCuerpo({ ...cuerpo, ventanaPM: VENTANA_MIN[i] })}>{l}</button>
          ))}
        </div>
        <button className="btn-primario w-full mt-8" onClick={() => setFase('palabrasIntro')}>Seguir</button>
      </Marco>
    );
  }

  /* ═══════════ ACTO 4 · EN TUS PALABRAS ═══════════ */

  if (fase === 'palabrasIntro') {
    return (
      <Marco acto={acto} progreso={progreso} onSalir={onSalir}>
        <Encabezado etiqueta="Último acto" titulo="En tus palabras" sub="Cuatro respuestas. Se guardan y se te devuelven más adelante, tal como las escribiste hoy." />
        <p className="t-cuerpo">Esto no lo puntúa nadie. Es lo único del Chequeo que va a seguir siendo tuyo dentro de doce semanas.</p>
        <button className="btn-primario w-full mt-8" onClick={() => { setPalIdx(0); setFase('palabras'); }}>Empezar</button>
      </Marco>
    );
  }

  if (fase === 'palabras') {
    const p = ABIERTAS[palIdx];
    const valor = palabras[p.id] ?? '';
    const faltan = p.min - valor.trim().length;
    return (
      <Marco acto={acto} progreso={progreso} onSalir={onSalir}>
        <Encabezado etiqueta={`En tus palabras · ${palIdx + 1} de ${ABIERTAS.length}`} titulo={p.pregunta} sub={p.ayuda} />
        <textarea
          className="w-full px-5 py-4"
          style={{ minHeight: 200 }}
          placeholder="Escribe aquí"
          value={valor}
          onChange={(e) => setPalabras({ ...palabras, [p.id]: e.target.value })}
        />
        <p className="t-micro mt-3 text-right" style={{ color: 'var(--texto-tenue)' }}>
          {faltan > 0 ? `${faltan} caracteres más` : 'Listo'}
        </p>
        <button className="btn-primario w-full mt-5" disabled={faltan > 0}
          onClick={() => palIdx < ABIERTAS.length - 1 ? setPalIdx(palIdx + 1) : setFase('firma')}>
          Seguir
        </button>
        {palIdx > 0 && (
          <button className="btn-fantasma w-full mt-2" onClick={() => setPalIdx(palIdx - 1)}>Volver</button>
        )}
      </Marco>
    );
  }

  if (fase === 'firma') {
    const hoy = new Date().toLocaleDateString('es', { day: 'numeric', month: 'long', year: 'numeric' });
    return (
      <Marco acto={acto} progreso={progreso} onSalir={onSalir}>
        <Encabezado etiqueta="El contrato" titulo="Firma tu punto de partida." sub={`Hoy es ${hoy}. Escribe tu nombre completo.`} />
        <input type="text" className="w-full px-5 py-4" placeholder="Nombre y apellido"
          value={firma} onChange={(e) => setFirma(e.target.value)} />
        <div className="tarjeta p-5 mt-6">
          <p className="t-cuerpo">En doce semanas tu Índice sube {SUBIDA_CONTRATO} puntos y sales con tus sistemas andando. Si no sube, seguimos hasta que suba.</p>
        </div>
        <button className="btn-primario w-full mt-7" disabled={firma.trim().length < 3} onClick={terminarMedicion}>
          Firmo y empiezo
        </button>
      </Marco>
    );
  }

  /* ═══════════ ACTO 4 · TU ZONA ═══════════ */

  if (fase === 'procesando') {
    return <Procesando onListo={() => setFase('resultado')} />;
  }

  if (fase === 'resultado' && guardado) {
    const zona = zonaDesdeCbi(guardado.cbi.promedio);
    const tab = guardado.rueda;
    const indice = indiceJugador(tab);
    const lect = lectura(tab);
    const tresFocos = focosTablero(tab);
    const espejos = ENEAGRAMA_TIPOS.filter((t) => guardado.eneagramaTipos.includes(t.tipo));
    const columnas = [
      { id: 'izq' as const, nombre: 'Contención', valor: promedioColumna('izq', tab) },
      { id: 'eje' as const, nombre: 'Eje', valor: promedioColumna('eje', tab) },
      { id: 'der' as const, nombre: 'Expansión', valor: promedioColumna('der', tab) },
    ];
    return (
      <Marco acto={acto} progreso={100}>
        <p className="t-display mb-8">{nombre}, este es tu punto de partida.</p>

        <div className="text-center my-8 reveal-zona">
          <div style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 'clamp(88px, 28vw, 140px)', lineHeight: 0.9, color: colorPuntaje(indice), fontVariantNumeric: 'tabular-nums' }}>
            {indice}
          </div>
          <p className="t-sub mt-4" style={{ color: 'var(--texto-suave)' }}>Índice del Jugador · Día 0</p>
        </div>

        <ArbolTablero tablero={tab} revelar />

        <div className="mt-10 pt-7" style={{ borderTop: '1px solid var(--acento)' }}>
          <h3 className="t-titulo mb-3">{lect.titulo}</h3>
          <p className="t-cuerpo">{lect.texto}</p>
          <div className="flex gap-3 mt-6">
            {columnas.map((c) => (
              <div key={c.id} className="flex-1 text-center tarjeta py-5">
                <div className="t-dato" style={{ fontSize: 32, color: colorPuntaje(c.valor) }}>{c.valor}</div>
                <div className="t-micro mt-1" style={{ color: 'var(--texto-tenue)' }}>{c.nombre}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-10 pt-7" style={{ borderTop: '1px solid var(--acento)' }}>
          <h3 className="t-titulo mb-2">Tus tres focos</h3>
          <p className="t-cuerpo mb-3">Las doce semanas son las mismas para todos. El acento va aquí.</p>
          {tresFocos.map((m) => (
            <div key={m.id} className="flex justify-between items-baseline py-4" style={{ borderBottom: '1px solid var(--borde)' }}>
              <span className="t-sub">{m.nombre}</span>
              <span className="t-dato" style={{ color: colorPuntaje(puntajeMedida(m, tab)) }}>{puntajeMedida(m, tab)}</span>
            </div>
          ))}
        </div>

        {guardado.contexto.motivo && (
          <div className="mt-8 tarjeta p-5">
            <p className="t-cuerpo">Llegaste diciendo: <b>«{guardado.contexto.motivo}»</b>. Tu Chequeo le pone números a esa sensación, y un camino.</p>
          </div>
        )}

        {guardado.cuerpo && avisaAlClinico(guardado.cuerpo.apagar) && (
          <div className="mt-4 tarjeta p-5" style={{ borderColor: 'var(--calido)' }}>
            <p className="t-sub">Algo de lo que marcaste en cómo te apagas se trabaja en consulta y no con una Dosis. Llévalo a tu próxima sesión: es lo más útil que puedes hacer con esa información.</p>
          </div>
        )}

        {guardado.phq9.derivar && (
          <div className="mt-4 tarjeta p-5" style={{ borderColor: 'var(--calido)' }}>
            <p className="t-sub">Tu recomendación principal: hablar esta semana con un profesional de la salud mental. El camino puede esperarte; tu bienestar no.</p>
          </div>
        )}

        <div className="mt-10 pt-7" style={{ borderTop: '1px solid var(--acento)' }}>
          <h3 className="t-titulo mb-4">Tu carga, medida</h3>
          {(['personal', 'trabajo', 'equipo'] as const).map((sub) => (
            <div key={sub} className="mb-4">
              <div className="flex justify-between mb-2">
                <span className="t-sub">{CBI_SUBESCALA_LABEL[sub]}</span>
                <span className="t-dato" style={{ fontSize: 19 }}>{guardado.cbi[sub]}</span>
              </div>
              <div className="barra"><div style={{ width: `${guardado.cbi[sub]}%`, background: guardado.cbi[sub] >= 50 ? 'var(--zona-roja)' : 'var(--zona-verde)' }} /></div>
            </div>
          ))}
          <p className="t-cuerpo mt-3">Tu zona hoy: <b>{zona.nombre}</b>. Se vuelve a medir el día {HITO_MEDIO} y el día {HITO_CONTRATO}, con evidencia y no con sensaciones.</p>
        </div>

        {espejos.length > 0 && (
          <div className="mt-10 pt-7 space-y-5" style={{ borderTop: '1px solid var(--acento)' }}>
            {espejos.map((e) => (
              <div key={e.tipo}>
                <p className="t-micro mb-2" style={{ color: 'var(--acento)' }}>Tu espejo · {e.nombre}</p>
                <p className="t-cuerpo">{e.espejo}</p>
              </div>
            ))}
          </div>
        )}

        {guardado.palabras?.costo && (
          <div className="mt-10 pt-7" style={{ borderTop: '1px solid var(--acento)' }}>
            <h3 className="t-titulo mb-3">Lo que escribiste hoy</h3>
            <p className="t-cuerpo">Si todo sigue igual, dentro de un año:</p>
            <p className="voz-maestro my-5">{guardado.palabras.costo}</p>
            <p className="t-sub" style={{ color: 'var(--texto-tenue)' }}>
              {guardado.firma} · {new Date(guardado.fecha).toLocaleDateString('es', { day: 'numeric', month: 'long', year: 'numeric' })}
            </p>
            {guardado.palabras.escena && (
              <>
                <p className="t-cuerpo mt-8">Y esto es lo que viene en doce semanas, con tus palabras:</p>
                <p className="voz-maestro my-5">{guardado.palabras.escena}</p>
              </>
            )}
            <p className="t-cuerpo mt-6">Lo que no le dices a nadie queda sellado. Se abre el día {HITO_CONTRATO} y lo abres tú.</p>
          </div>
        )}

        <button className="btn-primario w-full mt-10" onClick={() => setFase('dia90')}>Ver mi día 84</button>
      </Marco>
    );
  }

  if (fase === 'dia90' && guardado) {
    const tab = guardado.rueda;
    const tresFocos = focosTablero(tab);
    return (
      <Marco acto={acto} progreso={100}>
        <p className="t-micro" style={{ color: 'var(--acento)' }}>Tu camino</p>
        <h2 className="t-display mt-3 mb-5">Doce semanas. Doce sesiones.</h2>
        <p className="t-cuerpo mb-3">
          Ya sabes dónde estás. Ahora lo que sigue, para que sepas exactamente en qué te metiste.
        </p>
        <p className="t-cuerpo mb-9">
          Ochenta y cuatro días partidos en dos mitades. Cada semana trabaja una cosa y nos vemos
          una vez por semana para revisarla. Una Dosis por día, entre cinco y veinte minutos.
          Nada de esto te va a pedir una hora libre que no tienes.
        </p>

        {VIAJES.map((v) => (
          <div key={v.id} className="mb-9">
            <div style={{ borderTop: '2px solid var(--acento)', paddingTop: 20 }}>
              <p className="t-micro" style={{ color: 'var(--acento)' }}>
                Viaje {v.id === 1 ? 'uno' : 'dos'} · días {v.dias[0]} al {v.dias[1]}
              </p>
              <h3 className="t-display mt-2 mb-2" style={{ fontSize: 34 }}>{v.nombre}</h3>
              <p className="t-cuerpo mb-5">{v.promesa}</p>
            </div>
            {SEMANAS.filter((x) => x.viaje === v.id).map((x) => (
              <div key={x.n} className="flex gap-4 py-4" style={{ borderBottom: '1px solid var(--borde)' }}>
                <span className="t-dato flex-none" style={{ color: 'var(--acento)', width: 34, fontSize: 21 }}>
                  {String(x.n).padStart(2, '0')}
                </span>
                <div>
                  <p className="t-sub">{x.nombre}</p>
                  <p className="t-cuerpo" style={{ fontSize: 16 }}>{x.resumen}</p>
                </div>
              </div>
            ))}
          </div>
        ))}

        <div className="tarjeta p-6 mb-6">
          <h3 className="t-titulo mb-3">Por qué toca toda tu vida</h3>
          <p className="t-cuerpo mb-4">
            Tu Tablero mide diez cosas y ninguna vive sola: la noche que duermes decide la cabeza con
            la que decides, y la cabeza con la que decides decide cómo llegas a tu casa. Por eso el
            orden importa. Primero se ordena lo que te está drenando, y recién después se construye.
          </p>
          <p className="t-cuerpo">
            Las doce semanas son las mismas para todos. Lo tuyo es el acento, y hoy quedó definido:
            <b> {tresFocos.map((f) => f.nombre).join(', ')}</b>. Vas a encontrar esas tres apareciendo
            una y otra vez a lo largo del camino.
          </p>
        </div>

        <div className="tarjeta p-6 mb-8">
          <h3 className="t-titulo mb-3">Lo que medimos, y cuándo</h3>
          <p className="t-cuerpo mb-3">
            Todos los días, en sesenta segundos: sueño, energía, foco y actos de verdad.
          </p>
          <p className="t-cuerpo mb-3">
            El día {HITO_MEDIO}, al cerrar el primer viaje, y el día {HITO_CONTRATO}, al final:
            este mismo Chequeo otra vez. Los tres juntos, uno al lado del otro.
          </p>
          <p className="t-cuerpo">
            Tu día {HITO_CONTRATO} es el <b>{fechaDia90(guardado.fecha)}</b>.
          </p>
        </div>

        {getProtocolo() && <CeremoniaMedicion onCerrar={onTerminado} />}

        <button className="btn-primario w-full mt-4" onClick={onTerminado}>Empezar mi Día 1</button>
      </Marco>
    );
  }

  return null;
}

/* ─── Pantalla de procesamiento (el pago del compromiso) ─── */
function Procesando({ onListo }: { onListo: () => void }) {
  const pasos = [
    'Calculando tus tres subescalas de carga…',
    'Armando tu Árbol con las diez medidas…',
    'Buscando el desbalance entre tus columnas…',
    'Definiendo tus tres focos…',
  ];
  const [visibles, setVisibles] = useState(1);
  useEffect(() => {
    const int = setInterval(() => setVisibles((v) => v + 1), 2600);
    const fin = setTimeout(onListo, 11500);
    return () => { clearInterval(int); clearTimeout(fin); };
  }, [onListo]);
  return (
    <div className="pantalla pt-20 pb-28">
      <Loader2 className="animate-spin mb-6" size={28} color="var(--acento)" />
      <h2 className="t-titulo mb-5">Construyendo tu informe</h2>
      <div>
        {pasos.slice(0, visibles).map((p, i) => (
          <div key={p} className="paso-procesando">
            {i < visibles - 1 ? <Check size={18} color="var(--acento)" /> : <Loader2 className="animate-spin" size={18} color="var(--texto-tenue)" />}
            <span className="t-cuerpo">{p}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── Piezas del marco ─── */
function Marco({ children, acto, progreso, onSalir }: { children: ReactNode; acto: { n: number; nombre: string }; progreso: number; onSalir?: () => void }) {
  return (
    <div className="pantalla pt-5 pb-28">
      <BarraActos acto={acto.n} nombre={acto.nombre} progreso={progreso} onSalir={onSalir} />
      {children}
    </div>
  );
}

function Encabezado({ etiqueta, titulo, sub }: { etiqueta: string; titulo: string; sub?: string }) {
  return (
    <div className="mb-5">
      <p className="t-micro mb-2" style={{ color: 'var(--calido)' }}>{etiqueta}</p>
      <h2 className="t-titulo">{titulo}</h2>
      {sub && <p className="t-cuerpo mt-2">{sub}</p>}
    </div>
  );
}

function Volver({ onClick }: { onClick: () => void }) {
  return <button className="mt-4 t-sub" style={{ color: 'var(--texto-tenue)' }} onClick={onClick}>← Volver</button>;
}
