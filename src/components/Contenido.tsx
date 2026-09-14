/** Contenidos de Javo — audio y video. Solo se muestran si la URL está cargada en config.ts. */
import { AUDIOS, VIDEOS } from '../data/config';

export function AudioJavo({ id, titulo }: { id: keyof typeof AUDIOS; titulo: string }) {
  const url = AUDIOS[id];
  if (!url) return null;
  return (
    <div className="tarjeta p-4 mb-4">
      <p className="t-micro mb-2" style={{ color: 'var(--calido)' }}>{titulo} · audio de Javo</p>
      <audio controls preload="none" src={url} style={{ width: '100%' }} />
    </div>
  );
}

export function VideoJavo({ dia }: { dia: number }) {
  const url = VIDEOS[dia];
  if (!url) return null;
  const src = url.includes('youtube') || url.includes('youtu.be')
    ? url.replace('watch?v=', 'embed/').replace('youtu.be/', 'www.youtube.com/embed/')
    : url;
  return (
    <div className="tarjeta mb-4" style={{ overflow: 'hidden' }}>
      <div style={{ position: 'relative', paddingTop: '56.25%' }}>
        <iframe src={src} title={`Video del Día ${dia}`} allowFullScreen
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', border: 0 }} />
      </div>
    </div>
  );
}
