/** Primitivas del design system Monitor Vital 2.0. Targets táctiles >= 48px. */
import { Check, Minus, Plus } from 'lucide-react';

/** Opción de cuestionario (una por línea, tap grande). */
export function Opcion({ label, activa, onClick }: { label: string; activa?: boolean; onClick: () => void }) {
  return (
    <button className={`opcion ${activa ? 'activa' : ''}`} onClick={onClick}>
      <span className="flex items-center justify-between gap-3">
        <span>{label}</span>
        {activa && <Check size={18} color="var(--acento)" strokeWidth={2.5} />}
      </span>
    </button>
  );
}

/** Grupo de chips (selección rápida de una opción). */
export function Chips({ opciones, valor, onChange }: { opciones: string[]; valor?: string; onChange: (v: string) => void }) {
  return (
    <div className="chips">
      {opciones.map((op) => (
        <button key={op} className={`chip ${valor === op ? 'activo' : ''}`} onClick={() => onChange(op)}>{op}</button>
      ))}
    </div>
  );
}

/** Stepper numérico (+/−): preciso con el pulgar, sin sliders imprecisos. */
export function Stepper({ label, valor, min, max, paso = 1, sufijo = '', onChange }: {
  label: string; valor: number; min: number; max: number; paso?: number; sufijo?: string; onChange: (v: number) => void;
}) {
  return (
    <div className="stepper-fila">
      <span className="t-sub">{label}</span>
      <div className="stepper">
        <button aria-label="Menos" onClick={() => onChange(Math.max(min, +(valor - paso).toFixed(1)))}><Minus size={18} /></button>
        <span className="t-dato">{valor}{sufijo}</span>
        <button aria-label="Más" onClick={() => onChange(Math.min(max, +(valor + paso).toFixed(1)))}><Plus size={18} /></button>
      </div>
    </div>
  );
}

/** Barra de progreso con etiqueta de acto — encuadre de avance, jamás de déficit. */
export function BarraActos({ acto, nombre, progreso, onSalir }: { acto: number; nombre: string; progreso: number; onSalir?: () => void }) {
  return (
    <div className="mb-5">
      <div className="flex items-center justify-between mb-2">
        {onSalir
          ? <button className="t-micro" style={{ color: 'var(--texto-tenue)' }} onClick={onSalir}>‹ Salir</button>
          : <span />}
        <span className="t-micro" style={{ color: 'var(--acento)' }}>Acto {acto} de 4 · {nombre}</span>
      </div>
      <div className="barra"><div style={{ width: `${progreso}%`, background: 'var(--acento)' }} /></div>
    </div>
  );
}

/** Punto de Zona (la marca visual de las Zonas, sin emojis). */
export function PuntoZona({ color, size = 12 }: { color: string; size?: number }) {
  return <span className="zona-dot" style={{ background: color, width: size, height: size }} />;
}
