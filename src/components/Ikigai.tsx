/** Tu ikigai — el mismo ejercicio del libro (semana 12, «Tu razón para levantarte»):
 *  cuatro círculos con palabras tuyas y, al final, la frase del centro.
 *  El Tablero lo mira en Propósito y el día 78 lo usa para escribir para qué lideras. */
import { useState } from 'react';
import { toast } from 'sonner';
import { getIkigai, setIkigai, type Ikigai as TIkigai } from '../lib/estadoCdl';

const CIRCULOS: { k: keyof Omit<TIkigai, 'centro' | 'fecha'>; titulo: string; ayuda: string }[] = [
  { k: 'amas', titulo: 'Lo que amas', ayuda: 'Lo que harías aunque nadie te lo pidiera.' },
  { k: 'bien', titulo: 'Lo que haces bien', ayuda: 'Lo que te sale y otros te reconocen.' },
  { k: 'mundo', titulo: 'Lo que el mundo necesita de ti', ayuda: 'A quién le sirve lo tuyo, y para qué.' },
  { k: 'pagan', titulo: 'Por lo que te pagan', ayuda: 'Lo que hoy, o mañana, alguien te paga por hacer.' },
];

export default function Ikigai({ compacto = false }: { compacto?: boolean }) {
  const [v, setV] = useState<TIkigai>(getIkigai());
  const cambiar = (k: keyof TIkigai, t: string) => setV({ ...v, [k]: t });
  const guardar = () => {
    if (setIkigai(v)) toast.success('Tu ikigai quedó guardado.');
    else toast.error('No se pudo guardar en este teléfono.');
  };

  return (
    <div className="tarjeta p-5">
      <p className="t-micro mb-2" style={{ color: 'var(--acento)' }}>Tu ikigai</p>
      <p className="t-sub mb-2">Tu razón para levantarte</p>
      {!compacto && (
        <p className="t-cuerpo mb-5" style={{ fontSize: 17 }}>
          Cuatro círculos que se cruzan. Empieza por el que te salga más fácil y deja el centro para el final:
          una frase, la que te levantaría un martes cualquiera.
        </p>
      )}
      {CIRCULOS.map((c) => (
        <div key={c.k} className="mb-4">
          <p className="t-sub mb-1" style={{ fontSize: 18 }}>{c.titulo}</p>
          <p className="t-cuerpo mb-2" style={{ fontSize: 16, color: 'var(--texto-tenue)' }}>{c.ayuda}</p>
          <textarea className="w-full px-5 py-3" style={{ minHeight: 80 }} value={v[c.k]}
            placeholder="Con tus palabras…" onChange={(e) => cambiar(c.k, e.target.value)} />
        </div>
      ))}
      <div className="mt-6">
        <p className="t-sub mb-1" style={{ fontSize: 18, color: 'var(--acento)' }}>El centro</p>
        <p className="t-cuerpo mb-2" style={{ fontSize: 16, color: 'var(--texto-tenue)' }}>Donde se tocan los cuatro. Una frase.</p>
        <textarea className="w-full px-5 py-3" style={{ minHeight: 80 }} value={v.centro}
          placeholder="Me levanto para…" onChange={(e) => cambiar('centro', e.target.value)} />
      </div>
      <button className="btn-primario w-full mt-5" onClick={guardar}>Guardar mi ikigai</button>
    </div>
  );
}
