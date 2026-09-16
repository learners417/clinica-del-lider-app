/** HOY — la pantalla diaria: arriba tu Noche o tu Dosis, abajo tus Signos Vitales. Un solo ritual. */
import { useState } from 'react';
import { toast } from 'sonner';
import { Angry, Frown, Meh, Smile, Laugh, Flame, Moon, Pill, ChevronRight, Stethoscope, type LucideIcon , Layers} from 'lucide-react';
import {
  getAcceso, getApaga, proximaNoche, nocheDeHoyHecha, getProtocolo, proximaDosis, diaDelProtocolo,
  getEntradaHoy, guardarEntradaDiario, listarDiario, calcularRacha, hoyIso, getUltimoChequeo,
  type EntradaDiario, type PaginaId,
} from '../lib/estadoCdl';
import { faseDeDia, TOTAL_DIAS } from '../data/protocolo';
import { Stepper, Chips } from '../components/ui';
import ZonaBadge from '../components/ZonaBadge';
import InformeSemanal from '../components/InformeSemanal';
import { Mensaje90Tarjeta } from '../components/Mensaje90';
import BannerMedicion from '../components/BannerMedicion';
import { vibrar } from '../lib/haptics';
import { zonaDesdeCbi } from '../data/zonas';

const ESTADOS: { Icono: LucideIcon; label: string }[] = [
  { Icono: Angry, label: 'Al límite' },
  { Icono: Frown, label: 'Pesado' },
  { Icono: Meh, label: 'Neutro' },
  { Icono: Smile, label: 'Bien' },
  { Icono: Laugh, label: 'Pleno' },
];

export default function Hoy({ navegar }: { navegar: (p: PaginaId) => void }) {
  const acceso = getAcceso();
  const apaga = getApaga();
  const protocolo = getProtocolo();
  const chequeo = getUltimoChequeo();

  const existente = getEntradaHoy();
  const [estado, setEstado] = useState(existente?.estado ?? 3);
  const [energia, setEnergia] = useState(existente?.energia ?? 3);
  const [horasSueno, setHorasSueno] = useState(existente?.horasSueno ?? 6);
  const [horasTrabajo, setHorasTrabajo] = useState(existente?.horasTrabajo ?? 8);
  const [nota, setNota] = useState(existente?.nota ?? '');
  const [editando, setEditando] = useState(false);
  const [, setVersion] = useState(0);

  const racha = calcularRacha();
  const hoyHecho = Boolean(existente);

  function guardarSignos() {
    const entrada: EntradaDiario = { fecha: hoyIso(), estado, energia, horasSueno, horasTrabajo, nota: nota.trim() };
    guardarEntradaDiario(entrada);
    vibrar(10);
    setEditando(false);
    setVersion((v) => v + 1);
    toast.success('Registrado. Tu racha sigue viva.');
  }

  const ultimos7 = listarDiario().slice(-7);
  const prom = (f: (e: EntradaDiario) => number) => ultimos7.length ? (ultimos7.reduce((a, e) => a + f(e), 0) / ultimos7.length) : 0;

  // Sin Chequeo no hay punto de partida: el camino empieza ahí y no en la Dosis 1.
  if (!chequeo) {
    return (
      <div className="pantalla pt-10 pb-28 pagina-anim">
        <p className="t-micro" style={{ color: 'var(--acento)' }}>Antes de empezar</p>
        <h1 className="t-display mt-3 mb-4">Tu punto de partida.</h1>
        <p className="t-cuerpo mb-3">
          El camino son doce semanas medidas, y para medir hace falta saber de dónde partes.
          Eso es el Chequeo: diez medidas, tu carga, tu cuerpo y cinco preguntas que solo respondes tú.
        </p>
        <p className="t-cuerpo mb-7">
          Toma unos veinte minutos y se hace una sola vez. Puedes cortar por la mitad y seguir después:
          queda guardado donde lo dejaste.
        </p>
        <button className="btn-primario w-full" onClick={() => navegar('chequeo')}>Hacer mi Chequeo</button>
      </div>
    );
  }

  return (
    <div className="pantalla pt-6 pb-28">
      <div className="flex items-center justify-between mb-4">
        <div>
          <p className="t-micro" style={{ color: 'var(--calido)' }}>Hoy</p>
          <h1 className="t-titulo">{saludo()}</h1>
        </div>
        {chequeo && <ZonaBadge zona={zonaDesdeCbi(chequeo.cbi.promedio)} />}
      </div>

      {/* ── ARRIBA: tu paso de hoy según acceso ── */}
      {acceso === 'apaga' && apaga && (() => {
        const n = proximaNoche(apaga);
        const listo = apaga.nochesHechas.length >= 5;
        const hoyLista = !listo && nocheDeHoyHecha(apaga);
        return (
          <button className="tarjeta tarjeta-hover w-full text-left p-5 mb-4" style={{ borderColor: 'var(--hairline-acento)' }} onClick={() => navegar('noche')}>
            <div className="flex items-center gap-3">
              <span className="grid place-items-center rounded-2xl flex-none" style={{ width: 46, height: 46, background: 'var(--acento-tinte)' }}>
                <Moon size={21} color="var(--acento)" />
              </span>
              <div className="flex-1">
                <p className="t-micro" style={{ color: 'var(--acento)' }}>Apaga la Cabeza · {apaga.nochesHechas.length} de 5</p>
                <p className="t-sub mt-0.5" style={{ fontSize: 16 }}>
                  {listo ? 'Las 5 noches: hechas. Nos vemos en el vivo.' : hoyLista ? 'Noche hecha. La próxima es mañana.' : `Esta noche: la Noche ${n}`}
                </p>
              </div>
              <ChevronRight size={18} color="var(--texto-tenue)" className="flex-none" />
            </div>
          </button>
        );
      })()}

      {(acceso === 'solo' || acceso === 'acompanado') && protocolo && (() => {
        const dia = Math.min(diaDelProtocolo(protocolo), TOTAL_DIAS);
        const prox = proximaDosis(protocolo);
        const fase = faseDeDia(dia);
        const completo = protocolo.dosisHechas.length >= TOTAL_DIAS;
        const alDia = prox > dia;
        return (
          <button className="tarjeta tarjeta-hover w-full text-left p-5 mb-4" style={{ borderColor: 'var(--hairline-acento)' }} onClick={() => navegar(completo ? 'tratamiento' : 'dosis')}>
            <div className="flex items-center gap-3">
              <span className="grid place-items-center rounded-2xl flex-none" style={{ width: 46, height: 46, background: 'var(--acento-tinte)' }}>
                <Pill size={21} color="var(--acento)" />
              </span>
              <div className="flex-1">
                <p className="t-micro" style={{ color: 'var(--acento)' }}>El Tratamiento · Fase {fase.id} · Día {dia} de {TOTAL_DIAS}</p>
                <p className="t-sub mt-0.5" style={{ fontSize: 16 }}>{completo ? 'Tratamiento completo. Tu día 85 te espera.' : alDia ? 'Dosis de hoy: hecha. Mañana sigue.' : 'Tu Dosis de hoy te espera'}</p>
              </div>
              <ChevronRight size={18} color="var(--texto-tenue)" className="flex-none" />
            </div>
          </button>
        );
      })()}

      {racha > 0 && !hoyHecho && (
        <div className="tarjeta p-4 mb-4 flex items-center gap-3" style={{ borderColor: 'var(--zona-naranja)' }}>
          <Flame size={20} color="var(--zona-naranja)" className="flex-none" />
          <p className="t-sub">No rompas tu racha de {racha} {racha === 1 ? 'día' : 'días'} — registra tus Signos abajo.</p>
        </div>
      )}

      {/* ── ABAJO: los Signos Vitales, siempre ── */}
      {hoyHecho && !editando ? (
        <div className="tarjeta p-5 mb-4">
          <div className="flex items-center justify-between mb-2">
            <p className="t-sub">Signos de hoy: registrados</p>
            <p className="flex items-center gap-1 t-micro" style={{ color: 'var(--acento)' }}><Flame size={12} /> {racha}</p>
          </div>
          <p className="t-cuerpo">
            {ESTADOS[(existente!.estado) - 1].label} · energía {existente!.energia}/5 · {existente!.horasSueno} hs de sueño · {existente!.horasTrabajo} hs de trabajo
          </p>
          {existente!.nota && <p className="t-cuerpo mt-2" style={{ fontSize: 16, fontStyle: 'italic' }}>"{existente!.nota}"</p>}
          <button className="btn-fantasma pl-0 mt-2" onClick={() => setEditando(true)}>Editar el registro de hoy</button>
        </div>
      ) : (
      <div className="tarjeta p-5 mb-4">
        <div className="flex items-center justify-between mb-3">
          <p className="t-sub">Tus Signos Vitales</p>
          <p className="flex items-center gap-1 t-micro" style={{ color: 'var(--acento)' }}><Flame size={12} /> {racha}</p>
        </div>
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
              <span style={{ fontSize: 16, fontWeight: 700 }}>{e.label}</span>
            </button>
          ))}
        </div>
        <p className="t-sub mb-2">Energía</p>
        <Chips opciones={['1', '2', '3', '4', '5']} valor={String(energia)} onChange={(v) => setEnergia(Number(v))} />
        <div className="mt-4">
          <Stepper label="Horas de sueño anoche" valor={horasSueno} min={3} max={12} paso={0.5} onChange={setHorasSueno} />
          <Stepper label="Horas de trabajo hoy" valor={horasTrabajo} min={0} max={16} paso={0.5} onChange={setHorasTrabajo} />
        </div>
        <p className="t-sub mt-4 mb-2">Una línea honesta <span className="t-micro" style={{ color: 'var(--texto-tenue)' }}>· tu bitácora</span></p>
        <textarea value={nota} onChange={(e) => setNota(e.target.value)} rows={2}
          placeholder="¿Qué te llevó energía hoy? ¿Qué te la devolvió?"
          className="w-full px-3 py-3 resize-none" style={{ fontSize: 16 }} />
        <button className="btn-primario w-full mt-4" onClick={guardarSignos}>{existente ? 'Actualizar registro' : 'Registrar mis Signos'}</button>
      </div>
      )}

      {ultimos7.length >= 3 && (
        <div className="tarjeta p-4 mb-4">
          <p className="t-micro mb-2" style={{ color: 'var(--calido)' }}>Tus últimos 7 días</p>
          <p className="t-cuerpo">
            Sueño: <b>{prom((e) => e.horasSueno).toFixed(1)} hs</b> · Trabajo: <b>{prom((e) => e.horasTrabajo).toFixed(1)} hs/día</b> · Energía: <b>{prom((e) => e.energia).toFixed(1)}/5</b>
          </p>
        </div>
      )}

      <BannerMedicion navegar={navegar} />

      <Mensaje90Tarjeta />

      <InformeSemanal />

      <button className="tarjeta tarjeta-hover w-full text-left p-4 flex items-center gap-3 mb-3" onClick={() => navegar('iceberg')}>
        <Layers size={19} color="var(--acento)" className="flex-none" />
        <span className="t-sub">Trabajar un bloqueo · El Iceberg</span>
        <ChevronRight size={17} className="ml-auto flex-none" color="var(--texto-tenue)" />
      </button>

      <button className="tarjeta tarjeta-hover w-full text-left p-4 flex items-center gap-3" onClick={() => navegar('clinico')}>
        <Stethoscope size={19} color="var(--acento)" className="flex-none" />
        <span className="t-sub">Hablar con el Clínico</span>
        <ChevronRight size={17} className="ml-auto flex-none" color="var(--texto-tenue)" />
      </button>
    </div>
  );
}

function saludo(): string {
  const h = new Date().getHours();
  if (h < 5) return 'Madrugada. Estamos aquí.';
  if (h < 13) return 'Buen día.';
  if (h < 20) return 'Buenas tardes.';
  return 'Buenas noches.';
}
