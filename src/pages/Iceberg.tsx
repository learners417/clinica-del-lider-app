/**
 * EL ÁRBOL — la tarea del lunes, capa por capa.
 *
 * Un solo nombre y una sola metáfora: el fruto arriba, la raíz abajo. (Hasta v3
 * esta herramienta se llamaba el Iceberg y en sesión se la nombraba árbol,
 * mamushkas o VHS: cuatro palabras para una estructura, y el consultante no
 * lograba distinguir las capas. Las claves internas siguen diciendo iceberg
 * para no dejar huérfanos los árboles ya cargados.)
 *
 * LIMPIAR — de un fruto que no gusta, hacia abajo:
 * fruto → mentiras (“¿Qué más?”) → la más fuerte → beneficio → miedo → dolor →
 * origen (escena: quién, qué edad) → la frase textual → el mensaje a quien eras →
 * la yuxtaposición (la frase vieja y un hecho con fecha, dichas juntas, con su
 * número antes y después) → el permiso → el test.
 *
 * SEMBRAR — de un fruto bueno, hacia arriba (validado en sesión el 13 oct 2026):
 * fruto → verdad → beneficio visible → amor → y el fruto queda cargado como el
 * hecho con fecha de un árbol que se está limpiando. Uno alimenta al otro.
 *
 * Cada pantalla lleva su propia prueba, en una línea: es lo único que permite
 * distinguir un fruto de una mentira en el momento de escribir.
 * Una pregunta por pantalla. La verdad la escribe el consultante: la app no
 * sugiere ninguna. Lo que te bloquea te estuvo cuidando: ninguna capa se mira
 * con látigo.
 */
import { useState } from 'react';
import { toast } from 'sonner';
import { ChevronRight, Trash2, Send, Sprout, Scissors, HelpCircle } from 'lucide-react';
import {
  listarIcebergs, guardarIceberg, borrarIceberg, normalizarIceberg, hoyIso, getNombre, resumenEscena,
  modoArbol, esperandoHecho, yuxtaponerEn,
  type Iceberg, type PaginaId, type Test,
} from '../lib/estadoCdl';
import { Chips } from '../components/ui';
import { VideoEje } from '../components/Contenido';
import { textoIceberg, abrirWhatsApp } from '../lib/envio';
import { MODO_NUBE } from '../lib/supabase';
import Salida from '../components/Salida';

export type Paso = 'fruto' | 'mentiras' | 'fuerte' | 'beneficio' | 'miedo' | 'dolor' | 'origen' | 'frase' | 'mensaje'
  | 'antes' | 'hecho' | 'juntas' | 'verdad' | 'test'
  | 'verdadS' | 'beneficioS' | 'amor' | 'yuxta';

export const PASOS_LIMPIAR: Paso[] = ['fruto', 'mentiras', 'fuerte', 'beneficio', 'miedo', 'dolor', 'origen', 'frase', 'mensaje', 'antes', 'hecho', 'juntas', 'verdad', 'test'];
export const PASOS_SEMBRAR: Paso[] = ['fruto', 'verdadS', 'beneficioS', 'amor', 'yuxta'];

export const pasosDe = (i: Iceberg): Paso[] => (modoArbol(i) === 'sembrar' ? PASOS_SEMBRAR : PASOS_LIMPIAR);

/** Las seis capas con su prueba — la referencia que evita explicarlas en vivo. */
export const CAPAS: { n: string; nombre: string; que: string; prueba: string }[] = [
  { n: '1', nombre: 'Fruto', que: 'Lo que pasó, afuera.', prueba: '¿Lo puede verificar otra persona? ¿Lo filmaría una cámara?' },
  { n: '2', nombre: 'Mentira', que: 'La frase que justifica ese fruto.', prueba: '¿Bloquea o abre? Y suena razonable: por eso se sostiene.' },
  { n: '3', nombre: 'Beneficio', que: 'Lo que ganas con esa frase.', prueba: '¿Qué perderías si la sueltas hoy?' },
  { n: '4', nombre: 'Miedo', que: 'De qué te protege ese beneficio.', prueba: 'Si eso pasara, ¿qué sería lo peor?' },
  { n: '5', nombre: 'Origen', que: 'La escena donde se grabó.', prueba: '¿Tiene una persona con nombre y una edad? Sin eso es réplica, no raíz.' },
  { n: '6', nombre: 'Yuxtaposición', que: 'La frase vieja y un hecho con fecha, dichas juntas.', prueba: '¿Cuánto crees la frase antes y cuánto después?' },
];

const DIEZ = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'];

const vacio = (modo: 'limpiar' | 'sembrar'): Iceberg => ({
  id: String(Date.now()), fecha: hoyIso(), modo,
  bloqueo: '', mentira: '', miedo: '', dolor: '', perdon: '', cerrado: false,
  mentiras: [''], test: {},
});

const lleno = (t?: string) => (t ?? '').trim().length >= 3;
const mentirasLlenas = (i: Iceberg) => (i.mentiras ?? []).filter(lleno);

export function completo(i: Iceberg, p: Paso): boolean {
  switch (p) {
    case 'fruto': return lleno(i.bloqueo);
    case 'mentiras': return mentirasLlenas(i).length >= 3;
    case 'fuerte': return i.fuerte !== undefined && lleno(i.mentiras?.[i.fuerte]);
    case 'beneficio': return lleno(i.beneficio);
    case 'miedo': return lleno(i.miedo);
    case 'dolor': return lleno(i.dolor);
    case 'origen': return lleno(i.origen) && Boolean(i.edad) && lleno(i.quien);
    case 'frase': return true; // no en toda escena alguien dijo algo
    case 'mensaje': return lleno(i.perdon);
    case 'antes': return Boolean(i.antes);
    case 'hecho': return lleno(i.hecho);
    case 'juntas': return Boolean(i.despues);
    case 'verdad': return lleno(i.verdad);
    case 'test': return lineasTest(i).every(([k]) => Boolean(i.test?.[k]));
    /* ── sembrar ── */
    case 'verdadS': return lleno(i.verdad);
    case 'beneficioS': return lleno(i.beneficio);
    case 'amor': return lleno(i.amor);
    case 'yuxta': return true; // enlazar es opcional: el fruto vale por sí mismo
  }
}

function lineasTest(i: Iceberg): [string, string][] {
  const ms = (i.mentiras ?? []).map((m, k) => [`m${k}`, m] as [string, string]).filter(([, m]) => lleno(m));
  return lleno(i.verdad) ? [...ms, ['verdad', i.verdad!]] : ms;
}

export function primerPasoPendiente(i: Iceberg): number {
  const ps = pasosDe(i);
  const k = ps.findIndex((p) => !completo(i, p));
  return k === -1 ? ps.length - 1 : k;
}

export default function IcebergPage({ navegar }: { navegar: (p: PaginaId) => void }) {
  const [lista, setLista] = useState<Iceberg[]>(listarIcebergs().map(normalizarIceberg));
  const [actual, setActual] = useState<Iceberg | null>(null);
  const [paso, setPaso] = useState(0);
  const [listo, setListo] = useState<Iceberg | null>(null);
  const [guia, setGuia] = useState(false);

  function refrescar() { setLista(listarIcebergs().map(normalizarIceberg)); }

  function cambiar(parcial: Partial<Iceberg>) {
    if (actual) setActual({ ...actual, ...parcial });
  }

  function seguir() {
    if (!actual) return;
    const ps = pasosDe(actual);
    if (!completo(actual, ps[paso])) return;
    const fuerte = actual.fuerte !== undefined ? (actual.mentiras?.[actual.fuerte] ?? '') : '';
    const ultimo = paso === ps.length - 1;
    const guardado: Iceberg = { ...actual, mentira: fuerte, cerrado: ultimo, cerradoEn: ultimo ? hoyIso() : actual.cerradoEn };
    guardarIceberg(guardado);
    // Un árbol sembrado deja su fruto como el hecho con fecha del árbol elegido.
    if (ultimo && modoArbol(guardado) === 'sembrar' && guardado.enlazado) {
      yuxtaponerEn(guardado.enlazado, guardado.bloqueo);
    }
    refrescar();
    if (ultimo) { setActual(null); setListo(guardado); }
    else { setActual(guardado); setPaso(paso + 1); }
    window.scrollTo({ top: 0 });
  }

  function enviar(i: Iceberg) {
    abrirWhatsApp(textoIceberg(i, getNombre()));
    guardarIceberg({ ...i, enviado: hoyIso() });
    refrescar();
    toast.success('Se abrió WhatsApp con tu Árbol.');
  }

  /* ── Terminado ── */
  if (listo) {
    const baja = listo.antes && listo.despues ? listo.antes - listo.despues : 0;
    const sembrado = modoArbol(listo) === 'sembrar';
    const destino = listo.enlazado ? lista.find((x) => x.id === listo.enlazado) : undefined;
    return (
      <div className="pantalla pt-6 pb-28 pagina-anim">
        <p className="t-micro" style={{ color: 'var(--acento)' }}>Tu Árbol de la semana</p>
        <h1 className="t-display mt-3 mb-4">Listo para tu sesión.</h1>
        {sembrado && (
          <div className="tarjeta p-5 mb-5" style={{ borderLeft: '2px solid var(--zona-verde)' }}>
            <p className="t-micro mb-2" style={{ color: 'var(--texto-tenue)' }}>Tu fruto</p>
            <p className="t-titulo mb-2">{listo.bloqueo}</p>
            {destino ? (
              <p className="t-cuerpo">Quedó cargado como el hecho con fecha de «{destino.bloqueo}». Abre ese árbol y di las dos frases juntas.</p>
            ) : (
              <p className="t-cuerpo">Guardado. Cuando trabajes un árbol que necesite un hecho con fecha, este sirve.</p>
            )}
          </div>
        )}
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
    const ps = pasosDe(actual);
    const p = ps[paso];
    const sembrar = modoArbol(actual) === 'sembrar';
    const fuerte = actual.fuerte !== undefined ? actual.mentiras?.[actual.fuerte] ?? '' : '';
    const puede = completo(actual, p);
    const edad = actual.edad ?? 0;

    const Frase = ({ texto, color }: { texto: string; color: string }) => (
      <div className="tarjeta p-5 mb-4" style={{ borderLeft: `2px solid ${color}` }}>
        <p className="t-titulo" style={{ lineHeight: 1.3 }}>“{texto}”</p>
      </div>
    );

    /** La prueba de la capa, en una línea. Es lo que permite no confundirlas. */
    const Prueba = ({ texto }: { texto: string }) => (
      <p className="t-cuerpo mb-6" style={{ color: 'var(--acento)' }}>La prueba: {texto}</p>
    );

    return (
      <div className="pantalla pt-6 pb-28 pagina-anim" key={p}>
        <div className="flex gap-1 mb-8">
          {ps.map((_, i) => (
            <i key={i} className="flex-1" style={{ height: 2, borderRadius: 2, background: i <= paso ? 'var(--acento)' : 'rgba(21,19,15,.12)' }} />
          ))}
        </div>

        {p === 'fruto' && (sembrar ? <>
          <p className="t-micro" style={{ color: 'var(--zona-verde)' }}>El fruto · lo que sí</p>
          <h1 className="t-display mt-3 mb-3">¿Qué hiciste esta vez que antes no podías?</h1>
          <p className="t-cuerpo mb-3">Un momento concreto, con fecha. Dónde fue, quién estaba, qué dijiste o qué hiciste. Y cómo se dio cuenta el otro.</p>
          <Prueba texto="¿lo puede verificar la otra persona que estuvo ahí?" />
          <textarea className="w-full px-5 py-4" style={{ minHeight: 150 }} placeholder="El martes, cuando…"
            value={actual.bloqueo} onChange={(e) => cambiar({ bloqueo: e.target.value })} />
        </> : <>
          <p className="t-micro" style={{ color: 'var(--acento)' }}>El fruto · lo que se ve</p>
          <h1 className="t-display mt-3 mb-3">¿Qué se ve desde afuera?</h1>
          <p className="t-cuerpo mb-3">Lo que notaría alguien que entra a tu oficina, a tu casa o a tu perfil. Un hecho, no una explicación. Si es tu tarea del lunes: el compromiso que no cumpliste, o lo que más te costó.</p>
          <Prueba texto="¿lo puede verificar otra persona? Si es algo que sientes o piensas, todavía no es el fruto." />
          <textarea className="w-full px-5 py-4" style={{ minHeight: 150 }} placeholder="Lo que se ve es…"
            value={actual.bloqueo} onChange={(e) => cambiar({ bloqueo: e.target.value })} />
        </>)}

        {p === 'mentiras' && <>
          <p className="t-micro" style={{ color: 'var(--acento)' }}>Las mentiras</p>
          <h1 className="t-display mt-3 mb-3">¿Qué te dices para explicar que siga así?</h1>
          <p className="t-cuerpo mb-3">Todas las explicaciones que te das. Una por línea. Cuando creas que terminaste, toca “¿Qué más?”. Salen de a cinco; con tres ya puedes bajar.</p>
          <Prueba texto="¿bloquea o abre? Y va a sonar razonable: por eso se sostiene." />
          {(actual.mentiras ?? ['']).map((m, k) => (
            <textarea key={k} className="w-full px-5 py-3 mb-3" style={{ minHeight: 70 }} placeholder={k === 0 ? 'Me digo que…' : 'Otra más…'}
              value={m} onChange={(e) => {
                const ms = [...(actual.mentiras ?? [''])]; ms[k] = e.target.value; cambiar({ mentiras: ms });
              }} />
          ))}
          <button className="btn-secundario w-full" disabled={!lleno(actual.mentiras?.[actual.mentiras.length - 1])}
            onClick={() => cambiar({ mentiras: [...(actual.mentiras ?? []), ''] })}>
            ¿Qué más?
          </button>
        </>}

        {p === 'beneficio' && <>
          <p className="t-micro" style={{ color: 'var(--acento)' }}>El beneficio</p>
          <Frase texto={fuerte} color="var(--zona-roja)" />
          <h1 className="t-display mt-2 mb-3">¿Qué ganas creyendo esa frase?</h1>
          <p className="t-cuerpo mb-3">Nadie se miente por nada: algo gana. Y suele ser algo que no se dice en voz alta.</p>
          <Prueba texto="¿qué perderías si la sueltas hoy?" />
          <textarea className="w-full px-5 py-4" style={{ minHeight: 150 }} placeholder="Gano…"
            value={actual.beneficio ?? ''} onChange={(e) => cambiar({ beneficio: e.target.value })} />
        </>}

        {p === 'verdadS' && <>
          <p className="t-micro" style={{ color: 'var(--zona-verde)' }}>La verdad</p>
          <Frase texto={actual.bloqueo} color="var(--zona-verde)" />
          <h1 className="t-display mt-2 mb-3">¿Qué creencia tuya te permitió hacer eso?</h1>
          <p className="t-cuerpo mb-3">La frase que lo sostuvo en el momento. Una tuya, con tus palabras.</p>
          <Prueba texto="¿abre? Si no te hubieras creído esa frase, no pasaba." />
          <textarea className="w-full px-5 py-4" style={{ minHeight: 140 }} placeholder="Pude porque…"
            value={actual.verdad ?? ''} onChange={(e) => cambiar({ verdad: e.target.value })} />
        </>}

        {p === 'beneficioS' && <>
          <p className="t-micro" style={{ color: 'var(--zona-verde)' }}>El beneficio</p>
          <Frase texto={actual.verdad ?? ''} color="var(--zona-verde)" />
          <h1 className="t-display mt-2 mb-3">¿Qué ganaste por hacerlo así?</h1>
          <p className="t-cuerpo mb-3">Lo que se notó después, en ti y afuera.</p>
          <Prueba texto="¿se nota desde afuera o solo lo sabes tú? Las dos cosas sirven." />
          <textarea className="w-full px-5 py-4" style={{ minHeight: 140 }} placeholder="Gané…"
            value={actual.beneficio ?? ''} onChange={(e) => cambiar({ beneficio: e.target.value })} />
        </>}

        {p === 'amor' && <>
          <p className="t-micro" style={{ color: 'var(--zona-verde)' }}>Abajo de todo</p>
          <h1 className="t-display mt-3 mb-3">¿Qué te estabas diciendo sobre ti?</h1>
          <p className="t-cuerpo mb-3">Debajo de la verdad y del beneficio hay una forma de tratarte. Esa es la raíz de este árbol, y es la que se riega.</p>
          <Prueba texto="¿lo podrías decir mirándote a los ojos?" />
          <textarea className="w-full px-5 py-4" style={{ minHeight: 140 }} placeholder="Me…"
            value={actual.amor ?? ''} onChange={(e) => cambiar({ amor: e.target.value })} />
        </>}

        {p === 'yuxta' && (() => {
          const candidatos = esperandoHecho().filter((x) => x.id !== actual.id);
          return <>
            <p className="t-micro" style={{ color: 'var(--zona-verde)' }}>La yuxtaposición</p>
            <h1 className="t-display mt-3 mb-3">¿A qué árbol le sirve este hecho?</h1>
            <p className="t-cuerpo mb-6">
              Este fruto tiene fecha y pasó. Elige un árbol que estés limpiando y queda cargado ahí como el hecho
              que contradice su frase vieja. {candidatos.length ? '' : 'Todavía no tienes árboles esperando un hecho: sigue sin elegir ninguno.'}
            </p>
            {candidatos.map((c) => (
              <button key={c.id} className="tarjeta tarjeta-hover w-full text-left p-4 mb-3" style={{
                borderColor: actual.enlazado === c.id ? 'var(--acento)' : undefined,
                background: actual.enlazado === c.id ? 'var(--acento-tinte)' : undefined,
              }} onClick={() => cambiar({ enlazado: actual.enlazado === c.id ? undefined : c.id })}>
                <span className="t-sub">{c.bloqueo}</span>
                {c.mentira && <span className="t-cuerpo block" style={{ fontSize: 16, color: 'var(--texto-tenue)' }}>“{c.mentira}”</span>}
              </button>
            ))}
          </>;
        })()}

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
          <p className="t-cuerpo mb-3">El dolor, no la explicación. Una frase alcanza.</p>
          <Prueba texto="¿lo sientes en el cuerpo al leerlo? Si solo lo entiendes, falta una capa." />
          <textarea className="w-full px-5 py-4" style={{ minHeight: 150 }} placeholder="Me dolería…"
            value={actual.dolor} onChange={(e) => cambiar({ dolor: e.target.value })} />
        </>}

        {p === 'origen' && <>
          <p className="t-micro" style={{ color: 'var(--acento)' }}>El origen · abajo de todo</p>
          <h1 className="t-display mt-3 mb-3">¿Dónde se generó? El primer recuerdo que te venga.</h1>
          <p className="t-cuerpo mb-3">Una escena, no una explicación: dónde estabas y qué pasó. Y no hace falta que te lo hayan dicho: pudo ser algo que viste.</p>
          <Prueba texto="¿tiene una persona con nombre y una edad? Sin eso es réplica, no raíz." />
          <textarea className="w-full px-5 py-4 mb-6" style={{ minHeight: 140 }} placeholder="Estaba en…"
            value={actual.origen ?? ''} onChange={(e) => cambiar({ origen: e.target.value })} />

          <label className="t-sub block mb-2">¿Quién estaba ahí?</label>
          <p className="t-cuerpo mb-3">Con nombre. Tu mamá, tu abuelo Pedro, la maestra, tu hermano. Si había varios, el que más pesa.</p>
          <input className="w-full px-5 py-3 mb-6" placeholder="Nombre"
            value={actual.quien ?? ''} onChange={(e) => cambiar({ quien: e.target.value })} />

          <label className="t-sub block mb-2">¿Qué edad tenías?</label>
          <input type="number" inputMode="numeric" min={1} max={99} className="w-full px-5 py-3" placeholder="Años"
            value={actual.edad ?? ''} onChange={(e) => cambiar({ edad: e.target.value ? Number(e.target.value) : undefined })} />
          {edad >= 18 && (
            <p className="t-sub mt-4" style={{ color: 'var(--acento)' }}>
              Más atrás. A esa edad ya dolía porque algo anterior lo había grabado: ¿hay una escena de antes?
            </p>
          )}
        </>}

        {p === 'frase' && <>
          <p className="t-micro" style={{ color: 'var(--acento)' }}>La frase</p>
          <h1 className="t-display mt-3 mb-3">¿Qué se dijo ahí, con esas palabras?</h1>
          <p className="t-cuerpo mb-6">
            Lo que {lleno(actual.quien) ? actual.quien!.trim() : 'esa persona'} dijo, textual, como lo escuchaste a los {edad || '…'}.
            Las palabras exactas, no el resumen. Si en esa escena nadie dijo nada, sigue de largo.
          </p>
          <textarea className="w-full px-5 py-4" style={{ minHeight: 140 }} placeholder="“…”"
            value={actual.frase ?? ''} onChange={(e) => cambiar({ frase: e.target.value })} />
        </>}

        {p === 'mensaje' && <>
          <p className="t-micro" style={{ color: 'var(--acento)' }}>El mensaje</p>
          {lleno(actual.frase) && <Frase texto={actual.frase!} color="var(--zona-roja)" />}
          <h1 className="t-display mt-3 mb-3">¿Qué le dices hoy a quien eras a los {edad}?</h1>
          <p className="t-cuerpo mb-6">
            Escríbele a esa edad, en segunda persona, con lo que hoy sabes y entonces no sabías.
            {lleno(actual.quien) ? ` A ese que estaba con ${actual.quien!.trim()} y entendió lo que pudo entender.` : ''}
            {' '}Esa frase apareció para cuidarte.
          </p>
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
          {paso === ps.length - 1 ? 'Cerrar mi Árbol' : 'Seguir'}
        </button>
        <button className="btn-fantasma w-full mt-1"
          onClick={() => { if (paso > 0) setPaso(paso - 1); else { setActual(null); refrescar(); } }}>
          Volver
        </button>

        {['beneficio', 'miedo', 'dolor', 'origen', 'frase', 'mensaje', 'antes', 'hecho', 'juntas', 'amor'].includes(p) && <Salida />}
      </div>
    );
  }

  /* ── La lista ── */
  const abiertos = lista.filter((i) => !i.cerrado).length;
  return (
    <div className="pantalla pt-6 pb-28 pagina-anim">
      <p className="t-micro" style={{ color: 'var(--acento)' }}>La tarea del lunes</p>
      <h1 className="t-display mt-3 mb-4">El Árbol</h1>
      <p className="t-cuerpo mb-3">
        Arriba está el fruto: lo que se ve. Abajo está la raíz: la escena donde se grabó la frase que lo sostiene.
        Lo que hoy te bloquea alguna vez te estuvo cuidando.
      </p>
      <p className="t-cuerpo mb-6">
        Una pregunta por pantalla, treinta a cuarenta minutos. Se hace sobre el compromiso que no cumpliste;
        si cumpliste todo, sobre lo que más te costó.
      </p>

      {/* Las seis capas con su prueba: la referencia que evita preguntar en vivo. */}
      <button className="btn-secundario w-full flex items-center justify-center gap-2 mb-3"
        style={{ minHeight: 52 }} onClick={() => setGuia(!guia)}>
        <HelpCircle size={19} /> {guia ? 'Cerrar las seis capas' : 'Las seis capas y su prueba'}
      </button>
      {guia && (
        <div className="tarjeta p-5 mb-7">
          {CAPAS.map((c) => (
            <div key={c.n} className="mb-5">
              <p className="t-micro mb-1" style={{ color: 'var(--acento)' }}>Capa {c.n}</p>
              <p className="t-sub mb-1">{c.nombre} · {c.que}</p>
              <p className="t-cuerpo" style={{ fontSize: 17, color: 'var(--texto-tenue)' }}>{c.prueba}</p>
            </div>
          ))}
          <p className="voz-maestro" style={{ fontSize: 19 }}>
            El fruto pasó afuera. La mentira la piensas adentro.
          </p>
        </div>
      )}

      <VideoEje clave="iceberg" titulo="Cómo se hace · video de Javo" />

      <p className="t-micro mb-3" style={{ color: 'var(--texto-tenue)' }}>Elige por dónde entras</p>
      <button className="btn-primario w-full flex items-center justify-center gap-2"
        onClick={() => { setActual(vacio('limpiar')); setPaso(0); }}>
        <Scissors size={19} /> El Iceberg · limpiar un fruto que no me gusta
      </button>
      <p className="t-cuerpo mt-2 mb-5" style={{ fontSize: 17, color: 'var(--texto-tenue)' }}>
        Catorce pantallas, una pregunta por pantalla, del fruto al test.
      </p>

      <button className="btn-secundario w-full flex items-center justify-center gap-2"
        style={{ minHeight: 56, borderColor: 'var(--zona-verde)', color: 'var(--zona-verde)' }}
        onClick={() => { setActual(vacio('sembrar')); setPaso(0); }}>
        <Sprout size={19} /> Sembrar un fruto que sí logré
      </button>
      <p className="t-cuerpo mt-2" style={{ fontSize: 17, color: 'var(--texto-tenue)' }}>
        Cinco pantallas. Sube del logro hasta la raíz que lo sostuvo
        {abiertos > 0 ? ', y queda cargado como el hecho con fecha de un árbol que estés limpiando.' : '.'}
      </p>

      {lista.length > 0 && (
        <div className="mt-10">
          <p className="t-micro mb-4" style={{ color: 'var(--texto-tenue)' }}>Tus árboles</p>
          {[...lista].reverse().map((i) => (
            <div key={i.id} className="tarjeta p-5 mb-3" style={{
              borderLeft: `2px solid ${modoArbol(i) === 'sembrar' ? 'var(--zona-verde)' : 'var(--hairline-acento)'}`,
            }}>
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1">
                  <p className="t-micro mb-2" style={{ color: modoArbol(i) === 'sembrar' ? 'var(--zona-verde)' : 'var(--acento)' }}>
                    {modoArbol(i) === 'sembrar' ? 'Sembrado' : 'El Iceberg · en limpieza'}
                  </p>
                  <p className="t-sub mb-1">{i.bloqueo}</p>
                  {resumenEscena(i) && (
                    <p className="t-cuerpo mb-1" style={{ fontSize: 17, color: 'var(--acento)' }}>{resumenEscena(i)}</p>
                  )}
                  <p className="t-cuerpo" style={{ fontSize: 17 }}>
                    {new Date(i.fecha + 'T12:00:00').toLocaleDateString('es', { day: 'numeric', month: 'long' })}
                    {i.cerrado ? ' · cerrado' : ' · abierto'}
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
                  onClick={() => { if (confirm('¿Borrar este Árbol?')) { borrarIceberg(i.id); refrescar(); } }}>
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
