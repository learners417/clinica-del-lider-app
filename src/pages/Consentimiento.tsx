/**
 * EL CONSENTIMIENTO — antes del Chequeo, una sola vez.
 * Tres pantallas: qué es esto, qué pasa con lo que escribe, cuándo se deriva. Y su nombre.
 */
import { useState } from 'react';
import { firmarConsentimiento, getNombre, setNombre } from '../lib/estadoCdl';
import { MODO_NUBE } from '../lib/supabase';
import { TEXTO_EMERGENCIA } from '../components/Salida';

const PANTALLAS = [
  {
    cap: '1 de 3 · Qué es',
    titulo: 'Doce semanas de trabajo guiado, medido.',
    parrafos: [
      'Una acción por día en la app, tres mediciones con el mismo instrumento y, si eres Acompañado, dos sesiones por semana: el martes lo de adentro, el jueves el negocio.',
      'Es acompañamiento y entrenamiento para líderes. Los diagnósticos y los tratamientos de salud mental los hace un profesional de la salud, y cuando haga falta te ayudamos a llegar a uno.',
    ],
  },
  {
    cap: '2 de 3 · Lo que escribes',
    titulo: 'Lo tuyo, y quién lo ve.',
    parrafos: MODO_NUBE ? [
      'Lo que registras se guarda en tu cuenta. Tu terapeuta ve tus mediciones, tus Signos, tus Iceberg, tus sesiones y tus Jugadas, para preparar cada encuentro.',
      'Tu Mensaje del día 84 y tus informes semanales son solo tuyos. La Descarga no se guarda en ningún lado. Tu testimonio lo ve tu terapeuta solo si eliges compartirlo.',
      'Cuando quieras, escríbenos y borramos todos tus datos.',
    ] : [
      'Lo que registras se guarda en este teléfono. Lo que compartes con tu terapeuta lo mandas tú, por WhatsApp.',
      'La Descarga no se guarda en ningún lado. Descarga tu respaldo de vez en cuando desde Mi Zona.',
    ],
  },
  {
    cap: '3 de 3 · Cuándo se deriva',
    titulo: 'Tu bienestar va primero.',
    parrafos: [
      'Si el Chequeo o algo que aparece en el trabajo necesita atención de salud, te lo decimos esa misma semana y te ayudamos a llegar a un profesional. Esa conversación va antes que cualquier otra cosa del programa.',
      'En el trabajo de adentro pueden aparecer recuerdos que movilizan. Puedes frenar cualquier ejercicio cuando quieras: en esas pantallas está siempre “Si esto te desborda”.',
    ],
    fuerte: TEXTO_EMERGENCIA,
  },
];

export default function Consentimiento({ onFirmado }: { onFirmado: () => void }) {
  const [paso, setPaso] = useState(0);
  const [nombre, setNombreLocal] = useState(getNombre());
  const [acepta, setAcepta] = useState(false);
  const ultima = paso === PANTALLAS.length;

  function firmar() {
    setNombre(nombre);
    firmarConsentimiento(nombre);
    onFirmado();
  }

  return (
    <div className="pantalla pt-8 pb-28 pagina-anim" key={paso}>
      <div className="flex gap-1.5 mb-8">
        {[...PANTALLAS, null].map((_, i) => (
          <i key={i} className="flex-1" style={{ height: 2, borderRadius: 2, background: i <= paso ? 'var(--acento)' : 'rgba(21,19,15,.12)' }} />
        ))}
      </div>

      {!ultima ? (() => {
        const p = PANTALLAS[paso];
        return (
          <>
            <p className="t-micro" style={{ color: 'var(--acento)' }}>{p.cap}</p>
            <h1 className="t-display mt-3 mb-5">{p.titulo}</h1>
            {p.parrafos.map((t) => <p key={t} className="t-cuerpo mb-4">{t}</p>)}
            {p.fuerte && <p className="t-sub mt-2" style={{ color: 'var(--zona-roja)' }}>{p.fuerte}</p>}
            <button className="btn-primario w-full mt-8" onClick={() => { setPaso(paso + 1); window.scrollTo({ top: 0 }); }}>Seguir</button>
            {paso > 0 && <button className="btn-fantasma w-full mt-1" onClick={() => setPaso(paso - 1)}>Volver</button>}
          </>
        );
      })() : (
        <>
          <p className="t-micro" style={{ color: 'var(--acento)' }}>Antes de empezar</p>
          <h1 className="t-display mt-3 mb-5">Tu nombre, y listo.</h1>
          <input className="w-full px-5 py-4 mb-5" placeholder="Nombre y apellido" autoComplete="name"
            value={nombre} onChange={(e) => setNombreLocal(e.target.value)} />
          <label className="flex items-start gap-3 cursor-pointer">
            <input type="checkbox" checked={acepta} onChange={(e) => setAcepta(e.target.checked)}
              style={{ width: 24, height: 24, marginTop: 3, accentColor: 'var(--acento)' }} />
            <span className="t-cuerpo">Leí las tres pantallas y quiero empezar.</span>
          </label>
          <button className="btn-primario w-full mt-8" disabled={!acepta || nombre.trim().length < 3} onClick={firmar}>Acepto y empiezo</button>
          <button className="btn-fantasma w-full mt-1" onClick={() => setPaso(paso - 1)}>Volver</button>
        </>
      )}
    </div>
  );
}
