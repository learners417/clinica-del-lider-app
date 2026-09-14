/** Wordmark: la señal vital + el nombre, voz de instrumento. */
export default function Logo({ onClick }: { onClick: () => void }) {
  return (
    <button onClick={onClick} className="flex items-center gap-2.5" aria-label="Ir al inicio">
      <svg width="34" height="18" viewBox="0 0 64 32" className="pulso-latido" aria-hidden>
        <path d="M2 18 H17 L23 6 L31 28 L37 12 L41 18 H62" fill="none" stroke="var(--acento)" strokeWidth="3.6" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      <span className="flex flex-col leading-none text-left">
        <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 14, letterSpacing: '-0.01em' }}>Clínica del Líder</span>
      </span>
    </button>
  );
}
