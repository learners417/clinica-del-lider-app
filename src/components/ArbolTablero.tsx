/** EL ÁRBOL — el tablero del paciente, dibujado. Reemplaza a RuedaVida. */
import { useState } from 'react';
import { MEDIDAS, SENDEROS, puntaje, colorPuntaje, estadoMedida, type Tablero } from '../data/arbol';

const POS: Record<string, [number, number]> = Object.fromEntries(
  MEDIDAS.map((m) => [m.id, m.pos])
);

export default function ArbolTablero({
  tablero,
  previo,
  revelar = false,
  conNombres = true,
}: {
  tablero: Tablero;
  /** Una medición anterior, dibujada como contorno fino detrás. */
  previo?: Tablero;
  /** Enciende las medidas una por una en vez de mostrarlas juntas. */
  revelar?: boolean;
  conNombres?: boolean;
}) {
  const [tocada, setTocada] = useState<string | null>(null);
  const sel = MEDIDAS.find((m) => m.id === tocada);

  return (
    <div>
    <svg
      viewBox="-70 0 480 580"
      className="w-full max-w-[440px] mx-auto block"
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

      {previo && MEDIDAS.map((m) => {
        const v = puntaje(m, previo);
        const [x, y] = m.pos;
        // El radio dice cuánto valía entonces: se ve crecer o encogerse.
        const r = 10 + (v / 100) * 15;
        return (
          <circle key={`p-${m.id}`} cx={x} cy={y} r={r}
            fill="none" stroke="var(--texto-tenue)" strokeWidth="1" strokeDasharray="3 3" />
        );
      })}

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
            onClick={() => setTocada(tocada === m.id ? null : m.id)}
            style={revelar
              ? { opacity: 0, cursor: 'pointer', animation: `entrarPagina .5s ease ${0.4 + i * 0.13}s forwards` }
              : { cursor: 'pointer' }}
          >
            <circle
              cx={x} cy={y} r={previo ? 10 + (v / 100) * 15 : 25}
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
                style={{ fontFamily: 'var(--font-display)', fontWeight: 500, fontSize: 16 }}
              >
                {m.nombre}
              </text>
            )}
          </g>
        );
      })}
    </svg>

    {sel && (
      <div className="tarjeta p-5 mt-4" style={{ borderColor: 'var(--hairline-acento)' }}>
        <div className="flex items-baseline justify-between mb-1">
          <span className="t-titulo">{sel.nombre}</span>
          <span className="t-dato" style={{ color: colorPuntaje(puntaje(sel, tablero)), fontSize: 26 }}>
            {puntaje(sel, tablero)} · {estadoMedida(puntaje(sel, tablero))}
          </span>
        </div>
        <p className="t-cuerpo" style={{ fontSize: 18 }}>{sel.descriptor}</p>
        <p className="t-cuerpo mt-2" style={{ fontSize: 17, color: 'var(--texto-tenue)' }}>{sel.pregunta}</p>
      </div>
    )}
    </div>
  );
}
