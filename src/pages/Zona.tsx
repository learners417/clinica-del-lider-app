/** Mi Zona — evolución medida: Zona Vital, CBI, racha y el Tratamiento. */
import { Stethoscope, Flame } from 'lucide-react';
import { HITO_MEDIO, HITO_CONTRATO } from '../data/camino';
import { CBI_SUBESCALA_LABEL } from '../data/cbi';
import { ZONAS, zonaDesdeCbi } from '../data/zonas';
import { listarChequeos, calcularRacha, fechaDia90, getProtocolo, diaDelProtocolo } from '../lib/estadoCdl';
import ZonaBadge from '../components/ZonaBadge';
import { PuntoZona } from '../components/ui';

export default function Zona({ irAlChequeo }: { irAlChequeo: () => void }) {
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
              <span className="t-cuerpo" style={{ fontSize: 13 }}>{CBI_SUBESCALA_LABEL[s]}</span>
              <span className="t-dato" style={{ fontSize: 15 }}>{ultimo.cbi[s]}</span>
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
        <p className="t-cuerpo mt-4" style={{ fontSize: 12 }}>La Zona se mueve con evidencia real: tu CBI de los días 45 y 90 y tus hitos verificados. Ver contenido no mueve la Zona. El cambio real, sí.</p>
      </div>

      {chequeos.length > 0 && (
        <div className="tarjeta p-5 mb-4">
          <p className="t-sub mb-1">Tu historia clínica</p>
          <p className="t-cuerpo mb-3" style={{ fontSize: 12 }}>Mismo instrumento, siempre. Por eso el número vale.</p>
          <div className="space-y-2.5">
            {chequeos.map((c, i) => {
              const z = zonaDesdeCbi(c.cbi.promedio);
              const prev = i > 0 ? chequeos[i - 1].cbi.promedio : null;
              const delta = prev === null ? null : c.cbi.promedio - prev;
              return (
                <div key={c.fecha} className="flex items-center gap-3">
                  <PuntoZona color={z.color} size={10} />
                  <div className="flex-1">
                    <p className="t-sub" style={{ fontSize: 14 }}>{i === 0 ? 'Punto de partida' : `Medición ${i + 1}`} <span className="t-micro ml-1" style={{ color: 'var(--texto-tenue)' }}>{new Date(c.fecha).toLocaleDateString('es')}</span></p>
                    <p className="t-cuerpo" style={{ fontSize: 12.5 }}>{z.nombre}</p>
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
        <button className="btn-secundario w-full" disabled={diaTrat < 45} onClick={irAlChequeo}>
          {diaTrat < HITO_MEDIO ? `Tu próxima medición oficial: día ${HITO_MEDIO} (faltan ${HITO_MEDIO - diaTrat})` : 'Hacer mi medición oficial'}
        </button>
      ) : (
        <button className="btn-secundario w-full" onClick={irAlChequeo}>Repetir mi Chequeo</button>
      )}
    </div>
  );
}
