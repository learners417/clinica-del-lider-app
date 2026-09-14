/** LA PUERTA — lo único que ve quien no compró. La clínica se explica, el $33 se ofrece, el código activa. */
import { useState } from 'react';
import { toast } from 'sonner';
import { Clock3, ShieldCheck, FileCheck2, KeyRound, Smartphone, Stethoscope, FlaskConical } from 'lucide-react';
import PulsoAmbiente from '../components/PulsoAmbiente';
import { validarCodigo } from '../lib/codigosFundador';
import { activarApaga, activarProtocolo } from '../lib/estadoCdl';
import { LINK_PAGO_33, PRECIO_APAGA } from '../data/config';

export default function Puerta({ onActivado }: { onActivado: () => void }) {
  const [codigo, setCodigo] = useState('');

  function comprar() {
    if (LINK_PAGO_33) { window.open(LINK_PAGO_33, '_blank'); return; }
    toast('Los cupos se abren muy pronto. Si ya arreglaste tu ingreso con la clínica, activa con tu código aquí abajo.');
  }

  function activar() {
    const tier = validarCodigo(codigo);
    if (!tier) { toast.error('Código no reconocido. Revísalo con la clínica.'); return; }
    if (tier === 'apaga') activarApaga();
    else activarProtocolo(tier);
    toast.success('Acceso activado. Bienvenido a la clínica.');
    onActivado();
  }

  return (
    <div className="pantalla pt-8 lg:pt-14 pb-16">
      <PulsoAmbiente opacidad={0.5} />
      <p className="t-micro mt-6" style={{ color: 'var(--calido)' }}>La Clínica del Líder</p>
      <h1 className="t-display mt-3 mb-3">La cabeza no te para. Empecemos por ahí.</h1>
      <p className="t-cuerpo mb-5">
        Esta es una <b>clínica digital</b>: vive en una app en tu teléfono, con un equipo clínico real detrás.
        No es un hospital. Y yo no soy médico — soy el fundador y el paciente cero.
      </p>
      <p className="t-cuerpo mb-6">
        Trabaja con una sola promesa, medida: tu Índice sube 25 puntos en doce semanas, por contrato.
        <b> Duermes. Vuelves a tu casa. Vuelves a ti.</b>
      </p>

      <div className="tarjeta p-6 mb-5" style={{ borderColor: 'var(--acento)', borderWidth: 2 }}>
        <p className="t-micro" style={{ color: 'var(--acento)' }}>La puerta de entrada</p>
        <h2 className="t-titulo mt-1">APAGA LA CABEZA</h2>
        <p className="t-cuerpo mt-2 mb-4">
          El protocolo de 5 noches: tu agotamiento medido con un instrumento clínico + una consigna por noche
          para que la cabeza aprenda a apagarse + el workshop EN VIVO incluido.
        </p>
        <div className="flex items-baseline gap-3 mb-4">
          <span className="t-display">${PRECIO_APAGA}</span>
          <span className="t-cuerpo" style={{ fontSize: 13 }}>pago único</span>
        </div>
        <button className="btn-primario w-full" onClick={comprar}>Quiero apagar la cabeza</button>
        <p className="t-cuerpo mt-3" style={{ fontSize: 12 }}>
          Garantía: haces las 5 noches, vienes al vivo, y si no notaste diferencia — repites con la próxima camada, gratis.
        </p>
      </div>

      <div className="tarjeta p-5 mb-5">
        <p className="t-micro mb-3" style={{ color: 'var(--calido)' }}>Cómo funciona</p>
        <div className="space-y-3">
          <div className="flex items-start gap-3"><span className="t-dato flex-none" style={{ color: 'var(--acento)', width: 22 }}>1</span><p className="t-cuerpo"><b>Esta noche te mides.</b> El Chequeo: 7 minutos, instrumentos clínicos validados. Sales con tu número.</p></div>
          <div className="flex items-start gap-3"><span className="t-dato flex-none" style={{ color: 'var(--acento)', width: 22 }}>2</span><p className="t-cuerpo"><b>Una consigna por noche, 4 noches.</b> 10 minutos cada una. Tu cabeza aprende a apagarse mientras duermes distinto.</p></div>
          <div className="flex items-start gap-3"><span className="t-dato flex-none" style={{ color: 'var(--acento)', width: 22 }}>3</span><p className="t-cuerpo"><b>El vivo.</b> 2 horas conmigo, sobre TUS números. Te muestro el mapa completo de las doce semanas — y decides.</p></div>
        </div>
      </div>

      <div className="flex flex-wrap gap-x-5 gap-y-2 mb-6">
        <span className="flex items-center gap-1.5 t-micro" style={{ color: 'var(--texto-suave)' }}><FlaskConical size={13} /> Instrumentos validados</span>
        <span className="flex items-center gap-1.5 t-micro" style={{ color: 'var(--texto-suave)' }}><Smartphone size={13} /> Vive en tu teléfono</span>
        <span className="flex items-center gap-1.5 t-micro" style={{ color: 'var(--texto-suave)' }}><Stethoscope size={13} /> Equipo clínico real</span>
        <span className="flex items-center gap-1.5 t-micro" style={{ color: 'var(--texto-suave)' }}><ShieldCheck size={13} /> Sin humo</span>
        <span className="flex items-center gap-1.5 t-micro" style={{ color: 'var(--texto-suave)' }}><Clock3 size={13} /> 10-20 min por día</span>
        <span className="flex items-center gap-1.5 t-micro" style={{ color: 'var(--texto-suave)' }}><FileCheck2 size={13} /> Todo se mide</span>
      </div>

      <div className="tarjeta p-5">
        <p className="flex items-center gap-2 t-sub mb-2"><KeyRound size={16} color="var(--acento)" /> ¿Tienes un código?</p>
        <p className="t-cuerpo mb-3" style={{ fontSize: 13 }}>Si ya compraste o arreglaste tu ingreso con la clínica, actívalo aquí.</p>
        <div className="flex gap-2">
          <input
            value={codigo}
            onChange={(e) => setCodigo(e.target.value.toUpperCase())}
            placeholder="APAGA-XXXX-XXXX"
            className="flex-1 px-3"
            style={{ minHeight: 50, fontFamily: 'var(--font-display)', letterSpacing: '0.04em' }}
          />
          <button className="btn-primario" style={{ minHeight: 50, padding: '0 18px' }} onClick={activar}>Activar</button>
        </div>
      </div>

      <p className="t-cuerpo text-center mt-8" style={{ fontSize: 12 }}>
        La única clínica cuyo objetivo es darte el alta.
      </p>
    </div>
  );
}
