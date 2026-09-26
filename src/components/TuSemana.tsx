/** TU SEMANA — el ritmo del Acompañado en HOY: Iceberg (lunes 21:00), sesión, Jugada (miércoles 21:00). */
import { CheckCircle2, Circle, ChevronRight } from 'lucide-react';
import { listarIcebergs, listarJugadas, getSesionHoy, type PaginaId } from '../lib/estadoCdl';
import { ventanaEntrega, entregadoEnVentana, textoVence, proximoDia, DIA_ADENTRO, DIA_AFUERA } from '../lib/semana';
import { VideoEje } from './Contenido';

function Fila({ hecho, titulo, detalle, onClick }: { hecho: boolean; titulo: string; detalle: string; onClick: () => void }) {
  const Icono = hecho ? CheckCircle2 : Circle;
  return (
    <button className="w-full text-left flex items-center gap-3 py-3" style={{ borderBottom: '1px solid var(--borde)' }} onClick={onClick}>
      <Icono size={22} color={hecho ? 'var(--zona-verde)' : 'var(--texto-tenue)'} className="flex-none" />
      <span className="flex-1">
        <span className="t-sub block">{titulo}</span>
        <span className="t-cuerpo block" style={{ fontSize: 16 }}>{detalle}</span>
      </span>
      <ChevronRight size={18} color="var(--texto-tenue)" className="flex-none" />
    </button>
  );
}

export default function TuSemana({ navegar, semana }: { navegar: (p: PaginaId) => void; semana?: number }) {
  const hoy = new Date();
  const vIce = ventanaEntrega(DIA_ADENTRO, hoy);
  const vJug = ventanaEntrega(DIA_AFUERA, hoy);
  const iceHecho = entregadoEnVentana(listarIcebergs().filter((i) => i.cerrado).map((i) => i.cerradoEn ?? i.fecha), vIce);
  const jugHecha = entregadoEnVentana(listarJugadas().map((j) => j.fecha), vJug);

  const sesionHoy = getSesionHoy();
  const esDiaDeSesion = hoy.getDay() === DIA_ADENTRO || hoy.getDay() === DIA_AFUERA;
  const proxima = [proximoDia(DIA_ADENTRO, hoy), proximoDia(DIA_AFUERA, hoy)].sort((a, b) => a.getTime() - b.getTime())[0];
  const detalleSesion = sesionHoy?.cerrada
    ? 'Cerrada. Tu compromiso está anotado.'
    : sesionHoy ? 'En curso: ciérrala al terminar.'
    : esDiaDeSesion ? 'Hoy. Ábrela al empezar la llamada.'
    : `Próxima: ${proxima.toLocaleDateString('es', { weekday: 'long', day: 'numeric' })}`;

  return (
    <div className="tarjeta p-5 mb-4">
      <p className="t-micro mb-1" style={{ color: 'var(--acento)' }}>Tu semana</p>
      <p className="t-cuerpo mb-2" style={{ fontSize: 16 }}>Martes adentro · jueves afuera</p>
      {semana ? <VideoEje clave={`semana${semana}`} titulo={`El video de la semana ${semana}`} /> : null}
      <Fila hecho={iceHecho} titulo="El Iceberg" detalle={iceHecho ? 'Entregado para el martes.' : textoVence(vIce, hoy)} onClick={() => navegar('iceberg')} />
      <Fila hecho={Boolean(sesionHoy?.cerrada)} titulo="La sesión" detalle={detalleSesion} onClick={() => navegar('sesion')} />
      <Fila hecho={jugHecha} titulo="La Jugada" detalle={jugHecha ? 'Entregada para el jueves.' : textoVence(vJug, hoy)} onClick={() => navegar('jugada')} />
    </div>
  );
}
