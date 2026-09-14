/** El Diario del Líder — tus Signos Vitales diarios. 60 segundos. Gratis. */
import { useState } from 'react';
import { toast } from 'sonner';
import { Angry, Frown, Meh, Smile, Laugh, Flame, type LucideIcon } from 'lucide-react';
import { getEntradaHoy, guardarEntradaDiario, listarDiario, calcularRacha, hoyIso, type EntradaDiario } from '../lib/estadoCdl';
import { Stepper, Chips } from '../components/ui';

const ESTADOS: { Icono: LucideIcon; label: string }[] = [
  { Icono: Angry, label: 'Al límite' },
  { Icono: Frown, label: 'Pesado' },
  { Icono: Meh, label: 'Neutro' },
  { Icono: Smile, label: 'Bien' },
  { Icono: Laugh, label: 'Pleno' },
];

export default function DiarioLider() {
  const existente = getEntradaHoy();
  const [estado, setEstado] = useState(existente?.estado ?? 3);
  const [energia, setEnergia] = useState(existente?.energia ?? 3);
  const [horasSueno, setHorasSueno] = useState(existente?.horasSueno ?? 6);
  const [horasTrabajo, setHorasTrabajo] = useState(existente?.horasTrabajo ?? 8);
  const [nota, setNota] = useState(existente?.nota ?? '');
  const [, setVersion] = useState(0);

  const historial = listarDiario().slice().reverse().slice(0, 14);
  const racha = calcularRacha();
  const hoyHecho = Boolean(getEntradaHoy());

  function guardar() {
    const entrada: EntradaDiario = { fecha: hoyIso(), estado, energia, horasSueno, horasTrabajo, nota: nota.trim() };
    guardarEntradaDiario(entrada);
    setVersion((v) => v + 1);
    toast.success('Registrado. Tu racha sigue viva.');
  }

  const ultimos7 = listarDiario().slice(-7);
  const prom = (f: (e: EntradaDiario) => number) => ultimos7.length ? (ultimos7.reduce((a, e) => a + f(e), 0) / ultimos7.length) : 0;

  return (
    <div className="pantalla pt-6 pb-28">
      <p className="t-micro" style={{ color: 'var(--calido)' }}>El Diario del Líder</p>
      <h1 className="t-titulo mt-1 mb-1">Tus Signos Vitales de hoy</h1>
      <p className="t-cuerpo mb-2">60 segundos. Lo que se mide, mejora.</p>
      <p className="flex items-center gap-1.5 t-sub mb-5" style={{ color: racha > 0 && !hoyHecho ? 'var(--zona-naranja)' : 'var(--acento)' }}>
        <Flame size={16} />
        {racha > 0 && !hoyHecho
          ? `No rompas tu racha de ${racha} ${racha === 1 ? 'día' : 'días'} — registra hoy.`
          : `Racha: ${racha} ${racha === 1 ? 'día' : 'días'}.`}
      </p>

      <div className="tarjeta p-5 mb-5">
        <p className="t-sub mb-3">¿Cómo estás?</p>
        <div className="flex justify-between mb-5">
          {ESTADOS.map((e, i) => (
            <button key={i} onClick={() => setEstado(i + 1)}
              className="flex flex-col items-center gap-1 rounded-2xl px-2 py-2 transition"
              style={{
                background: estado === i + 1 ? 'var(--acento-tinte)' : 'transparent',
                color: estado === i + 1 ? 'var(--acento)' : 'var(--texto-tenue)',
                transform: estado === i + 1 ? 'scale(1.06)' : 'none',
                minWidth: 56,
              }}>
              <e.Icono size={26} strokeWidth={estado === i + 1 ? 2.2 : 1.7} />
              <span style={{ fontSize: 10, fontWeight: 700 }}>{e.label}</span>
            </button>
          ))}
        </div>
        <p className="t-sub mb-2">Energía</p>
        <Chips opciones={['1', '2', '3', '4', '5']} valor={String(energia)} onChange={(v) => setEnergia(Number(v))} />
        <div className="mt-4">
          <Stepper label="Horas de sueño anoche" valor={horasSueno} min={3} max={12} paso={0.5} onChange={setHorasSueno} />
          <Stepper label="Horas de trabajo hoy" valor={horasTrabajo} min={0} max={16} paso={0.5} onChange={setHorasTrabajo} />
        </div>
        <p className="t-sub mt-4 mb-2">Una línea honesta (opcional)</p>
        <textarea value={nota} onChange={(e) => setNota(e.target.value)} rows={2}
          placeholder="¿Qué te llevó energía hoy? ¿Qué te la devolvió?"
          className="w-full px-3 py-3 resize-none" style={{ fontSize: 15 }} />
        <button className="btn-primario w-full mt-4" onClick={guardar}>{existente ? 'Actualizar registro' : 'Registrar mis Signos Vitales'}</button>
      </div>

      {ultimos7.length >= 3 && (
        <div className="tarjeta p-4 mb-5">
          <p className="t-micro mb-2" style={{ color: 'var(--calido)' }}>Tus últimos 7 días</p>
          <p className="t-cuerpo">
            Sueño: <b>{prom((e) => e.horasSueno).toFixed(1)} hs</b> · Trabajo: <b>{prom((e) => e.horasTrabajo).toFixed(1)} hs/día</b> · Energía: <b>{prom((e) => e.energia).toFixed(1)}/5</b>
          </p>
        </div>
      )}

      {historial.length > 0 && (
        <div className="space-y-2">
          <p className="t-micro" style={{ color: 'var(--texto-tenue)' }}>Historial</p>
          {historial.map((e) => {
            const E = ESTADOS[e.estado - 1].Icono;
            return (
              <div key={e.fecha} className="tarjeta px-4 py-3 flex items-center justify-between gap-3">
                <div className="flex items-start gap-3">
                  <E size={20} color="var(--texto-suave)" className="mt-0.5" />
                  <div>
                    <p className="t-sub">{e.fecha}</p>
                    {e.nota && <p className="t-cuerpo" style={{ fontSize: 13 }}>{e.nota}</p>}
                  </div>
                </div>
                <p className="t-micro text-right flex-none" style={{ color: 'var(--texto-tenue)' }}>{e.horasSueno}h sueño<br />{e.horasTrabajo}h trabajo</p>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
