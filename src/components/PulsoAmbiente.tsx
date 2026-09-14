/** La firma de la marca: una señal vital recorriendo la pantalla, muy sutil. */
export default function PulsoAmbiente({ opacidad = 0.35 }: { opacidad?: number }) {
  return (
    <svg viewBox="0 0 800 56" preserveAspectRatio="none" aria-hidden
      style={{ width: '100%', height: 44, display: 'block', opacity: opacidad }}>
      <path
        d="M0 30 H210 L232 30 L246 10 L264 48 L280 20 L292 30 H520 L540 30 L552 16 L566 42 L578 30 H800"
        fill="none" stroke="var(--acento)" strokeWidth="1.6"
        strokeLinecap="round" strokeLinejoin="round" className="pulso-linea" />
      <path
        d="M0 30 H210 L232 30 L246 10 L264 48 L280 20 L292 30 H520 L540 30 L552 16 L566 42 L578 30 H800"
        fill="none" stroke="rgba(63,207,142,.14)" strokeWidth="1.2"
        strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
