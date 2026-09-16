/** La Noche — la consigna nocturna de APAGA LA CABEZA. Señal → Acción → hecha. */
import { useEffect, useState } from 'react';
import { CheckCircle2, ArrowRight, Stethoscope } from 'lucide-react';
import { NOCHES } from '../data/apaga';
import { AudioJavo } from '../components/Contenido';
import { vibrar, LATIDO_HECHO } from '../lib/haptics';
import { getApaga, proximaNoche, marcarNocheHecha, nocheDeHoyHecha, getUltimoChequeo, type PaginaId } from '../lib/estadoCdl';

export default function NochePage({ navegar }: { navegar: (p: PaginaId) => void }) {
  const apaga = getApaga();
  const [hecha, setHecha] = useState(false);
  useEffect(() => { if (!apaga) navegar('hoy'); }, [apaga]);
  if (!apaga) return null;

  const n = proximaNoche(apaga);
  const noche = NOCHES[n - 1];
  const chequeoHecho = Boolean(getUltimoChequeo());
  const todasHechas = apaga.nochesHechas.length >= 5;

  // Una noche por día: si la de hoy ya está, la próxima es MAÑANA a la noche
  if (!todasHechas && !hecha && nocheDeHoyHecha(apaga)) {
    return (
      <div className="pantalla pt-10 pb-28 text-center">
        <CheckCircle2 size={44} color="var(--acento)" className="mx-auto mb-4" />
        <h1 className="t-titulo mb-2">Por esta noche, listo.</h1>
        <p className="t-cuerpo mb-6">La Noche {n} es mañana a la noche. Esto no se maratonea: cada noche trabaja mientras duermes.</p>
        <button className="btn-primario w-full" onClick={() => navegar('hoy')}>Volver a Hoy</button>
      </div>
    );
  }

  if (todasHechas && !hecha) {
    return (
      <div className="pantalla pt-10 pb-28 text-center">
        <CheckCircle2 size={44} color="var(--acento)" className="mx-auto mb-4" />
        <h1 className="t-titulo mb-2">Las 5 noches: hechas.</h1>
        <p className="t-cuerpo mb-6">Llegas al vivo con tu número en la mano y noches distintas en el cuerpo. Ahí te muestro el mapa completo de las doce semanas.</p>
        <button className="btn-primario w-full" onClick={() => navegar('tratamiento')}>Ver el Tratamiento completo</button>
        <button className="btn-fantasma w-full mt-2" onClick={() => navegar('hoy')}>Volver a Hoy</button>
      </div>
    );
  }

  if (hecha) {
    return (
      <div className="pantalla pt-10 pb-28 text-center">
        <CheckCircle2 size={44} color="var(--acento)" className="mx-auto mb-4 reveal-zona" />
        <h1 className="t-titulo mb-2">Noche {n}: hecha.</h1>
        <p className="t-cuerpo mb-6">Registra tus Signos antes de dormir — el sueño de esta noche es el dato de mañana.</p>
        <button className="btn-primario w-full" onClick={() => navegar('hoy')}>Cerrar con mis Signos</button>
      </div>
    );
  }

  return (
    <div className="pantalla pt-6 pb-28">
      <button className="btn-fantasma pl-0" onClick={() => navegar('hoy')}>‹ Salir</button>
      <p className="t-micro mt-2" style={{ color: 'var(--acento)' }}>Apaga la Cabeza · Noche {n} de 5</p>
      <div className="flex gap-2 mt-3" aria-hidden>
        {[1, 2, 3, 4, 5].map((i) => (
          <span key={i} className="rounded-full" style={{
            width: i === n ? 22 : 8, height: 8, transition: 'width .3s ease',
            background: apaga.nochesHechas.includes(i) ? 'var(--acento)' : i === n ? 'var(--hairline-acento)' : 'rgba(238,244,240,.14)',
          }} />
        ))}
      </div>
      <h1 className="t-display mt-2 mb-5">{noche.titulo}</h1>

      <div className="tarjeta p-5 mb-4">
        <p className="t-micro mb-2" style={{ color: 'var(--calido)' }}>El Espejo</p>
        <p className="t-cuerpo" style={{ fontSize: 16 }}>{noche.senal}</p>
      </div>

      <div className="tarjeta p-5 mb-6" style={{ borderColor: 'var(--hairline-acento)' }}>
        <p className="t-micro mb-2" style={{ color: 'var(--acento)' }}>Esta noche</p>
        <p className="t-sub" style={{ fontSize: 16, lineHeight: '24px' }}>{noche.accion}</p>
      </div>

      <AudioJavo id="apagado" titulo="El Apagado" />
      {noche.esChequeo && !chequeoHecho && (
        <button className="btn-primario w-full mb-3" onClick={() => navegar('chequeo')}>Hacer mi Chequeo (7 min)</button>
      )}
      <button
        className={noche.esChequeo && !chequeoHecho ? 'btn-secundario w-full' : 'btn-primario w-full'}
        disabled={Boolean(noche.esChequeo && !chequeoHecho)}
        onClick={() => { marcarNocheHecha(n); vibrar(LATIDO_HECHO); setHecha(true); }}
      >
        <span className="flex items-center justify-center gap-2">{noche.esChequeo && !chequeoHecho ? 'Primero el Chequeo' : 'Hecha'} <ArrowRight size={18} /></span>
      </button>
      <button className="btn-fantasma w-full mt-2 flex items-center justify-center gap-2" onClick={() => navegar('clinico')}>
        <Stethoscope size={15} /> Pregúntale al Clínico sobre esta Noche
      </button>
      <p className="t-cuerpo mt-2 text-center" style={{ fontSize: 16 }}>Si esta noche no puedes, la Noche te espera. El protocolo no castiga — mide.</p>
    </div>
  );
}
