/** LA PUERTA — la entrada. Quien llegó acá ya arregló su ingreso con la clínica: no se vende nada. */
import { useState } from 'react';
import { toast } from 'sonner';
import { KeyRound } from 'lucide-react';
import { validarCodigo } from '../lib/codigosFundador';
import { activarProtocolo, activarApaga, setNombre, getAcceso, puedeGuardar } from '../lib/estadoCdl';
import PulsoAmbiente from '../components/PulsoAmbiente';

export default function Puerta({ onActivado }: { onActivado: () => void }) {
  const [nombre, setNombreLocal] = useState('');
  const [codigo, setCodigo] = useState('');
  const [bloqueado, setBloqueado] = useState(false);

  function entrar() {
    const tier = validarCodigo(codigo);
    if (!tier) { toast.error('Ese código no lo reconozco. Revísalo con la clínica.'); return; }

    if (!puedeGuardar()) { setBloqueado(true); return; }

    if (nombre.trim().length > 1) setNombre(nombre);
    if (tier === 'apaga') activarApaga();
    else activarProtocolo(tier);

    // Verificamos que haya quedado guardado de verdad antes de avanzar.
    if (getAcceso() === 'ninguno') { setBloqueado(true); return; }

    toast.success(`Bienvenido${nombre.trim() ? ', ' + nombre.trim().split(' ')[0] : ''}.`);
    // Recargamos la app entera: así el acceso se relee desde cero y no dependemos
    // de que la pantalla se redibuje sola. Es la entrada, pasa una sola vez.
    setTimeout(() => {
      try { window.location.replace(window.location.pathname); }
      catch { onActivado(); }
    }, 700);
  }

  return (
    <div className="pantalla pt-16 lg:pt-24 pb-20">
      <PulsoAmbiente opacidad={0.4} />

      <p className="t-micro" style={{ color: 'var(--acento)' }}>La Clínica del Líder</p>
      <h1 className="t-display mt-4 mb-4">EL EJE</h1>
      <p className="t-cuerpo mb-3" style={{ fontSize: 21 }}>
        Ni desbordarte ni endurecerte. Sostenerte en el centro, que es donde se decide todo lo demás.
      </p>
      <p className="t-cuerpo mb-10">
        Doce semanas, medidas. Hoy no empieza el trabajo: hoy empieza la medición,
        que es lo que hace que todo lo demás se pueda comprobar.
      </p>

      <div className="tarjeta p-6">
        <p className="flex items-center gap-2 t-sub mb-5">
          <KeyRound size={17} color="var(--acento)" /> Tu acceso
        </p>

        <label className="t-micro block mb-2" style={{ color: 'var(--texto-tenue)' }}>¿Cómo quieres que te llame?</label>
        <input
          value={nombre}
          onChange={(e) => setNombreLocal(e.target.value)}
          placeholder="Tu nombre"
          className="w-full px-4 mb-5"
          style={{ minHeight: 56 }}
        />

        <label className="t-micro block mb-2" style={{ color: 'var(--texto-tenue)' }}>Tu código</label>
        <input
          value={codigo}
          onChange={(e) => setCodigo(e.target.value.toUpperCase())}
          placeholder="XXXXX-XXXX-XXXX"
          className="w-full px-4"
          style={{ minHeight: 56, letterSpacing: '0.06em', fontFamily: 'var(--font-display)' }}
          onKeyDown={(e) => { if (e.key === 'Enter') entrar(); }}
        />

        <button className="btn-primario w-full mt-6" onClick={entrar}>Entrar</button>

        {bloqueado && (
          <div className="mt-5 p-5" style={{ border: '1px solid var(--zona-roja)', borderRadius: 18 }}>
            <p className="t-sub mb-2">Tu navegador no nos deja guardar nada.</p>
            <p className="t-cuerpo" style={{ fontSize: 16 }}>
              Todo tu camino vive en este teléfono, así que sin permiso para guardar no podemos empezar.
              Suele pasar en modo incógnito o con los datos del sitio bloqueados. Abre este enlace en una
              ventana normal, o instala la app desde el menú del navegador, y vuelve a entrar.
            </p>
          </div>
        )}
      </div>

      <div className="mt-12 text-center">
        <p className="t-micro mb-3" style={{ color: 'var(--acento)' }}>Espejo · Jugada · Evidencia</p>
        <p className="t-cuerpo" style={{ fontSize: 16 }}>
          Te miras sin castigarte, haces un movimiento, y compruebas si pasó algo.
        </p>
        <p className="t-cuerpo mt-8" style={{ fontSize: 16 }}>
          La única clínica cuyo objetivo es darte el alta.
        </p>
      </div>
    </div>
  );
}
