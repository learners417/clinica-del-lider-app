import type { Zona } from '../data/zonas';
import { PuntoZona } from './ui';

export default function ZonaBadge({ zona, grande = false }: { zona: Zona; grande?: boolean }) {
  return (
    <span
      className="inline-flex items-center gap-2.5 rounded-full"
      style={{
        background: 'var(--superficie)',
        border: `1.5px solid ${zona.color}`,
        color: zona.color,
        padding: grande ? '12px 24px' : '6px 14px',
        fontFamily: 'var(--font-display)',
        fontWeight: 700,
        fontSize: grande ? 19 : 13,
      }}
    >
      <PuntoZona color={zona.color} size={grande ? 12 : 9} />
      {zona.nombre}
    </span>
  );
}
