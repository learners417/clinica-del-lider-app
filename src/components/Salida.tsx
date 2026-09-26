/**
 * SI ESTO TE DESBORDA — la salida que está en toda pantalla que va hacia adentro
 * (el origen, el mensaje, la yuxtaposición, la Descarga). Cerrada ocupa una línea;
 * abierta dice qué hacer ahora, en ese orden.
 */
import { useState } from 'react';
import { LifeBuoy, MessageCircle } from 'lucide-react';
import { AYUDA_URGENTE, WHATSAPP_TERAPEUTA } from '../data/config';
import { linkWhatsApp } from '../lib/semana';

export const TEXTO_EMERGENCIA = AYUDA_URGENTE.trim()
  || 'Si sientes que estás en peligro, llama ahora al número de emergencias de tu país.';

export default function Salida() {
  const [abierta, setAbierta] = useState(false);
  if (!abierta) {
    return (
      <button className="btn-fantasma flex items-center gap-2 mt-6 pl-0" onClick={() => setAbierta(true)}>
        <LifeBuoy size={18} /> Si esto te desborda
      </button>
    );
  }
  return (
    <div className="tarjeta p-5 mt-6" style={{ borderColor: 'var(--zona-roja)' }}>
      <p className="t-sub mb-3">Frena aquí. Nada de esto tiene que terminarse hoy.</p>
      <p className="t-cuerpo mb-3">Apoya los pies en el piso. Inhala en cuatro, exhala en seis, diez veces. Mira cinco cosas que tengas alrededor y nómbralas.</p>
      <p className="t-cuerpo mb-3">Escríbele a tu terapeuta y cuéntale dónde te frenaste. Lo retoman juntos en la próxima sesión.</p>
      <p className="t-sub mb-4" style={{ color: 'var(--zona-roja)' }}>{TEXTO_EMERGENCIA}</p>
      {WHATSAPP_TERAPEUTA && (
        <a className="btn-secundario w-full flex items-center justify-center gap-2" target="_blank" rel="noopener noreferrer"
          href={linkWhatsApp('Me frené en un ejercicio de la app y necesito hablar.', WHATSAPP_TERAPEUTA)}>
          <MessageCircle size={18} /> Escribirle a mi terapeuta
        </a>
      )}
      <button className="btn-fantasma w-full mt-1" onClick={() => setAbierta(false)}>Cerrar</button>
    </div>
  );
}
