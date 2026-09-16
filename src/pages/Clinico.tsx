/** El Clínico — el agente de la clínica. 3 preguntas de regalo; completo para pacientes. */
import { useEffect, useRef, useState } from 'react';
import { SendHorizontal, Stethoscope } from 'lucide-react';
import {
  getUltimoChequeo, getProtocolo, getNombre, getAcceso, esMadrugada,
  getClinicoUsos, sumarClinicoUso, getClinicoChat, guardarClinicoChat, type MensajeClinico,
} from '../lib/estadoCdl';
import { generarTexto } from '../lib/clinicoApi';
import { CBI_SUBESCALA_LABEL } from '../data/cbi';
import { DOSIS, faseDeDia } from '../data/protocolo';
import { NOCHES } from '../data/apaga';
import { getApaga, proximaNoche, proximaDosis, diaDelProtocolo } from '../lib/estadoCdl';
import { zonaDesdeCbi } from '../data/zonas';
import type { PaginaId } from '../lib/estadoCdl';

const LIMITE_GRATIS = 3;

interface PasoActual { etiqueta: string; detalle: string; chips: string[]; }

/** El paso exacto en el que está el paciente HOY — el Clínico lo acompaña sabiéndolo. */
function pasoActual(): PasoActual | null {
  const p = getProtocolo();
  if (p) {
    const dia = Math.min(diaDelProtocolo(p), 90);
    const prox = proximaDosis(p);
    if (prox > dia) return { etiqueta: `Día ${dia} · Dosis hecha`, detalle: 'La Dosis de hoy ya está hecha; la próxima se libera mañana.', chips: ['¿Qué me conviene hacer con el resto del día?', '¿Cómo viene mi semana según mis Signos?'] };
    const d = DOSIS.find((x) => x.dia === prox);
    if (!d) return null;
    return {
      etiqueta: `Fase ${faseDeDia(prox).id} · Día ${prox}: ${d.titulo}`,
      detalle: `DOSIS DE HOY (Día ${prox} — ${d.titulo}). Señal: ${d.senal} Acción: ${d.accion}`,
      chips: ['Hoy no tengo los 20 minutos — ¿cómo la achico?', '¿Cómo adapto la Acción a mi caso?', 'Explícame la Señal de hoy en una frase'],
    };
  }
  const a = getApaga();
  if (a) {
    const n = proximaNoche(a);
    const noche = NOCHES[n - 1];
    return {
      etiqueta: `Apaga la Cabeza · Noche ${n}: ${noche.titulo}`,
      detalle: `NOCHE ACTUAL (${n} de 5 — ${noche.titulo}). Señal: ${noche.senal} Acción: ${noche.accion}`,
      chips: n === 1
        ? ['¿Qué mide exactamente el Chequeo?', '¿Mis respuestas las ve alguien?', '¿Y si me da un número feo?']
        : ['¿Y si esta noche no puedo cumplirla?', '¿Por qué esta consigna y no otra?', 'Me desperté a las 3 — ¿qué hago?'],
    };
  }
  return null;
}

function sistemaClinico(): string {
  const nombre = getNombre();
  const ch = getUltimoChequeo();
  const p = getProtocolo();
  let contexto = '';
  if (ch) {
    const zona = zonaDesdeCbi(ch.cbi.promedio);
    contexto = `Datos del Chequeo de ${nombre || 'la persona'}: Zona ${zona.nombre} (CBI promedio ${ch.cbi.promedio}/100 — ${CBI_SUBESCALA_LABEL.personal}: ${ch.cbi.personal}, ${CBI_SUBESCALA_LABEL.trabajo}: ${ch.cbi.trabajo}, ${CBI_SUBESCALA_LABEL.equipo}: ${ch.cbi.equipo}). Lidera: ${ch.contexto.lidera} (${ch.contexto.personas} personas a cargo). Motivo de llegada: "${ch.contexto.motivo}". ${ch.phq9.derivar ? 'IMPORTANTE: su tamizaje sugirió derivación a un profesional de salud mental — recuérdalo con cuidado si es pertinente y NUNCA lo contradigas.' : ''}`;
  }
  return `Eres EL CLÍNICO de La Clínica del Líder — el acompañante clínico digital de líderes agotados (dueños de empresa, 35-55 años, escépticos, sin tiempo).

EL MÉTODO SE LLAMA EL EJE. Viene de la columna del medio del Árbol: la que reconcilia la expansión con la contención. Ni desbordarse ni endurecerse. Y es el ciclo de cada día: ESPEJO (ver lo que es, sin interpretación y sin látigo), JUGADA (un movimiento concreto, uno solo, hoy) y EVIDENCIA (comprobar en el registro, no en la sensación). Cuando el paciente se pierde, lo devuelves a ese ciclo: qué ves, qué vas a mover hoy, y cómo vas a saber si pasó. Nunca nombras la cábala ni explicas la columna del medio: el paciente vive el ciclo, no la teoría.

TU VOZ: sobria, directa, cálida sin ser blanda. Castellano neutro (tú/tienes). Respuestas CORTAS (2-5 oraciones; máximo 120 palabras). Sin emojis, sin exclamaciones, sin frases de coach. Hablas como un buen médico de cabecera: claro, humano, sin humo.

TUS LÍMITES (innegociables):
- NO diagnosticas ni tratas patología. No eres psicólogo ni médico.
- Si aparecen señales de crisis, ideación de daño o desesperanza profunda: recomiendas con calidez hablar HOY con un profesional de salud mental o el servicio de emergencias de su país, y no sigues con otra cosa.
- No inventas datos del usuario: usa solo el contexto provisto.
- No prometes resultados; la promesa medible es del protocolo, no tuya.

TUS 3 MODOS (elige según el contexto que se te indica al final):
- MODO INFORME: explicar su Chequeo y sus mediciones con claridad clínica.
- MODO DOSIS: acompañar la acción del día — resolver la duda práctica, adaptar al caso ("no tengo 20 minutos hoy"), sin cambiar el protocolo.
- MODO MADRUGADA: si te avisan que es de madrugada, tu respuesta es CORTA (máximo 3 oraciones), calma, sin preguntas nuevas; guías directo a la herramienta 3AM del Botiquín (respirar 4-6, la descarga en papel, la regla de los 20 minutos) y cierras invitando a soltar el teléfono. A las 3AM no se conversa: se respira.

TU TRABAJO: responder sobre su informe, acompañar la Dosis o la Noche del día, y comentar patrones de sus Signos Vitales. Siempre aterrizas en UNA acción concreta y pequeña.

VOCABULARIO PROHIBIDO: coach, nivel, embudo, marketing, gurú. Se dice: el Chequeo, la Dosis, Signos Vitales, tu Zona, el protocolo, consulta clínica.

CONTEXTO DEL PACIENTE: ${contexto || 'Aún no hizo el Chequeo — invítalo a hacerlo primero: sin medición no hay acompañamiento serio.'} ${p ? `Camino activo: EL EJE (${p.tier === 'acompanado' ? 'Acompañado' : 'Solo'}), inició ${p.fechaInicio}, ${p.dosisHechas.length} Dosis hechas.` : 'Está en Apaga la Cabeza (las 5 noches, aún sin el Tratamiento completo).'} ${esMadrugada() ? 'AHORA MISMO ES DE MADRUGADA: usa el MODO MADRUGADA.' : ''} ${(() => { const paso = pasoActual(); return paso ? `EL PASO EXACTO EN EL QUE ESTÁ HOY (úsalo en MODO DOSIS): ${paso.detalle}` : ''; })()}`;
}

export default function Clinico({ navegar }: { navegar: (p: PaginaId) => void }) {
  const [msgs, setMsgs] = useState<MensajeClinico[]>(getClinicoChat());
  const [texto, setTexto] = useState('');
  const [cargando, setCargando] = useState(false);
  const finRef = useRef<HTMLDivElement>(null);

  const protocolo = getProtocolo();
  const acceso = getAcceso();
  const usos = getClinicoUsos();
  const sinCupo = acceso === 'apaga' && usos >= LIMITE_GRATIS;
  const restantes = Math.max(0, LIMITE_GRATIS - usos);
  const madrugada = esMadrugada();

  useEffect(() => { finRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [msgs, cargando]);

  const paso = pasoActual();

  async function enviar(directa?: string) {
    const pregunta = (directa ?? texto).trim();
    if (!pregunta || cargando || sinCupo) return;
    setTexto('');
    const conUser: MensajeClinico[] = [...msgs, { rol: 'user', texto: pregunta }];
    setMsgs(conUser);
    setCargando(true);
    if (acceso === 'apaga') sumarClinicoUso();

    try {
      const respuesta = await generarTexto(
        sistemaClinico(),
        conUser.slice(-12).map((m) => ({ role: m.rol === 'user' ? 'user' as const : 'assistant' as const, content: m.texto })),
      );
      const final: MensajeClinico[] = [...conUser, { rol: 'assistant', texto: respuesta || 'No pude generar una respuesta. Intenta de nuevo.' }];
      setMsgs(final);
      guardarClinicoChat(final);
    } catch {
      const final: MensajeClinico[] = [...conUser, {
        rol: 'assistant',
        texto: 'El Clínico todavía no está conectado en este despliegue (faltan las llaves del servidor). Tu pregunta quedó registrada en este dispositivo — mientras tanto, tu mejor movimiento sigue siendo el de siempre: registra tus Signos de hoy.',
      }];
      setMsgs(final);
      guardarClinicoChat(final);
    } finally {
      setCargando(false);
    }
  }

  return (
    <div className="pantalla pt-6 pb-40">
      <button className="btn-fantasma pl-0" onClick={() => navegar('hoy')}>‹ Volver</button>
      <div className="flex items-center gap-3 mt-2 mb-1">
        <span className="grid place-items-center rounded-2xl" style={{ width: 42, height: 42, background: 'var(--acento-tinte)' }}>
          <Stethoscope size={20} color="var(--acento)" />
        </span>
        <div>
          <h1 className="t-titulo">El Clínico</h1>
          <p className="t-micro" style={{ color: 'var(--texto-tenue)' }}>
            {madrugada ? 'Madrugada. Estamos aquí.' : protocolo ? 'Tu acompañante del Tratamiento' : `${restantes} de ${LIMITE_GRATIS} preguntas incluidas`}
          </p>
        </div>
      </div>
      <p className="t-cuerpo mb-3" style={{ fontSize: 16 }}>No diagnostica ni reemplaza a un profesional. Acompaña, con tus datos a la vista.</p>
      {paso && (
        <p className="t-micro mb-4 inline-flex items-center gap-1.5 rounded-full px-3 py-1.5" style={{ background: 'var(--acento-tinte)', color: 'var(--acento)' }}>
          Acompañando: {paso.etiqueta}
        </p>
      )}

      <div className="space-y-3 mb-5">
        {msgs.length === 0 && (
          <div className="tarjeta p-4">
            <p className="t-cuerpo mb-3">Respuestas cortas, sin humo. Empieza por aquí si quieres:</p>
            <div className="flex flex-wrap gap-2">
              {(paso?.chips ?? ['¿Qué significa mi Zona?', '¿Por qué mi subescala más alta pesa tanto?', '¿Por dónde empiezo?']).map((c) => (
                <button key={c} className="chip" style={{ minHeight: 42, fontSize: 16 }} disabled={cargando || sinCupo} onClick={() => enviar(c)}>{c}</button>
              ))}
            </div>
          </div>
        )}
        {msgs.map((m, i) => (
          <div key={i} className={m.rol === 'user' ? 'flex justify-end' : 'flex justify-start'}>
            <div
              className="tarjeta px-4 py-3"
              style={{
                maxWidth: '85%',
                ...(m.rol === 'user' ? { background: 'var(--acento-tinte)', borderColor: 'var(--hairline-acento)' } : {}),
              }}>
              <p className="t-cuerpo" style={{ color: m.rol === 'user' ? 'var(--texto)' : undefined, whiteSpace: 'pre-wrap' }}>{m.texto}</p>
            </div>
          </div>
        ))}
        {cargando && <p className="t-micro pulso-latido" style={{ color: 'var(--texto-tenue)' }}>El Clínico está escribiendo…</p>}
        <div ref={finRef} />
      </div>

      {sinCupo ? (
        <div className="tarjeta p-5">
          <p className="t-sub mb-2">Tus 3 preguntas incluidas se usaron.</p>
          <p className="t-cuerpo mb-4">El Clínico completo acompaña a los pacientes del Tratamiento, todos los días.</p>
          <button className="btn-primario w-full" onClick={() => navegar('tratamiento')}>Ver cómo entrar</button>
        </div>
      ) : (
        <div className="fixed left-0 right-0 bottom-0 lg:left-[236px]" style={{ background: 'rgba(240,235,224,.93)', backdropFilter: 'blur(14px)', borderTop: '1px solid var(--borde)', padding: '12px 16px calc(12px + env(safe-area-inset-bottom))' }}>
          <div className="pantalla flex gap-2" style={{ paddingLeft: 0, paddingRight: 0 }}>
            <input
              value={texto}
              onChange={(e) => setTexto(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') enviar(); }}
              placeholder="Escribe tu pregunta…"
              className="flex-1 px-4"
              style={{ minHeight: 50 }}
            />
            <button className="btn-primario" style={{ minHeight: 50, padding: '0 18px' }} disabled={cargando || !texto.trim()} onClick={() => enviar()} aria-label="Enviar">
              <SendHorizontal size={19} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
