/**
 * EL ICEBERG — la tarea del lunes, capa por capa.
 *
 * La secuencia de EL EJE, validada en sesión (sep 2026):
 * fruto → mentiras (“¿Qué más?”) → la más fuerte → miedo → dolor → origen
 * (“el primer recuerdo”) → el mensaje a quien eras → la yuxtaposición
 * (la frase vieja y un hecho de este mes, dichas juntas) → el permiso → el test.
 *
 * Una pregunta por pantalla. La verdad la escribe el paciente: la app no sugiere ninguna.
 * Lo que te bloquea te estuvo cuidando: ninguna capa se mira con látigo.
 */
import { useState } from 'react';
import { toast } from 'sonner';
import { Plus, ChevronRight, Trash2, Send } from 'lucide-react';
import {
  listarIcebergs, guardarIceberg, borrarIceberg, normalizarIceberg, hoyIso, getNombre,
  type Iceberg, type PaginaId, type Test,
} from '../lib/estadoCdl';
import { Chips } from '../components/ui';
import { VideoEje } from '../components/Contenido';
import { textoIceberg, abrirWhatsApp } from '../lib/envio';
import { MODO_NUBE } from '../lib/supabase';
import Salida from '../components/Salida';

type Paso = 'fruto' | 'mentiras' | 'fuerte' | 'miedo' | 'dolor' | 'origen' | 'mensaje'
  | 'antes' | 'hecho' | 'juntas' | 'verdad' | 'test';

const PASOS: Paso[] = ['fruto', 'mentiras', 'fuerte', 'miedo', 'dolor', 'origen', 'mensaje', 'antes', 'hecho', 'juntas', 'verdad', 'test'];

const DIEZ = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'];

const vacio = (): Iceberg => ({
  id: String(Date.now()), fecha: hoyIso(),
  bloqueo: '', mentira: '', miedo: '', dolor: '', perdon: '', cerrado: false,
  mentiras: [''], test: {},
});

const lleno = (t?: string) => (t ?? '').trim().length >= 3;
const mentirasLlenas = (i: Iceberg) => (i.mentiras ?? []).filter(lleno);

function completo(i: Iceberg, p: Paso): boolean {
  switch (p) {
    case 'fruto': return lleno(i.bloqueo);
    case 'mentiras': return mentirasLlenas(i).length >= 3;
    case 'fuerte': return i.fuerte !== undefined && lleno(i.mentiras?.[i.fuerte]);
    case 'miedo': return lleno(i.miedo);
    case 'dolor': return lleno(i.dolor);
    case 'origen': return lleno(i.origen) && Boolean(i.edad);
    case 'mensaje': return lleno(i.perdon);
    case 'antes': return Boolean(i.antes);
    case 'hecho': return lleno(i.hecho);
    case 'juntas': return Boolean(i.despues);
    case 'verdad': return lleno(i.verdad);
    case 'test': return lineasTest(i).every(([k]) => Boolean(i.test?.[k]));
  }
}

function lineasTest(i: Iceberg): [string, string][] {
  const ms = (i.mentiras ?? []).map((m, k) => [`m${k}`, m] as [string, string]).filter(([, m]) => lleno(m));
  return lleno(i.verdad) ? [...ms, ['verdad', i.verdad!]] : ms;
}

function primerPasoPendiente(i: Iceberg): number {
  const k = PASOS.findIndex((p) => !completo(i, p));
  return k === -1 ? PASOS.length - 1 : k;
}

export default function IcebergPage({ navegar }: { navegar: (p: PaginaId) => void }) {
  const [lista, setLista] = useState<Iceberg[]>(listarIcebergs().map(normalizarIceberg));
  const [actual, setActual] = useState<Iceberg | null>(null);
  const [paso, setPaso] = useState(0);
  const [listo, setListo] = useState<Iceberg | null>(null);

  function refrescar() { setLista(listarIcebergs().map(normalizarIceberg)); }

  function cambiar(parcial: Partial<Iceberg>) {
    if (actual) setActual({ ...actual, ...parcial });
  }

  function seguir() {
    if (!actual || !completo(actual, PASOS[paso])) return;
    const fuerte = actual.fuerte !== undefined ? (actual.mentiras?.[actual.fuerte] ?? '') : '';
    const ultimo = paso === PASOS.length - 1;
    const guardado: Iceberg = { ...actual, mentira: fuerte, cerrado: ultimo, cerradoEn: ultimo ? hoyIso() : actual.cerradoEn };
    guardarIceberg(guardado);
    refrescar();
    if (ultimo) { setActual(null); setListo(guardado); }
    else { setActual(guardado); setPaso(paso + 1); }
    window.scrollTo({ top: 0 });
  }

  function enviar(i: Iceberg) {
    abrirWhatsApp(textoIceberg(i, getNombre()));
    guardarIceberg({ ...i, enviado: hoyIso() });
    refrescar();
    toast.success('Se abrió WhatsApp con tu Iceberg.');
  }

  /* ── Terminado ── */
  if (listo) {
    const baja = listo.antes && listo.despues ? listo.antes - listo.despues : 0;
    return (
      <div className="pantalla pt-6 pb-28 pagina-anim">
        <p className="t-micro" style={{ color: 'var(--acento)' }}>Tu Iceberg de la semana</p>
        <h1 className="t-display mt-3 mb-4">Listo para tu sesión.</h1>
        {listo.antes && listo.despues ? (
          <div className="tarjeta p-5 mb-5">
            <p className="t-micro mb-2" style={{ color: 'var(--texto-tenue)' }}>Cuánto crees tu frase más fuerte</p>
            <p className="t-titulo">{listo.antes}/10 antes · {listo.despues}/10 dichas las dos juntas</p>
            {baja > 0 && <p className="t-cuerpo mt-2">Bajó {baja} {baja === 1 ? 'punto' : 'puntos'}. Eso es lo que se revisa el martes.</p>}
          </div>
        ) : null}
        <p className="voz-maestro mb-7" style={{ fontSize: 21 }}>{listo.verdad}</p>
        {MODO_NUBE ? (
          <p className="t-cuerpo mb-4">Tu terapeuta ya lo ve en tu ficha. La sesión del martes empieza donde te trabaste.</p>
        ) : (
          <p className="t-cuerpo mb-4">Mándalo antes del lunes a las 21:00. La sesión empieza donde te trabaste.</p>
        )}
        <button className={`${MODO_NUBE ? 'btn-secundario' : 'btn-primario'} w-full flex items-center justify-center gap-2`} onClick={() => enviar(listo)}>
          <Send size={18} /> {MODO_NUBE ? 'Mandarlo también por WhatsApp' : 'Enviar a mi terapeuta'}
        </button>
        <button className="btn-secundario w-full mt-3" onClick={() => { setListo(null); navegar('hoy'); }}>Volver a Hoy</button>
      </div>
    );
  }

  /* ── Trabajando ── */
  if (actual) {
    const p = PASOS[paso];
    const fuerte = actual.fuerte !== undefined ? actual.mentiras?.[actual.fuerte] ?? '' : '';
    const puede = completo(actual, p);
    const edad = actual.edad ?? 0;

    const Frase = ({ texto, color }: { texto: string; color: string }) => (
      <div className="tarjeta p-5 mb-4" style={{ borderLeft: `2px solid ${color}` }}>
        <p className="t-titulo" style={{ lineHeight: 1.3 }}>“{texto}”</p>
      </div>
    );

    return (
      <div className="pantalla pt-6 pb-28 pagina-anim" key={p}>
        <div className="flex gap-1 mb-8">
          {PASOS.map((_, i) => (
            <i key={i} className="flex-1" style={{ height: 2, borderRadius: 2, background: i <= paso ? 'var(--acento)' : 'rgba(21,19,15,.12)' }} />
          ))}
        </div>

        {p === 'fruto' && <>
          <p className="t-micro" style={{ color: 'var(--acento)' }}>Arriba del agua</p>
          <h1 className="t-display mt-3 mb-3">¿Qué se ve desde afuera?</h1>
          <p className="t-cuerpo mb-6">Lo que notaría alguien que entra a tu oficina, a tu casa o a tu perfil. Un hecho, no una explicación. Si es tu tarea del lunes: el compromiso que no cumpliste, o lo que más te costó.</p>
          <textarea className="w-full px-5 py-4" style={{ minHeight: 150 }} placeholder="Lo que se ve es…"
            value={actual.bloqueo} onChange={(e) => cambiar({ bloqueo: e.target.value })} />
        </>}

        {p === 'mentiras' && <>
          <p className="t-micro" style={{ color: 'var(--acento)' }}>Las mentiras</p>
          <h1 className="t-display mt-3 mb-3">¿Qué beneficio te da que siga así?</h1>
          <p className="t-cuerpo mb-6">Y todas las explicaciones que te das. Una por línea. Cuando creas que terminaste, toca “¿Qué más?”. Salen de a cinco; con tres ya puedes bajar.</p>
          {(actual.mentiras ?? ['']).map((m, k) => (
            <textarea key={k} className="w-full px-5 py-3 mb-3" style={{ minHeight: 70 }} placeholder={k === 0 ? 'Me conviene porque…' : 'Otra más…'}
              value={m} onChange={(e) => {
                const ms = [...(actual.mentiras ?? [''])]; ms[k] = e.target.value; cambiar({ mentiras: ms });
              }} />
          ))}
          <button className="btn-secundario w-full" disabled={!lleno(actual.mentiras?.[actual.mentiras.length - 1])}
            onClick={() => cambiar({ mentiras: [...(actual.mentiras ?? []), ''] })}>
            ¿Qué más?
          </button>
        </>}

        {p === 'fuerte' && <>
          <p className="t-micro" style={{ color: 'var(--acento)' }}>Elegir una</p>
          <h1 className="t-display mt-3 mb-3">De todas, ¿cuál es la más fuerte?</h1>
          <p className="t-cuerpo mb-6">La que más te cuesta soltar. Esa es la que vas a seguir hasta abajo.</p>
          {(actual.mentiras ?? []).map((m, k) => lleno(m) && (
            <button key={k} className="tarjeta tarjeta-hover w-full text-left p-4 mb-3"
              style={{ borderColor: actual.fuerte === k ? 'var(--acento)' : undefined, background: actual.fuerte === k ? 'var(--acento-tinte)' : undefined }}
              onClick={() => cambiar({ fuerte: k })}>
              <span className="t-sub">{m}</span>
            </button>
          ))}
        </>}

        {p === 'miedo' && <>
          <p className="t-micro" style={{ color: 'var(--acento)' }}>El miedo</p>
          <Frase texto={fuerte} color="var(--zona-roja)" />
          <h1 className="t-display mt-2 mb-3">Gracias, mentiras. ¿De qué me están protegiendo?</h1>
          <p className="t-cuerpo mb-6">Detrás de cada mentira hay un miedo a que algo vuelva a pasar.</p>
          <textarea className="w-full px-5 py-4" style={{ minHeight: 150 }} placeholder="Me protegen de…"
            value={actual.miedo} onChange={(e) => cambiar({ miedo: e.target.value })} />
        </>}

        {p === 'dolor' && <>
          <p className="t-micro" style={{ color: 'var(--acento)' }}>El dolor</p>
          <h1 className="t-display mt-3 mb-3">Si eso pasara, ¿qué dolería?</h1>
          <p className="t-cuerpo mb-6">El dolor, no la explicación. Una frase alcanza.</p>
          <textarea className="w-full px-5 py-4" style={{ minHeight: 150 }} placeholder="Me dolería…"
            value={actual.dolor} onChange={(e) => cambiar({ dolor: e.target.value })} />
        </>}

        {p === 'origen' && <>
          <p className="t-micro" style={{ color: 'var(--acento)' }}>El origen</p>
          <h1 className="t-display mt-3 mb-3">¿Dónde se generó? El primer recuerdo que te venga.</h1>
          <p className="t-cuerpo mb-6">Una escena: dónde estabas, quién estaba, qué pasó. La primera respuesta suele ser de adulto; si es así, más atrás.</p>
          <textarea className="w-full px-5 py-4 mb-4" style={{ minHeight: 150 }} placeholder="Estaba en…"
            value={actual.origen ?? ''} onChange={(e) => cambiar({ origen: e.target.value })} />
          <label className="t-sub block mb-2">¿Qué edad tenías?</label>
          <input type="number" inputMode="numeric" min={1} max={99} className="w-full px-5 py-3" placeholder="Años"
            value={actual.edad ?? ''} onChange={(e) => cambiar({ edad: e.target.value ? Number(e.target.value) : undefined })} />
          {edad >= 18 && <p className="t-sub mt-4" style={{ color: 'var(--acento)' }}>Más atrás. ¿Hay una escena de antes?</p>}
        </>}

        {p === 'mensaje' && <>
          <p className="t-micro" style={{ color: 'var(--acento)' }}>El mensaje</p>
          <h1 className="t-display mt-3 mb-3">¿Qué le dices hoy a quien eras a los {edad}?</h1>
          <p className="t-cuerpo mb-6">Escríbele a esa edad, en segunda persona. Con lo que hoy sabes y entonces no sabías. Esa frase apareció para cuidarte.</p>
          <textarea className="w-full px-5 py-4" style={{ minHeight: 170 }} placeholder="Quiero decirte que…"
            value={actual.perdon} onChange={(e) => cambiar({ perdon: e.target.value })} />
        </>}

        {p === 'antes' && <>
          <p className="t-micro" style={{ color: 'var(--acento)' }}>La yuxtaposición · 1 de 3</p>
          <h1 className="t-display mt-3 mb-5">Dila en voz alta, como la sentías entonces.</h1>
          <Frase texto={fuerte} color="var(--zona-roja)" />
          <p className="t-sub mt-6 mb-3">Del 1 al 10, ¿cuánto la crees hoy?</p>
          <Chips opciones={DIEZ} valor={actual.antes ? String(actual.antes) : undefined} onChange={(v) => cambiar({ antes: Number(v) })} />
        </>}

        {p === 'hecho' && <>
          <p className="t-micro" style={{ color: 'var(--acento)' }}>La yuxtaposición · 2 de 3</p>
          <h1 className="t-display mt-3 mb-3">¿Qué pasó este mes que la contradiga?</h1>
          <p className="t-cuerpo mb-6">Un hecho tuyo, con fecha. Algo que hiciste o que te pasó y que esa frase decía que no podía pasar.</p>
          <textarea className="w-full px-5 py-4" style={{ minHeight: 150 }} placeholder="Este mes…"
            value={actual.hecho ?? ''} onChange={(e) => cambiar({ hecho: e.target.value })} />
        </>}

        {p === 'juntas' && <>
          <p className="t-micro" style={{ color: 'var(--acento)' }}>La yuxtaposición · 3 de 3</p>
          <h1 className="t-display mt-3 mb-5">Ahora las dos, seguidas. Dos veces, en voz alta.</h1>
          <Frase texto={fuerte} color="var(--zona-roja)" />
          <Frase texto={actual.hecho ?? ''} color="var(--zona-verde)" />
          <p className="t-cuerpo mt-2 mb-6">Después, quédate un momento en silencio.</p>
          <p className="t-sub mb-3">Dichas juntas, ¿cuánto crees ahora la primera?</p>
          <Chips opciones={DIEZ} valor={actual.despues ? String(actual.despues) : undefined} onChange={(v) => cambiar({ despues: Number(v) })} />
        </>}

        {p === 'verdad' && <>
          <p className="t-micro" style={{ color: 'var(--acento)' }}>La verdad</p>
          <h1 className="t-display mt-3 mb-3">¿Qué permiso aparece?</h1>
          <p className="t-cuerpo mb-6">Una frase tuya. Una alcanza.</p>
          <textarea className="w-full px-5 py-4" style={{ minHeight: 130 }} placeholder="Tengo permiso para…"
            value={actual.verdad ?? ''} onChange={(e) => cambiar({ verdad: e.target.value })} />
        </>}

        {p === 'test' && <>
          <p className="t-micro" style={{ color: 'var(--acento)' }}>El test</p>
          <h1 className="t-display mt-3 mb-3">¿Bloquea o desbloquea?</h1>
          <p className="t-cuerpo mb-6">Línea por línea. La mentira se reconoce porque bloquea; la verdad, porque abre.</p>
          {lineasTest(actual).map(([k, texto]) => (
            <div key={k} className="tarjeta p-4 mb-3">
              <p className="t-sub mb-3">{texto}</p>
              <div className="flex gap-2">
                {(['bloquea', 'desbloquea'] as Test[]).map((t) => (
                  <button key={t} className="btn-secundario flex-1" style={{
                    minHeight: 48, fontSize: 16,
                    borderColor: actual.test?.[k] === t ? (t === 'bloquea' ? 'var(--zona-roja)' : 'var(--zona-verde)') : undefined,
                    color: actual.test?.[k] === t ? (t === 'bloquea' ? 'var(--zona-roja)' : 'var(--zona-verde)') : undefined,
                  }} onClick={() => cambiar({ test: { ...(actual.test ?? {}), [k]: t } })}>
                    {t === 'bloquea' ? 'Bloquea' : 'Desbloquea'}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </>}

        <button className="btn-primario w-full mt-6" disabled={!puede} onClick={seguir}>
          {paso === PASOS.length - 1 ? 'Cerrar mi Iceberg' : 'Seguir'}
        </button>
        <button className="btn-fantasma w-full mt-1"
          onClick={() => { if (paso > 0) setPaso(paso - 1); else { setActual(null); refrescar(); } }}>
          Volver
        </button>

        {['dolor', 'origen', 'mensaje', 'antes', 'hecho', 'juntas'].includes(p) && <Salida />}
      </div>
    );
  }

  /* ── La lista ── */
  return (
    <div className="pantalla pt-6 pb-28 pagina-anim">
      <p className="t-micro" style={{ color: 'var(--acento)' }}>La tarea del lunes</p>
      <h1 className="t-display mt-3 mb-4">El Iceberg</h1>
      <p className="t-cuerpo mb-3">
        Arriba del agua está lo que se ve. Abajo, lo que lo sostiene. Lo que hoy te bloquea alguna vez te estuvo cuidando.
      </p>
      <p className="t-cuerpo mb-7">
        Doce pantallas, una pregunta por vez. Treinta a cuarenta minutos. Se hace sobre el compromiso que no cumpliste;
        si cumpliste todo, sobre lo que más te costó.
      </p>

      <VideoEje clave="iceberg" titulo="Cómo se hace · video de Javo" />

      <button className="btn-primario w-full flex items-center justify-center gap-2"
        onClick={() => { setActual(vacio()); setPaso(0); }}>
        <Plus size={19} /> Hacer mi Iceberg
      </button>

      {lista.length > 0 && (
        <div className="mt-10">
          <p className="t-micro mb-4" style={{ color: 'var(--texto-tenue)' }}>Los que hiciste</p>
          {[...lista].reverse().map((i) => (
            <div key={i.id} className="tarjeta p-5 mb-3">
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1">
                  <p className="t-sub mb-1">{i.bloqueo}</p>
                  <p className="t-cuerpo" style={{ fontSize: 17 }}>
                    {new Date(i.fecha + 'T12:00:00').toLocaleDateString('es', { day: 'numeric', month: 'long' })}
                    {i.cerrado ? ' · cerrado' : ' · sin terminar'}
                    {i.enviado ? ' · enviado' : ''}
                  </p>
                </div>
                <button className="btn-fantasma" style={{ padding: 6 }} aria-label="Abrir"
                  onClick={() => { const n = normalizarIceberg(i); setActual(n); setPaso(n.cerrado ? 0 : primerPasoPendiente(n)); }}>
                  <ChevronRight size={22} />
                </button>
              </div>
              {(i.verdad || i.perdon) && (
                <p className="voz-maestro mt-4" style={{ fontSize: 19 }}>{i.verdad || i.perdon}</p>
              )}
              <div className="flex gap-4 mt-3">
                <button className="btn-fantasma flex items-center gap-2" style={{ padding: 0 }} onClick={() => enviar(i)}>
                  <Send size={17} /> Enviar a mi terapeuta
                </button>
                <button className="btn-fantasma flex items-center gap-2" style={{ padding: 0 }}
                  onClick={() => { if (confirm('¿Borrar este Iceberg?')) { borrarIceberg(i.id); refrescar(); } }}>
                  <Trash2 size={17} /> Borrar
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <button className="btn-secundario w-full mt-8" onClick={() => navegar('hoy')}>Volver a Hoy</button>
    </div>
  );
}
