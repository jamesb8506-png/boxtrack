import { ClipboardEdit } from 'lucide-react';

export function FabEvaluate({ onClick, hidden }: { onClick: () => void; hidden?: boolean }) {
  if (hidden) return null;

  return (
    <button
      onClick={onClick}
      aria-label="Évaluation rapide"
      className="fixed z-40 sm:hidden right-4 bottom-[calc(env(safe-area-inset-bottom)+20px)] w-14 h-14 rounded-full bg-gold shadow-lg shadow-black/60 flex items-center justify-center active:bg-gold-dark active:scale-95 transition-transform"
    >
      <ClipboardEdit size={24} className="text-black" strokeWidth={2.2} />
    </button>
  );
}
