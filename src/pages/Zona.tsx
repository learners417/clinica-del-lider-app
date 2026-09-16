/** Mi Zona — evolución medida: Zona Vital, CBI, racha y el Tratamiento. */
import { Stethoscope, Flame } from 'lucide-react';
import { HITO_MEDIO, HITO_CONTRATO } from '../data/camino';
import { descargarRespaldo, restaurarRespaldo, getNombre, listarSesiones, guardarSesion, hoyIso } from '../lib/estadoCdl';
import { useState } from 'react';
import ArbolTablero from '../components/ArbolTablero';
import { MEDIDAS, puntaje, colorPuntaje, indiceJugador, promedioColumna, estadoMedida } from '../data/arbol';
import { useRef } from 'react';
import { toast } from 'sonner';
import { CBI_SUBESCALA_LABEL } from '../data/cbi';
import { ZONAS, zonaDesdeCbi } from '../data/zonas';
import { listarChequeos, calcularRacha, fechaDia90, getProtocolo, diaDelProtocolo } from '../lib/estadoCdl';
import ZonaBadge from '../components/ZonaBadge';
import { PuntoZona } from '../components/ui';

export default function Zona({ irAlChequeo }: { irAlChequeo: () => void }) {
  const archivoRef = useRef<HTMLInputElement>(null);
  const nombrePaciente = getNombre();
  const [sesiones, setSesiones] = useState(listarSesiones());
  const [trabajado, setTrabajado] = useState('');
  const [compromiso, setCompromiso] = useState('');
  const chequeos = listarChequeos();
  const ultimo = chequeos.length ? chequeos[chequeos.length - 1] : null;
  const racha = calcularRacha();
  const protocolo = getProtocolo();
  const diaTrat = protocolo ? diaDelProtocolo(protocolo) : 0;

  if (!ultimo) {
    return (
      <div className="pantalla pt-12 pb-28 text-center">
        <span className="inline-grid place-items-center rounded-3xl mb-4" style={{ width: 64, height: 64, background: 'var(--acento-tinte)' }}>
          <Stethoscope size={30} color="var(--acento)" />
        </span>
        <h1 className="t-titulo mb-2">Todavía no conoces tu Zona</h1>
        <p className="t-cuerpo mb-6">Tu Noche 1 es el Chequeo: 7 minutos, instrumentos clínicos. No puedes liderar lo que no mides.</p>
        <button className="btn-primario w-full" onClick={irAlChequeo}>Hacerme el Chequeo</button>
      </div>
    );
  }

  const zona = zonaDesdeCbi(ultimo.cbi.promedio);

  return (
    <div className="pantalla pt-6 pb-28">
      <p className="t-micro" style={{ color: 'var(--calido)' }}>Tu Zona Actual</p>
      <div className="text-center my-6">
        <ZonaBadge zona={zona} grande />
        <p className="t-cuerpo mt-4">{zona.descripcion}</p>
        <p className="flex items-center justify-center gap-1.5 t-micro mt-3" style={{ color: 'var(--texto-tenue)' }}>
          <Flame size={13} /> Racha de Signos: {racha} {racha === 1 ? 'día' : 'días'}{protocolo ? ` · Tu último día: ${fechaDia90(protocolo.fechaInicio + 'T12:00:00')}` : ''}
        </p>
      </div>

      <div className="tarjeta p-5 mb-4">
        <p className="t-sub mb-3">Tu agotamiento medido (CBI)</p>
        {(['personal', 'trabajo', 'equipo'] as const).map((s) => (
          <div key={s} className="mb-3">
            <div className="flex justify-between mb-1">
              <span className="t-cuerpo" style={{ fontSize: 16 }}>{CBI_SUBESCALA_LABEL[s]}</span>
              <span className="t-dato" style={{ fontSize: 16 }}>{ultimo.cbi[s]}</span>
            </div>
            <div className="barra"><div style={{ width: `${ultimo.cbi[s]}%`, background: ultimo.cbi[s] >= 50 ? 'var(--zona-roja)' : 'var(--zona-verde)' }} /></div>
          </div>
        ))}
      </div>

      <div className="tarjeta p-5 mb-4">
        <p className="t-sub mb-3">El camino de las Zonas</p>
        <div className="space-y-3">
          {ZONAS.map((z) => (
            <div key={z.id} className="flex items-center gap-3" style={{ opacity: z.id === zona.id ? 1 : 0.45 }}>
              <PuntoZona color={z.color} />
              <span className="t-sub">{z.nombre}</span>
              <span className="t-micro ml-auto" style={{ color: 'var(--texto-tenue)' }}>{z.id === zona.id ? 'Estás aquí' : z.rango}</span>
            </div>
          ))}
        </div>
        <p className="t-cuerpo mt-4" style={{ fontSize: 16 }}>La Zona se mueve con evidencia real: tu CBI de los días 45 y 90 y tus hitos verificados. Ver contenido no mueve la Zona. El cambio real, sí.</p>
      </div>

      {chequeos.length > 0 && (
        <div className="tarjeta p-5 mb-4">
          <p className="t-sub mb-1">Tu historia clínica</p>
          <p className="t-cuerpo mb-3" style={{ fontSize: 16 }}>Mismo instrumento, siempre. Por eso el número vale.</p>
          <div className="space-y-2.5">
            {chequeos.map((c, i) => {
              const z = zonaDesdeCbi(c.cbi.promedio);
              const prev = i > 0 ? chequeos[i - 1].cbi.promedio : null;
              const delta = prev === null ? null : c.cbi.promedio - prev;
              return (
                <div key={c.fecha} className="flex items-center gap-3">
                  <PuntoZona color={z.color} size={10} />
                  <div className="flex-1">
                    <p className="t-sub" style={{ fontSize: 16 }}>{i === 0 ? 'Punto de partida' : `Medición ${i + 1}`} <span className="t-micro ml-1" style={{ color: 'var(--texto-tenue)' }}>{new Date(c.fecha).toLocaleDateString('es')}</span></p>
                    <p className="t-cuerpo" style={{ fontSize: 16 }}>{z.nombre}</p>
                  </div>
                  <span className="t-dato" style={{ fontSize: 17 }}>{c.cbi.promedio}</span>
                  {delta !== null && (
                    <span className="t-micro rounded-full px-2 py-1 flex-none" style={{
                      background: delta < 0 ? 'var(--acento-tinte)' : 'rgba(228,87,76,.14)',
                      color: delta < 0 ? 'var(--acento)' : 'var(--zona-roja)',
                    }}>{delta < 0 ? '▼' : '▲'} {Math.abs(delta)}</span>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {protocolo ? (
        <button className="btn-secundario w-full" disabled={diaTrat < HITO_MEDIO} onClick={irAlChequeo}>
          {diaTrat < HITO_MEDIO ? `Tu próxima medición oficial: día ${HITO_MEDIO} (faltan ${HITO_MEDIO - diaTrat})` : 'Hacer mi medición oficial'}
        </button>
      ) : (
        <button className="btn-secundario w-full" onClick={irAlChequeo}>Repetir mi Chequeo</button>
      )}

      {ultimo && (
        <div className="mt-10">
          <div style={{ borderTop: '1px solid var(--acento)', paddingTop: 26 }}>
            <p className="t-micro mb-2" style={{ color: 'var(--acento)' }}>El Espejo</p>
            <h3 className="t-titulo mb-1">Tu Árbol</h3>
            <p className="t-cuerpo mb-5" style={{ fontSize: 16 }}>
              {chequeos.length > 1
                ? `Lo lleno es hoy. El contorno punteado es tu Día 0.`
                : 'Tu punto de partida. Se vuelve a medir el día 42 y el día 84.'}
            </p>
          </div>

          <ArbolTablero tablero={ultimo.rueda} previo={chequeos.length > 1 ? chequeos[0].rueda : undefined} />

          <div className="mt-6">
            {MEDIDAS.map((m) => {
              const v = puntaje(m, ultimo.rueda);
              const previo = chequeos.length > 1 ? puntaje(m, chequeos[0].rueda) : null;
              const delta = previo === null ? null : v - previo;
              return (
                <div key={m.id} className="flex items-baseline justify-between gap-3 py-3"
                  style={{ borderBottom: '1px solid var(--borde)' }}>
                  <div>
                    <span className="t-sub">{m.nombre}</span>
                    <span className="t-cuerpo ml-2" style={{ fontSize: 16 }}>{estadoMedida(v)}</span>
                  </div>
                  <div className="flex items-baseline gap-3">
                    {delta !== null && delta !== 0 && (
                      <span className="t-micro" style={{ color: delta > 0 ? 'var(--zona-verde)' : 'var(--zona-roja)' }}>
                        {delta > 0 ? '+' : ''}{delta}
                      </span>
                    )}
                    <span className="t-dato" style={{ color: colorPuntaje(v), fontSize: 21 }}>{v}</span>
                  </div>
                </div>
              );
            })}
          </div>

          {chequeos.length > 1 && (
            <div className="tarjeta p-5 mt-6">
              <p className="t-micro mb-2" style={{ color: 'var(--acento)' }}>La Evidencia</p>
            <p className="t-sub mb-3">Tus mediciones, una al lado de la otra</p>
              {chequeos.map((c, i) => (
                <div key={c.fecha} className="flex justify-between items-baseline py-2">
                  <span className="t-cuerpo" style={{ fontSize: 16 }}>
                    {i === 0 ? 'Día 0' : new Date(c.fecha).toLocaleDateString('es', { day: 'numeric', month: 'short' })}
                    {' · '}contención {promedioColumna('izq', c.rueda)} · eje {promedioColumna('eje', c.rueda)} · expansión {promedioColumna('der', c.rueda)}
                  </span>
                  <span className="t-dato" style={{ color: colorPuntaje(indiceJugador(c.rueda)), fontSize: 24 }}>
                    {indiceJugador(c.rueda)}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      <div className="mt-10">
        <div style={{ borderTop: '1px solid var(--acento)', paddingTop: 26 }}>
          <p className="t-micro mb-2" style={{ color: 'var(--acento)' }}>La Jugada</p>
          <h3 className="t-titulo mb-1">Tus sesiones</h3>
          <p className="t-cuerpo mb-5" style={{ fontSize: 17 }}>
            Al salir de cada sesión, dos líneas. Lo que se trabajó y a qué te comprometiste.
            Lo que no se escribe se pierde entre una sesión y la siguiente.
          </p>
        </div>

        <div className="tarjeta p-5">
          <label className="t-micro block mb-2" style={{ color: 'var(--texto-tenue)' }}>Qué trabajamos hoy</label>
          <textarea className="w-full px-4 py-3 mb-4" style={{ minHeight: 90 }}
            placeholder="En una línea" value={trabajado} onChange={(e) => setTrabajado(e.target.value)} />
          <label className="t-micro block mb-2" style={{ color: 'var(--texto-tenue)' }}>A qué me comprometí</label>
          <textarea className="w-full px-4 py-3" style={{ minHeight: 90 }}
            placeholder="Algo concreto, con fecha" value={compromiso} onChange={(e) => setCompromiso(e.target.value)} />
          <button className="btn-primario w-full mt-4" disabled={trabajado.trim().length < 3}
            onClick={() => {
              guardarSesion({ fecha: hoyIso(), trabajado: trabajado.trim(), compromiso: compromiso.trim() });
              setSesiones(listarSesiones()); setTrabajado(''); setCompromiso('');
              toast.success('Sesión guardada.');
            }}>
            Guardar la sesión
          </button>
        </div>

        {sesiones.length > 0 && (
          <div className="mt-5">
            {[...sesiones].reverse().map((s) => (
              <div key={s.fecha} className="py-4" style={{ borderBottom: '1px solid var(--borde)' }}>
                <p className="t-micro mb-2" style={{ color: 'var(--texto-tenue)' }}>
                  {new Date(s.fecha + 'T12:00:00').toLocaleDateString('es', { day: 'numeric', month: 'long' })}
                </p>
                <p className="t-sub mb-1">{s.trabajado}</p>
                {s.compromiso && <p className="t-cuerpo" style={{ fontSize: 18 }}>Me comprometí a: {s.compromiso}</p>}
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="tarjeta p-5 mt-8">
        <p className="t-sub mb-2">Tu respaldo</p>
        <p className="t-cuerpo" style={{ fontSize: 16 }}>
          Todo lo que respondes se guarda en este teléfono. Si cambias de equipo o borras los datos del navegador, se pierde.
          Descarga tu respaldo de vez en cuando y guárdalo donde guardas lo importante.
        </p>
        <div className="flex gap-3 mt-4">
          <button className="btn-secundario flex-1" style={{ minHeight: 52, fontSize: 16 }}
            onClick={() => { const a = descargarRespaldo(nombrePaciente || 'clinica'); toast.success(`Respaldo descargado: ${a}`); }}>
            Descargar
          </button>
          <button className="btn-secundario flex-1" style={{ minHeight: 52, fontSize: 16 }}
            onClick={() => archivoRef.current?.click()}>
            Restaurar
          </button>
        </div>
        <input ref={archivoRef} type="file" accept="application/json" style={{ display: 'none' }}
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (!f) return;
            if (!confirm('Restaurar va a reemplazar lo que haya en este teléfono. ¿Seguimos?')) { e.target.value = ''; return; }
            const lector = new FileReader();
            lector.onload = () => {
              const r = restaurarRespaldo(String(lector.result));
              if (r.ok) { toast.success('Respaldo restaurado.'); setTimeout(() => location.reload(), 900); }
              else toast.error(r.error ?? 'No se pudo restaurar.');
            };
            lector.readAsText(f);
            e.target.value = '';
          }} />
      </div>
    </div>
  );
}
