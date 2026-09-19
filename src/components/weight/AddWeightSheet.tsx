import { useState, type FormEvent } from 'react';
import { X } from 'lucide-react';

export function AddWeightSheet({
  open,
  onClose,
  onSave,
}: {
  open: boolean;
  onClose: () => void;
  onSave: (weightKg: number, date: string, comment: string) => void;
}) {
  const [weight, setWeight] = useState('');
  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [comment, setComment] = useState('');
  const [error, setError] = useState('');

  if (!open) return null;

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const value = Number(weight.replace(',', '.'));
    if (!weight || isNaN(value) || value <= 0) {
      setError('Entrez un poids valide (ex : 61.7).');
      return;
    }
    onSave(value, date, comment.trim());
    setWeight('');
    setComment('');
    setError('');
    onClose();
  }

  const inputClass =
    'w-full bg-zinc-800 border border-zinc-700 rounded-xl px-3.5 py-3 text-zinc-100 text-base placeholder:text-zinc-600 focus:outline-none focus:border-gold';

  return (
    <div className="fixed inset-0 z-50" role="dialog" aria-modal="true">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm animate-fade-in" onClick={onClose} />
      <div className="absolute inset-x-0 bottom-0 bg-zinc-950 border-t border-zinc-800 rounded-t-2xl pb-[env(safe-area-inset-bottom)] animate-slide-in-up">
        <div className="flex items-center justify-between px-5 py-4 border-b border-zinc-800">
          <h3 className="font-display text-base font-semibold tracking-wide text-zinc-100">Nouvelle pesée</h3>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-full active:bg-zinc-800" aria-label="Fermer">
            <X size={18} className="text-zinc-400" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="px-5 py-4 space-y-3">
          <div>
            <label className="block text-sm font-medium text-zinc-400 mb-1.5">Poids (kg) *</label>
            <input
              className={inputClass}
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              placeholder="61.7"
              inputMode="decimal"
              autoFocus
            />
            {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-zinc-400 mb-1.5">Date</label>
            <input type="date" className={inputClass} value={date} onChange={(e) => setDate(e.target.value)} />
          </div>
          <div>
            <label className="block text-sm font-medium text-zinc-400 mb-1.5">Commentaire (optionnel)</label>
            <input
              className={inputClass}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Avant entraînement, à jeun..."
            />
          </div>
          <button type="submit" className="w-full py-3.5 rounded-xl bg-gold text-black font-semibold text-sm mt-2 active:bg-gold-dark">
            Enregistrer la pesée
          </button>
        </form>
      </div>
    </div>
  );
}
