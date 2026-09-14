/** LA CEREMONIA DE LA MEDICIÓN — D0 → hoy en pantalla completa: números, Zona, y la puerta que toque. */
import { useEffect } from 'react';
import { zonaDesdeCbi } from '../data/zonas';
import { vibrar, LATIDO_HITO } from '../lib/haptics';
import { PuntoZona } from './ui';
import CertificadoAlta from './CertificadoAlta';
import { Mensaje90Reveal } from './Mensaje90';
import { listarChequeos, getProtocolo, diaDelProtocolo, getNombre, hoyIso, abrirMensaje90, getMensaje90 } from '../lib/estadoCdl';

export default function CeremoniaMedicion({ onCerrar }: { onCerrar: () => void }) {
  const chequeos = listarChequeos();
  const hayComparacion = chequeos.length >= 2;
  useEffect(() => { if (hayComparacion) vibrar(LATIDO_HITO); }, [hayComparacion]);
  const protocolo = getProtocolo();
  if (chequeos.length < 2 || !protocolo) {
    // Sin línea de base no hay comparación: cierre simple
    return (
      <div className="tarjeta p-5 text-left">
        <p className="t-sub mb-2">Medición registrada.</p>
        <button className="btn-primario w-full" onClick={onCerrar}>Volver a Hoy</button>
      </div>
    );
  }

  const base = chequeos[0];
  const actual = chequeos[chequeos.length - 1];
  const zBase = zonaDesdeCbi(base.cbi.promedio);
  const zActual = zonaDesdeCbi(actual.cbi.promedio);
  const delta = actual.cbi.promedio - base.cbi.promedio;
  const dia = Math.min(diaDelProtocolo(protocolo), 90);
  const esContrato = dia >= 85;
  const cambioZona = zActual.nombre !== zBase.nombre;
  const fueraDeRoja = zActual.nombre !== 'Zona Roja';
  const esAlta = esContrato && fueraDeRoja;

  return (
    <div className="text-left">
      <p className="t-micro text-center mb-6" style={{ color: 'var(--calido)' }}>
        {esContrato ? 'LA MEDICIÓN DEL CONTRATO · DÍA 90' : `LA MEDICIÓN DEL DÍA ${dia}`}
      </p>

      {/* Los dos números, frente a frente */}
      <div className="tarjeta p-6 mb-4">
        <div className="grid grid-cols-2 gap-4 text-center">
          <div>
            <p className="t-micro mb-2" style={{ color: 'var(--texto-tenue)' }}>Día 0</p>
            <p className="t-display" style={{ fontSize: 52, color: zBase.color }}>{base.cbi.promedio}</p>
            <p className="flex items-center justify-center gap-1.5 t-micro mt-1" style={{ color: 'var(--texto-suave)' }}>
              <PuntoZona color={zBase.color} size={8} /> {zBase.nombre}
            </p>
          </div>
          <div>
            <p className="t-micro mb-2" style={{ color: 'var(--texto-tenue)' }}>Hoy</p>
            <p className="t-display reveal-zona" style={{ fontSize: 52, color: zActual.color }}>{actual.cbi.promedio}</p>
            <p className="flex items-center justify-center gap-1.5 t-micro mt-1" style={{ color: 'var(--texto-suave)' }}>
              <PuntoZona color={zActual.color} size={8} /> {zActual.nombre}
            </p>
          </div>
        </div>
        <div className="flex justify-center mt-5">
          <span className="t-sub rounded-full px-4 py-2" style={{
            background: delta < 0 ? 'var(--acento-tinte)' : 'rgba(228,87,76,.14)',
            color: delta < 0 ? 'var(--acento)' : 'var(--zona-roja)',
          }}>
            {delta < 0 ? '▼' : delta > 0 ? '▲' : '='} {Math.abs(delta)} puntos {delta < 0 ? 'menos' : delta > 0 ? 'más' : ''}
          </span>
        </div>
      </div>

      {/* El cambio de Zona, celebrado en serio */}
      {cambioZona && delta < 0 && (
        <div className="tarjeta p-5 mb-4 text-center reveal-zona" style={{ borderColor: zActual.color, borderWidth: 2 }}>
          <p className="t-titulo" style={{ color: zActual.color }}>Saliste de la {zBase.nombre}.</p>
          <p className="t-cuerpo mt-1">Ningún gráfico te lo regaló: son tus días, uno por uno, medidos.</p>
        </div>
      )}

      {/* Las puertas del día 84 — las dos son dignas */}
      {esAlta && (
        <div className="mb-4">
          <p className="voz-maestro text-center mb-4">"El que responde hoy no es el que respondió el Día 0."</p>
          {(() => { abrirMensaje90(); return getMensaje90() ? <Mensaje90Reveal /> : null; })()}
          <CertificadoAlta nombre={getNombre()} cbiInicial={base.cbi.promedio} cbiFinal={actual.cbi.promedio} fecha={hoyIso()} />
        </div>
      )}
      {esContrato && !fueraDeRoja && (
        <div className="tarjeta p-5 mb-4" style={{ borderColor: 'var(--calido)' }}>
          <p className="t-sub mb-2">El número dice que falta. El contrato habla.</p>
          <p className="t-cuerpo">Seguimos trabajando, sin costo, hasta lograrlo — porque esto era por contrato, no por marketing. La clínica te va a escribir esta semana para armar tu extensión.</p>
        </div>
      )}
      {!esContrato && delta >= 0 && (
        <div className="tarjeta p-5 mb-4">
          <p className="t-cuerpo">El número no bajó — y verlo es exactamente para lo que sirve medir. Es la información que tu segunda mitad necesita: revísalo con el Clínico, y si eres Acompañado, tu clínico lo lee esta semana.</p>
        </div>
      )}

      <button className="btn-primario w-full" onClick={onCerrar}>{esAlta ? 'Volver a mi clínica' : 'Seguir con mi Tratamiento'}</button>
    </div>
  );
}
