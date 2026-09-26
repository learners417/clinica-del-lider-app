/** El testimonio fuera de la ceremonia: para completarlo, releerlo o compartirlo después del Alta. */
import TestimonioFlujo from '../components/Testimonio';
import type { PaginaId } from '../lib/estadoCdl';

export default function TestimonioPage({ navegar }: { navegar: (p: PaginaId) => void }) {
  return (
    <div className="pantalla pt-6 pb-28">
      <TestimonioFlujo onTerminado={() => navegar('tratamiento')} />
    </div>
  );
}
