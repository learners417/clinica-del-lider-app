/** EL CERTIFICADO DEL ALTA — imagen descargable (1080×1350, formato historia/feed) dibujada en canvas. */
import { useEffect, useState } from 'react';
import { Download } from 'lucide-react';

interface Props {
  nombre: string;
  cbiInicial: number;
  cbiFinal: number;
  fecha: string; // yyyy-mm-dd
}

function dibujar(p: Props): Promise<string> {
  return new Promise((resolver) => {
    const W = 1080, H = 1350;
    const c = document.createElement('canvas');
    c.width = W; c.height = H;
    const ctx = c.getContext('2d')!;

    // Fondo con las capas de la casa
    ctx.fillStyle = '#F0EBE0';
    ctx.fillRect(0, 0, W, H);
    const g1 = ctx.createRadialGradient(W / 2, -100, 50, W / 2, -100, 900);
    g1.addColorStop(0, 'rgba(63,207,142,0.10)');
    g1.addColorStop(1, 'rgba(63,207,142,0)');
    ctx.fillStyle = g1;
    ctx.fillRect(0, 0, W, H);

    // Marco hairline
    ctx.strokeStyle = 'rgba(238,244,240,0.14)';
    ctx.lineWidth = 2;
    ctx.strokeRect(48, 48, W - 96, H - 96);

    const centro = (t: string, y: number, font: string, color: string, spacing = 0) => {
      ctx.font = font;
      ctx.fillStyle = color;
      if (spacing > 0) {
        const ancho = ctx.measureText(t).width + spacing * (t.length - 1);
        let x = (W - ancho) / 2;
        for (const ch of t) { ctx.fillText(ch, x, y); x += ctx.measureText(ch).width + spacing; }
      } else {
        ctx.textAlign = 'center';
        ctx.fillText(t, W / 2, y);
        ctx.textAlign = 'left';
      }
    };

    centro('LA CLÍNICA DEL LÍDER', 170, '700 30px system-ui, sans-serif', 'rgba(201,118,79,0.95)', 10);

    // La línea de pulso
    ctx.strokeStyle = '#A98B4F';
    ctx.lineWidth = 7;
    ctx.lineJoin = 'round';
    ctx.lineCap = 'round';
    ctx.beginPath();
    const y0 = 320;
    ctx.moveTo(180, y0); ctx.lineTo(430, y0); ctx.lineTo(485, y0 - 78); ctx.lineTo(560, y0 + 92); ctx.lineTo(620, y0 - 30); ctx.lineTo(660, y0); ctx.lineTo(900, y0);
    ctx.stroke();

    centro('EL ALTA', 520, '700 128px system-ui, sans-serif', '#15130F');
    centro(p.nombre || 'Paciente de la clínica', 620, '600 44px system-ui, sans-serif', 'rgba(238,244,240,0.85)');

    // Los números del contrato
    ctx.textAlign = 'center';
    ctx.font = '700 96px system-ui, sans-serif';
    ctx.fillStyle = 'rgba(228,87,76,0.95)';
    ctx.fillText(String(p.cbiInicial), W / 2 - 190, 810);
    ctx.fillStyle = '#A98B4F';
    ctx.fillText(String(p.cbiFinal), W / 2 + 190, 810);
    ctx.font = '700 60px system-ui, sans-serif';
    ctx.fillStyle = 'rgba(238,244,240,0.55)';
    ctx.fillText('→', W / 2, 800);
    ctx.font = '700 24px system-ui, sans-serif';
    ctx.fillStyle = 'rgba(238,244,240,0.5)';
    ctx.fillText('DÍA 0', W / 2 - 190, 860);
    ctx.fillText('DÍA 90', W / 2 + 190, 860);
    ctx.textAlign = 'left';

    centro('Agotamiento medido con el mismo instrumento clínico, dos veces.', 950, '400 30px system-ui, sans-serif', 'rgba(238,244,240,0.65)');
    centro('Fuera de la zona roja. Por contrato, cumplido.', 1000, '600 30px system-ui, sans-serif', 'rgba(238,244,240,0.85)');
    centro('Duerme. Volvió a su casa. Volvió a sí.', 1105, 'italic 600 38px Georgia, serif', 'rgba(201,118,79,0.95)');

    const f = new Date(p.fecha + 'T12:00:00');
    centro(f.toLocaleDateString('es', { day: 'numeric', month: 'long', year: 'numeric' }), 1230, '400 28px system-ui, sans-serif', 'rgba(238,244,240,0.45)');

    resolver(c.toDataURL('image/png'));
  });
}

export default function CertificadoAlta(props: Props) {
  const [url, setUrl] = useState<string>('');

  useEffect(() => {
    let vivo = true;
    document.fonts?.ready?.then(() => { if (vivo) dibujar(props).then((u) => vivo && setUrl(u)); })
      ?? dibujar(props).then((u) => vivo && setUrl(u));
    return () => { vivo = false; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.cbiInicial, props.cbiFinal, props.fecha, props.nombre]);

  if (!url) return <p className="t-micro pulso-latido text-center py-8" style={{ color: 'var(--texto-tenue)' }}>Preparando tu certificado…</p>;

  return (
    <div>
      <img src={url} alt="Certificado del Alta" className="w-full rounded-2xl mb-4" style={{ border: '1px solid var(--borde)' }} />
      <a href={url} download="mi-alta-clinica-del-lider.png" className="btn-primario w-full flex items-center justify-center gap-2" style={{ textDecoration: 'none' }}>
        <Download size={18} /> Descargar mi Alta
      </a>
      <p className="t-cuerpo mt-3 text-center" style={{ fontSize: 12 }}>Compártela si quieres — o guárdala para ti. Las dos cosas son victoria.</p>
    </div>
  );
}
