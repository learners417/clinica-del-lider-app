/**
 * EL ICEBERG — desarmar un bloqueo capa por capa.
 *
 * Arriba del agua está lo que se ve: el bloqueo. Debajo, lo que lo sostiene.
 * El orden importa y no se saltea: mentira, miedo, dolor. Y al final el paso
 * que suelta, que no es entender: es perdonar.
 *
 * La regla que ordena todo esto: lo que te bloquea te estuvo cuidando.
 * Por eso ninguna capa se mira con látigo.
 */
import { useState } from 'react';
import { toast } from 'sonner';
import { Plus, ChevronRight, Trash2 } from 'lucide-react';
import {
  listarIcebergs, guardarIceberg, borrarIceberg, hoyIso, type Iceberg, type PaginaId,
} from '../lib/estadoCdl';

interface Capa {
  campo: 'bloqueo' | 'mentira' | 'miedo' | 'dolor' | 'perdon';
  etiqueta: string;
  pregunta: string;
  ayuda: string;
  ph: string;
}

const CAPAS: Capa[] = [
  {
    campo: 'bloqueo', etiqueta: 'Lo que se ve',
    pregunta: '¿Con qué te estás chocando?',
    ayuda: 'Lo concreto, no la explicación. Algo que intentas y no avanza.',
    ph: 'Me cuesta…',
  },
  {
    campo: 'mentira', etiqueta: 'Primera capa',
    pregunta: '¿Qué te dices que sostiene eso?',
    ayuda: 'Siempre hay una frase debajo. Si no lo hago no valgo. Si pongo límite me van a dejar. Yo soy bueno porque doy mucho. Se reconoce porque bloquea: la verdad abre.',
    ph: 'Me digo que…',
  },
  {
    campo: 'miedo', etiqueta: 'Segunda capa',
    pregunta: 'Si eso no fuera cierto, ¿qué temes que pase?',
    ayuda: 'Detrás de cada frase hay un miedo a que algo vuelva a ocurrir.',
    ph: 'Tengo miedo de que…',
  },
  {
    campo: 'dolor', etiqueta: 'El fondo',
    pregunta: '¿Cuándo pasó eso por primera vez?',
    ayuda: 'No hace falta que sea exacto ni que lo entiendas. Escribe lo primero que aparezca, aunque sea una escena suelta.',
    ph: 'La primera vez fue…',
  },
  {
    campo: 'perdon', etiqueta: 'Lo que suelta',
    pregunta: '¿Qué le dices a esa parte tuya?',
    ayuda: 'Esa frase apareció para protegerte, y lo hizo con las herramientas que tenía. Escríbele lo que hoy sabes y entonces no sabías.',
    ph: 'Quiero decirte que…',
  },
];

const vacio = (): Iceberg => ({
  id: String(Date.now()), fecha: hoyIso(),
  bloqueo: '', mentira: '', miedo: '', dolor: '', perdon: '', cerrado: false,
});

export default function IcebergPage({ navegar }: { navegar: (p: PaginaId) => void }) {
  const [lista, setLista] = useState<Iceberg[]>(listarIcebergs());
  const [actual, setActual] = useState<Iceberg | null>(null);
  const [capa, setCapa] = useState(0);

  function guardarYSeguir() {
    if (!actual) return;
    const c = CAPAS[capa];
    if (actual[c.campo].trim().length < 3) return;
    const cerrado = capa === CAPAS.length - 1;
    const guardado = { ...actual, cerrado };
    guardarIceberg(guardado);
    setLista(listarIcebergs());
    if (cerrado) {
      setActual(null);
      toast.success('Queda guardado. Puedes volver a leerlo cuando quieras.');
    } else {
      setActual(guardado);
      setCapa(capa + 1);
      window.scrollTo({ top: 0 });
    }
  }

  /* ── Trabajando un bloqueo ── */
  if (actual) {
    const c = CAPAS[capa];
    const listo = actual[c.campo].trim().length >= 3;
    return (
      <div className="pantalla pt-6 pb-28 pagina-anim">
        <div className="flex gap-1.5 mb-8">
          {CAPAS.map((_, i) => (
            <i key={i} className="flex-1" style={{ height: 2, borderRadius: 2, background: i <= capa ? 'var(--acento)' : 'rgba(21,19,15,.12)' }} />
          ))}
        </div>

        <p className="t-micro" style={{ color: 'var(--acento)' }}>{c.etiqueta}</p>
        <h1 className="t-display mt-3 mb-3">{c.pregunta}</h1>
        <p className="t-cuerpo mb-6">{c.ayuda}</p>

        {capa > 0 && (
          <div className="tarjeta p-5 mb-5">
            <p className="t-micro mb-2" style={{ color: 'var(--texto-tenue)' }}>Lo que se ve</p>
            <p className="t-sub">{actual.bloqueo}</p>
          </div>
        )}

        <textarea
          className="w-full px-5 py-4"
          style={{ minHeight: 170 }}
          placeholder={c.ph}
          value={actual[c.campo]}
          onChange={(e) => setActual({ ...actual, [c.campo]: e.target.value })}
        />

        <button className="btn-primario w-full mt-5" disabled={!listo} onClick={guardarYSeguir}>
          {capa === CAPAS.length - 1 ? 'Cerrar este' : 'Bajar una capa'}
        </button>
        <button className="btn-fantasma w-full mt-1"
          onClick={() => { if (capa > 0) { setCapa(capa - 1); } else { setActual(null); } }}>
          Volver
        </button>
      </div>
    );
  }

  /* ── La lista ── */
  return (
    <div className="pantalla pt-6 pb-28 pagina-anim">
      <p className="t-micro" style={{ color: 'var(--acento)' }}>El Espejo · a fondo</p>
      <h1 className="t-display mt-3 mb-4">El Iceberg</h1>
      <p className="t-cuerpo mb-3">
        Lo que se ve arriba del agua es lo que se te traba. Abajo está lo que lo sostiene, y es
        bastante más grande.
      </p>
      <p className="t-cuerpo mb-7">
        Vas a bajar cinco capas, de a una. Con una condición: nada de lo que aparezca se mira con
        látigo. Lo que hoy te bloquea alguna vez te estuvo cuidando.
      </p>

      <button className="btn-primario w-full flex items-center justify-center gap-2"
        onClick={() => { setActual(vacio()); setCapa(0); }}>
        <Plus size={19} /> Trabajar un bloqueo
      </button>

      {lista.length > 0 && (
        <div className="mt-10">
          <p className="t-micro mb-4" style={{ color: 'var(--texto-tenue)' }}>Los que trabajaste</p>
          {[...lista].reverse().map((i) => (
            <div key={i.id} className="tarjeta p-5 mb-3">
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1">
                  <p className="t-sub mb-1">{i.bloqueo}</p>
                  <p className="t-cuerpo" style={{ fontSize: 17 }}>
                    {new Date(i.fecha + 'T12:00:00').toLocaleDateString('es', { day: 'numeric', month: 'long' })}
                    {i.cerrado ? ' · cerrado' : ' · sin terminar'}
                  </p>
                </div>
                <button className="btn-fantasma" style={{ padding: 6 }}
                  onClick={() => { setActual(i); setCapa(i.cerrado ? 0 : CAPAS.findIndex((c) => !i[c.campo].trim())); }}>
                  <ChevronRight size={22} />
                </button>
              </div>
              {i.perdon && (
                <p className="voz-maestro mt-4" style={{ fontSize: 19 }}>{i.perdon}</p>
              )}
              <button className="btn-fantasma flex items-center gap-2 mt-3" style={{ padding: 0 }}
                onClick={() => { if (confirm('¿Borrar este iceberg?')) { borrarIceberg(i.id); setLista(listarIcebergs()); } }}>
                <Trash2 size={17} /> Borrar
              </button>
            </div>
          ))}
        </div>
      )}

      <button className="btn-secundario w-full mt-8" onClick={() => navegar('hoy')}>Volver a Hoy</button>
    </div>
  );
}
