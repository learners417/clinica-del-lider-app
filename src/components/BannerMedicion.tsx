/** EL BANNER DE MEDICIÓN — prepara la medición del día 42 y la del contrato, sin sorprender a nadie. */
import { CalendarCheck } from 'lucide-react';
import { getProtocolo, diaDelProtocolo, listarChequeos, type PaginaId } from '../lib/estadoCdl';
import { HITO_MEDIO, HITO_CONTRATO } from '../data/camino';

function fechaMas(inicio: string, dias: number): string {
  const [y, m, d] = inicio.split('-').map(Number);
  const t = new Date(y, m - 1, d + dias);
  return `${t.getFullYear()}-${String(t.getMonth() + 1).padStart(2, '0')}-${String(t.getDate()).padStart(2, '0')}`;
}

export default function BannerMedicion({ navegar }: { navegar: (p: PaginaId) => void }) {
  const p = getProtocolo();
  if (!p) return null;
  const dia = diaDelProtocolo(p);
  const fechas = listarChequeos().map((c) => c.fecha.slice(0, 10)).filter((f) => f > p.fechaInicio);
  const tiene = (desde: number) => fechas.some((f) => f >= fechaMas(p.fechaInicio, desde - 1));

  // Ventana del día 42 — cierre del primer viaje
  if (dia >= HITO_MEDIO - 3 && dia < HITO_MEDIO && !tiene(HITO_MEDIO)) {
    const faltan = HITO_MEDIO - dia;
    return <Aviso texto={`Tu medición del día ${HITO_MEDIO} es en ${faltan} ${faltan === 1 ? 'día' : 'días'}. No estudies para el examen: vive tu sistema normal, como cualquier semana.`} />;
  }
  if (dia >= HITO_MEDIO && dia < HITO_MEDIO + 15 && !tiene(HITO_MEDIO)) {
    return <Aviso destacado texto={`La medición del día ${HITO_MEDIO} está abierta: el mismo instrumento del Día 0, tu verdad de hoy.`} boton="Hacer mi medición" onClick={() => navegar('chequeo')} />;
  }

  // Ventana del contrato
  if (dia >= HITO_CONTRATO - 3 && dia < HITO_CONTRATO && !tiene(HITO_CONTRATO)) {
    const faltan = HITO_CONTRATO - dia;
    return <Aviso texto={`Faltan ${faltan} ${faltan === 1 ? 'día' : 'días'} para la medición del contrato. Vive normal: el instrumento no mide tu mejor día, mide tus últimas semanas.`} />;
  }
  if (dia >= HITO_CONTRATO && !tiene(HITO_CONTRATO)) {
    return <Aviso destacado texto="La medición del contrato está abierta. Respóndela para saber, no para aprobar." boton="Medir el contrato" onClick={() => navegar('chequeo')} />;
  }

  return null;
}

function Aviso({ texto, boton, onClick, destacado = false }: { texto: string; boton?: string; onClick?: () => void; destacado?: boolean }) {
  return (
    <div className="tarjeta p-4 mb-4" style={destacado ? { borderColor: 'var(--acento)', borderWidth: 2 } : { borderColor: 'var(--hairline-acento)' }}>
      <div className="flex items-start gap-3">
        <CalendarCheck size={18} color={destacado ? 'var(--acento)' : 'var(--calido)'} className="mt-0.5 flex-none" />
        <p className="t-cuerpo" style={{ fontSize: 13.5 }}>{texto}</p>
      </div>
      {boton && <button className="btn-primario w-full mt-3" onClick={onClick}>{boton}</button>}
    </div>
  );
}
