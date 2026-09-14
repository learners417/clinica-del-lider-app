import { Cross } from 'lucide-react';

export default function BotiquinFab({ onClick }: { onClick: () => void }) {
  return (
    <button className="botiquin-fab" onClick={onClick} aria-label="Abrir el Botiquín de urgencia">
      <Cross size={15} strokeWidth={2.6} /> Botiquín
    </button>
  );
}
