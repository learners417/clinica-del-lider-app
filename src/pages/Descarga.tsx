/**
 * LA DESCARGA — la carta que no se manda.
 * Se escribe todo lo que hay adentro, sin que nadie lo lea, y se quema.
 * El texto vive solo en esta pantalla: nunca toca el teléfono ni la nube.
 * Lo único que queda es el día en que se hizo.
 */
import { useEffect, useRef, useState } from 'react';
import { Flame } from 'lucide-react';
import { listarDescargas, registrarDescarga, type PaginaId } from '../lib/estadoCdl';
import { vibrar } from '../lib/haptics';
import Salida from '../components/Salida';
import { VideoEje } from '../components/Contenido';

type Fase = 'escribir' | 'quemando' | 'hecha';
const DURACION_QUEMA = 2600;

export default function DescargaPage({ navegar }: { navegar: (p: PaginaId) => void }) {
  const [texto, setTexto] = useState('');
  const [fase, setFase] = useState<Fase>('escribir');
  const [total, setTotal] = useState(listarDescargas().length);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => () => { if (timer.current) clearTimeout(timer.current); }, []);

  function quemar() {
    setFase('quemando');
    vibrar(20);
    timer.current = setTimeout(() => {
      setTexto('');
      registrarDescarga();
      setTotal(listarDescargas().length);
      setFase('hecha');
      vibrar([10, 60, 10]);
    }, DURACION_QUEMA);
  }

  if (fase === 'hecha') {
    return (
      <div className="pantalla pt-10 pb-28 pagina-anim">
        <p className="t-micro" style={{ color: 'var(--calido)' }}>La Descarga · número {total}</p>
        <h1 className="t-display mt-3 mb-4">Se quemó.</h1>
        <p className="t-cuerpo mb-3">No quedó guardado en ningún lado. Quedó el día en que lo soltaste.</p>
        <p className="t-cuerpo mb-8">Si vuelve, se vuelve a escribir. El cuarto se puede volver a ensuciar, y se vuelve a limpiar.</p>
        <p className="t-sub mb-8">En tu próxima sesión te van a preguntar una sola cosa: qué frase te costó más escribir.</p>
        <button className="btn-primario w-full" onClick={() => navegar('hoy')}>Volver a Hoy</button>
        <button className="btn-fantasma w-full mt-1" onClick={() => setFase('escribir')}>Escribir otra</button>
      </div>
    );
  }

  if (fase === 'quemando') {
    return (
      <div className="pantalla pt-10 pb-28">
        <p className="t-micro" style={{ color: 'var(--calido)' }}>La Descarga</p>
        <div className="quema tarjeta p-5 mt-6" style={{ minHeight: 220 }}>
          <p className="quema-texto">{texto}</p>
          <div className="quema-velo" />
          <div className="quema-borde" />
        </div>
      </div>
    );
  }

  const lista = texto.trim().length >= 20;
  return (
    <div className="pantalla pt-6 pb-28 pagina-anim">
      <p className="t-micro" style={{ color: 'var(--calido)' }}>La Descarga{total ? ` · llevas ${total}` : ''}</p>
      <h1 className="t-display mt-3 mb-4">Escribe todo. Después, se quema.</h1>
      <p className="t-cuerpo mb-3">A quien sea, sobre lo que sea. Sin cuidar la letra ni las palabras: nadie lo va a leer, ni tú.</p>
      <p className="t-cuerpo mb-6">Lo que escribes aquí no se guarda. Cuando lo quemes, desaparece.</p>

      <VideoEje clave="descarga" titulo="Cómo se hace · video de Javo" />

      <textarea className="w-full px-5 py-4" style={{ minHeight: 280 }} autoFocus
        placeholder="Lo que tengo adentro es…" value={texto} onChange={(e) => setTexto(e.target.value)} />

      <button className="btn-primario w-full mt-5 flex items-center justify-center gap-2" disabled={!lista} onClick={quemar}>
        <Flame size={19} /> Quemar
      </button>
      <button className="btn-fantasma w-full mt-1"
        onClick={() => { if (!texto.trim() || confirm('Lo que escribiste se pierde. ¿Salir igual?')) navegar('hoy'); }}>
        Volver
      </button>

      <Salida />
    </div>
  );
}
