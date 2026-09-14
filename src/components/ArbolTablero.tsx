/** EL ÁRBOL — el tablero del paciente, dibujado. Reemplaza a RuedaVida. */
import { MEDIDAS, SENDEROS, puntaje, colorPuntaje, type Tablero } from '../data/arbol';

const POS: Record<string, [number, number]> = Object.fromEntries(
  MEDIDAS.map((m) => [m.id, m.pos])
);

export default function ArbolTablero({
  tablero,
  revelar = false,
  conNombres = true,
}: {
  tablero: Tablero;
  /** Enciende las medidas una por una en vez de mostrarlas juntas. */
  revelar?: boolean;
  conNombres?: boolean;
}) {
  return (
    <svg
      viewBox="0 0 340 580"
      className="w-full max-w-[400px] mx-auto block"
      role="img"
      aria-label="Tu tablero"
    >
      {SENDEROS.map(([a, b]) => (
        <line
          key={`${a}-${b}`}
          x1={POS[a][0]} y1={POS[a][1]} x2={POS[b][0]} y2={POS[b][1]}
          stroke="var(--acento)" strokeWidth="0.8" opacity="0.38"
        />
      ))}

      {MEDIDAS.map((m, i) => {
        const v = puntaje(m, tablero);
        const color = colorPuntaje(v);
        const [x, y] = m.pos;
        const lado = x < 130 ? 'end' : x > 210 ? 'start' : 'middle';
        const lx = lado === 'end' ? x - 38 : lado === 'start' ? x + 38 : x;
        const ly = lado === 'middle' ? y + 48 : y + 6;
        return (
          <g
            key={m.id}
            style={revelar ? { opacity: 0, animation: `entrarPagina .5s ease ${0.4 + i * 0.13}s forwards` } : undefined}
          >
            <circle
              cx={x} cy={y} r={25}
              fill={color} fillOpacity={0.13 + v / 230}
              stroke={color} strokeWidth="1.2"
            />
            <text
              x={x} y={y + 7} textAnchor="middle" fill={color}
              style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 19 }}
            >
              {v}
            </text>
            {conNombres && (
              <text
                x={lx} y={ly} textAnchor={lado}
                fill="var(--texto-suave)"
                style={{ fontFamily: 'var(--font-display)', fontWeight: 500, fontSize: 15 }}
              >
                {m.nombre}
              </text>
            )}
          </g>
        );
      })}
    </svg>
  );
}
