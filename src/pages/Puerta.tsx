/** LA PUERTA — la entrada. Quien llegó acá ya arregló su ingreso con la clínica: no se vende nada. */
import { useState } from 'react';
import { toast } from 'sonner';
import { KeyRound } from 'lucide-react';
import { validarCodigo } from '../lib/codigosFundador';
import { activarProtocolo, activarApaga, setNombre } from '../lib/estadoCdl';
import PulsoAmbiente from '../components/PulsoAmbiente';

export default function Puerta({ onActivado }: { onActivado: () => void }) {
  const [nombre, setNombreLocal] = useState('');
  const [codigo, setCodigo] = useState('');

  function entrar() {
    const tier = validarCodigo(codigo);
    if (!tier) { toast.error('Ese código no lo reconozco. Revísalo con la clínica.'); return; }
    if (nombre.trim().length > 1) setNombre(nombre);
    if (tier === 'apaga') activarApaga();
    else activarProtocolo(tier);
    toast.success(`Bienvenido${nombre.trim() ? ', ' + nombre.trim().split(' ')[0] : ''}.`);
    onActivado();
  }

  return (
    <div className="pantalla pt-16 lg:pt-24 pb-20">
      <PulsoAmbiente opacidad={0.4} />

      <p className="t-micro" style={{ color: 'var(--acento)' }}>La Clínica del Líder</p>
      <h1 className="t-display mt-4 mb-5">Empecemos por saber dónde estás.</h1>
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
      </div>

      <p className="t-cuerpo text-center mt-10" style={{ fontSize: 15 }}>
        La única clínica cuyo objetivo es darte el alta.
      </p>
    </div>
  );
}
