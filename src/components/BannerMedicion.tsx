/** EL BANNER DE MEDICIÓN — prepara la medición del Día 45 y la del contrato, sin sorprender a nadie. */
import { CalendarCheck } from 'lucide-react';
import { getProtocolo, diaDelProtocolo, listarChequeos, type PaginaId } from '../lib/estadoCdl';

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

  // Ventana del Día 45
  if (dia >= 42 && dia < 45 && !tiene(45)) return <Aviso texto={`Tu medición del Día 45 es en ${45 - dia} ${45 - dia === 1 ? 'día' : 'días'}. No estudies para el examen: vive tu sistema normal, como cualquier semana.`} />;
  if (dia >= 45 && dia < 60 && !tiene(45)) return <Aviso destacado texto="La medición del Día 45 está abierta: el mismo instrumento del Día 0, tu verdad de hoy." boton="Hacer mi medición" onClick={() => navegar('chequeo')} />;

  // Ventana del contrato
  if (dia >= 87 && dia < 90 && !tiene(88)) return <Aviso texto={`Faltan ${90 - dia} ${90 - dia === 1 ? 'día' : 'días'} para la medición del contrato. Vive normal: el instrumento no mide tu mejor día, mide tus últimas semanas.`} />;
  if (dia >= 90 && !tiene(88)) return <Aviso destacado texto="La medición del contrato está abierta. Respóndela para saber, no para aprobar." boton="Medir el contrato" onClick={() => navegar('chequeo')} />;

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
