/** ARRANQUE — la clínica abriendo. Marca desde el primer segundo. */
export default function Arranque({ texto = 'La clínica está abriendo…' }: { texto?: string }) {
  return (
    <div className="min-h-screen grid place-items-center" style={{ background: 'var(--fondo)' }}>
      <div className="text-center px-6">
        <svg width="132" height="52" viewBox="0 0 132 52" fill="none" className="mx-auto mb-5" aria-hidden>
          <path d="M4 26 H38 L48 8 L62 44 L72 20 L79 26 H128" stroke="var(--acento)" strokeWidth="3.4"
            strokeLinecap="round" strokeLinejoin="round" className="trazo-pulso" />
        </svg>
        <p className="t-micro pulso-latido" style={{ color: 'var(--texto-tenue)' }}>{texto}</p>
      </div>
    </div>
  );
}
