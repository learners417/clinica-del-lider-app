/**
 * LA LÍNEA DE LA SEMANA — una frase de tu terapeuta, fijada arriba de todo en Hoy.
 * Se guardan todas: se pueden releer, recortar, imprimir.
 */
import { useEffect, useState } from 'react';
import { listarLineas, type LineaSemana } from '../lib/estadoCdl';
import { cargarMisLineas } from '../lib/lineas';
import { MODO_NUBE } from '../lib/supabase';

const fecha = (iso: string) => new Date(iso).toLocaleDateString('es', { day: 'numeric', month: 'long' });

export default function LineaSemanaTarjeta() {
  const [lineas, setLineas] = useState<LineaSemana[]>(listarLineas());
  const [todas, setTodas] = useState(false);

  useEffect(() => {
    if (!MODO_NUBE) return;
    let vivo = true;
    cargarMisLineas().then((l) => { if (vivo) setLineas(l); });
    return () => { vivo = false; };
  }, []);

  if (lineas.length === 0) return null;
  const [ultima, ...anteriores] = lineas;

  return (
    <div className="mb-5 pagina-anim" style={{ borderTop: '1px solid var(--acento)', borderBottom: '1px solid var(--acento)', padding: '22px 0' }}>
      <p className="t-micro mb-3" style={{ color: 'var(--acento)' }}>La línea de tu semana · {fecha(ultima.fecha)}</p>
      <p className="voz-maestro" style={{ fontSize: 23, lineHeight: 1.4 }}>{ultima.texto}</p>
      {anteriores.length > 0 && (
        todas ? (
          <div className="mt-5">
            {anteriores.map((l) => (
              <div key={l.id} className="py-3" style={{ borderTop: '1px solid var(--borde)' }}>
                <p className="t-micro mb-1" style={{ color: 'var(--texto-tenue)' }}>{fecha(l.fecha)}</p>
                <p className="t-cuerpo">{l.texto}</p>
              </div>
            ))}
            <button className="btn-fantasma pl-0" onClick={() => setTodas(false)}>Ocultar</button>
          </div>
        ) : (
          <button className="btn-fantasma pl-0 mt-2" onClick={() => setTodas(true)}>{anteriores.length === 1 ? 'La anterior' : `Las ${anteriores.length} anteriores`}</button>
        )
      )}
    </div>
  );
}
