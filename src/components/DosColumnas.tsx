/**
 * LAS DOS COLUMNAS — en la medición del día 42 y del 84, al lado del Tablero.
 * El número dice cuánto se movió. Las columnas dicen por qué.
 */
import { useState } from 'react';
import { toast } from 'sonner';
import { listarColumnas, guardarColumnas, hoyIso } from '../lib/estadoCdl';

export default function DosColumnas({ dia }: { dia: number }) {
  const previa = listarColumnas().find((c) => c.dia === dia);
  const [recibir, setRecibir] = useState(previa?.recibir ?? '');
  const [demi, setDemi] = useState(previa?.demi ?? '');
  const [guardada, setGuardada] = useState(Boolean(previa));

  if (guardada) {
    return (
      <div className="tarjeta p-5 mb-4">
        <p className="t-micro mb-3" style={{ color: 'var(--acento)' }}>Tus dos columnas · día {dia}</p>
        <p className="t-sub mb-1">Lo que me faltó recibir</p>
        <p className="t-cuerpo mb-4">{recibir}</p>
        <p className="t-sub mb-1">Lo que faltó de mí</p>
        <p className="t-cuerpo mb-3">{demi}</p>
        <button className="btn-fantasma pl-0" onClick={() => setGuardada(false)}>Editar</button>
      </div>
    );
  }

  return (
    <div className="tarjeta p-5 mb-4">
      <p className="t-micro mb-2" style={{ color: 'var(--acento)' }}>Las dos columnas</p>
      <p className="t-cuerpo mb-5">El número dice cuánto te moviste. Estas dos respuestas dicen por qué. Con honestidad para los dos lados.</p>
      <p className="t-sub mb-2">¿Qué te faltó recibir?</p>
      <textarea className="w-full px-4 py-3 mb-5" style={{ minHeight: 100 }} placeholder="Me faltó…"
        value={recibir} onChange={(e) => setRecibir(e.target.value)} />
      <p className="t-sub mb-2">¿Qué faltó de ti?</p>
      <textarea className="w-full px-4 py-3" style={{ minHeight: 100 }} placeholder="De mí faltó…"
        value={demi} onChange={(e) => setDemi(e.target.value)} />
      <button className="btn-primario w-full mt-5" disabled={recibir.trim().length < 3 || demi.trim().length < 3}
        onClick={() => { guardarColumnas({ fecha: hoyIso(), dia, recibir: recibir.trim(), demi: demi.trim() }); setGuardada(true); toast.success('Guardadas.'); }}>
        Guardar
      </button>
    </div>
  );
}
