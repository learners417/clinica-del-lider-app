import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Toaster } from 'sonner';
import App from './App.tsx';
import './index.css';
import { initSentry, Sentry } from './lib/sentry';
import { installDomTranslationGuard } from './lib/domTranslationGuard';

installDomTranslationGuard();
initSentry();

function FallbackUI() {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', padding: '2rem', textAlign: 'center', backgroundColor: '#F0EBE0', color: '#15130F', fontFamily: 'Outfit, system-ui, sans-serif' }}>
      <h1 style={{ fontSize: '1.4rem', marginBottom: '0.5rem', fontWeight: 700 }}>La clínica se cayó un segundo.</h1>
      <p style={{ opacity: 0.65, marginBottom: '1.5rem' }}>Ya nos enteramos y lo estamos revisando. Tus datos están guardados en este dispositivo.</p>
      <button onClick={() => window.location.reload()} style={{ padding: '0.65rem 1.3rem', backgroundColor: '#15130F', color: '#F0EBE0', border: 'none', borderRadius: '12px', cursor: 'pointer', fontWeight: 600 }}>Recargar</button>
    </div>
  );
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Sentry.ErrorBoundary fallback={<FallbackUI />}>
      <App />
      <Toaster theme="dark" position="top-center" richColors />
    </Sentry.ErrorBoundary>
  </StrictMode>,
);

// PWA: registrar el service worker solo en producción
if ('serviceWorker' in navigator && import.meta.env.PROD) {
  window.addEventListener('load', () => { navigator.serviceWorker.register('/sw.js').catch(() => {}); });
}
