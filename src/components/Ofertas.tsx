/** Las dos ofertas del Tratamiento — precios cerrados $333 / $999. */
import { Check } from 'lucide-react';
import { PRECIO_REINICIO, PRECIO_ACOMP, LINK_PAGO_333, LINK_PAGO_999 } from '../data/config';

const INCLUYE_SOLO = [
  'El camino completo: 84 días en dos viajes, una Dosis por día',
  'Mediciones oficiales el día 42 y el día 84 (el mismo instrumento del Día 0)',
  'El Clínico (tu acompañante IA) + los Sistemas Instalados + tu bitácora',
  'Por contrato: tu Índice sube 25 puntos en doce semanas, o seguimos hasta que suba',
];

const INCLUYE_ACOMP = [
  'Todo El Reinicio, más:',
  'Tu clínico de cabecera asignado: revisa tus Signos cada semana y te manda un audio personal (12 en total)',
  '3 consultas en vivo 1:1 con tu profesional (día 14 · 42 · 80)',
  'Revisión humana de tus mediciones · cupos limitados por camada',
];

export function OfertasReinicio({ onElegida }: { onElegida: () => void }) {
  const elegir = (link: string) => () => {
    if (link) { window.open(link, '_blank'); return; }
    onElegida();
  };
  return (
    <div className="space-y-4">
      <div className="tarjeta p-6" style={{ borderColor: 'var(--acento)', borderWidth: 2 }}>
        <p className="t-micro" style={{ color: 'var(--acento)' }}>DIY · tú con el sistema</p>
        <h3 className="t-titulo mt-1">El Reinicio — 12 semanas</h3>
        <div className="flex items-baseline gap-3 mt-3 mb-1">
          <span className="t-display">${PRECIO_REINICIO}</span>
          <span className="t-cuerpo" style={{ fontSize: 13 }}>pago único · $3,70 por día</span>
        </div>
        <p className="t-cuerpo mb-4" style={{ fontSize: 12 }}>Precio de fundador. Una hora de coaching ejecutivo promedia $297 — esto son doce semanas, medidas, por contrato.</p>
        <div className="space-y-2 mb-5">
          {INCLUYE_SOLO.map((x) => (
            <p key={x} className="flex items-start gap-2 t-cuerpo" style={{ fontSize: 13.5 }}>
              <Check size={16} color="var(--acento)" className="mt-0.5 flex-none" /> {x}
            </p>
          ))}
        </div>
        <button className="btn-primario w-full" onClick={elegir(LINK_PAGO_333)}>Empezar mi Tratamiento</button>
      </div>

      <div className="tarjeta p-6">
        <p className="t-micro" style={{ color: 'var(--calido)' }}>DWY · con humanos mirándote cada semana</p>
        <h3 className="t-titulo mt-1">El Reinicio Acompañado</h3>
        <div className="flex items-baseline gap-3 mt-3 mb-4">
          <span className="t-display">${PRECIO_ACOMP}</span>
          <span className="t-cuerpo" style={{ fontSize: 13 }}>pago único · 12 semanas</span>
        </div>
        <div className="space-y-2 mb-5">
          {INCLUYE_ACOMP.map((x) => (
            <p key={x} className="flex items-start gap-2 t-cuerpo" style={{ fontSize: 13.5 }}>
              <Check size={16} color="var(--calido)" className="mt-0.5 flex-none" /> {x}
            </p>
          ))}
        </div>
        <button className="btn-cobre w-full" onClick={elegir(LINK_PAGO_999)}>Quiero el Acompañado</button>
      </div>
    </div>
  );
}
