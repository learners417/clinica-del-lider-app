/** Tu semana, leída — el Clínico analiza tus 7 días de Signos y escribe la lectura. */
import { useState } from 'react';
import { toast } from 'sonner';
import { FileHeart } from 'lucide-react';
import { generarTexto } from '../lib/clinicoApi';
import {
  getProtocolo, diaDelProtocolo, registrosUltimos7, listarDiario,
  puedeGenerarInforme, guardarInforme, ultimoInforme, getUltimoChequeo,
} from '../lib/estadoCdl';
import { faseDeDia } from '../data/protocolo';
import { zonaDesdeCbi } from '../data/zonas';

function sistemaInforme(): string {
  return `Eres EL CLÍNICO de La Clínica del Líder. Escribes el INFORME SEMANAL del paciente: la lectura sobria de sus últimos 7 días de Signos Vitales.

FORMATO EXACTO: 3 párrafos cortos, máximo 150 palabras en total, castellano neutro (tú), sin emojis, sin listas, sin saludo ni despedida.
1) Los números de la semana y LA correlación más importante que ves (una sola).
2) Una observación honesta — incluye lo que empeoró si empeoró; nada de porrismo.
3) UN ajuste concreto para la semana que viene, ligado a la fase actual del Tratamiento. Uno solo.

LÍMITES: no diagnosticas, no usas jerga clínica, no inventas datos que no estén en la tabla. Si las líneas del paciente muestran señales de crisis o desesperanza profunda, tu ajuste único es hablar esta semana con un profesional de salud mental, dicho con calidez.`;
}

export default function InformeSemanal() {
  const [cargando, setCargando] = useState(false);
  const [, setV] = useState(0);
  const protocolo = getProtocolo();
  if (!protocolo) return null;

  const informe = ultimoInforme();
  const puede = puedeGenerarInforme();
  const registros = registrosUltimos7();
  if (!informe && !puede && registros.length < 3) return null;

  async function generar() {
    if (cargando) return;
    setCargando(true);
    try {
      const p = getProtocolo()!;
      const dia = Math.min(diaDelProtocolo(p), 90);
      const fase = faseDeDia(dia);
      const ch = getUltimoChequeo();
      const semana = registrosUltimos7();
      const previos = listarDiario().slice(-14, -7);
      const prom = (arr: typeof semana, f: (e: (typeof semana)[0]) => number) =>
        arr.length ? (arr.reduce((a, e) => a + f(e), 0) / arr.length).toFixed(1) : '—';
      const tabla = semana.map((e) =>
        `${e.fecha}: estado ${e.estado}/5 · energía ${e.energia}/5 · sueño ${e.horasSueno}h · trabajo ${e.horasTrabajo}h${e.nota ? ` · "${e.nota}"` : ''}`
      ).join('\n');
      const datos = `PACIENTE: Día ${dia} del Tratamiento, Fase ${fase.id} (${fase.nombre}).${ch ? ` Zona ${zonaDesdeCbi(ch.cbi.promedio).nombre} (CBI ${ch.cbi.promedio}).` : ''}
SEMANA (${semana.length} registros):
${tabla}
PROMEDIOS de la semana: sueño ${prom(semana, (e) => e.horasSueno)}h · energía ${prom(semana, (e) => e.energia)}/5 · trabajo ${prom(semana, (e) => e.horasTrabajo)}h.
SEMANA ANTERIOR (referencia): sueño ${prom(previos, (e) => e.horasSueno)}h · energía ${prom(previos, (e) => e.energia)}/5 · trabajo ${prom(previos, (e) => e.horasTrabajo)}h.
Escribe el informe.`;
      const texto = await generarTexto(sistemaInforme(), [{ role: 'user', content: datos }]);
      if (!texto) throw new Error('vacío');
      guardarInforme(texto);
      setV((v) => v + 1);
    } catch {
      toast.error('El Clínico no pudo leer tu semana ahora (¿la clínica ya cargó sus llaves?). Intenta más tarde.');
    } finally {
      setCargando(false);
    }
  }

  return (
    <div className="tarjeta p-5 mb-4">
      <p className="flex items-center gap-2 t-sub mb-1"><FileHeart size={17} color="var(--calido)" /> Tu semana, leída</p>
      {informe && !puede ? (
        <>
          <p className="t-micro mb-3" style={{ color: 'var(--texto-tenue)' }}>El Clínico · {new Date(informe.fecha + 'T12:00:00').toLocaleDateString('es')} · basado en tus Signos</p>
          <p className="t-cuerpo" style={{ whiteSpace: 'pre-wrap', fontSize: 16 }}>{informe.texto}</p>
          <p className="t-micro mt-3" style={{ color: 'var(--texto-tenue)' }}>Tu próxima lectura: cuando la semana esté completa.</p>
        </>
      ) : puede ? (
        <>
          <p className="t-cuerpo mb-4" style={{ fontSize: 16 }}>Tienes {registros.length} días registrados. El Clínico puede leer tu semana: qué mejoró, qué se cayó, y tu ajuste para la próxima.</p>
          <button className="btn-secundario w-full" disabled={cargando} onClick={generar}>
            {cargando ? 'El Clínico está leyendo tu semana…' : 'Generar mi informe semanal'}
          </button>
        </>
      ) : (
        <p className="t-cuerpo" style={{ fontSize: 16 }}>Registra al menos 5 días de la semana y el Clínico te escribe la lectura completa.</p>
      )}
    </div>
  );
}
