import { Check, SlidersHorizontal, X } from 'lucide-react';

export function FilterSheet<T extends string>({
  open,
  title,
  options,
  value,
  onSelect,
  onClose,
}: {
  open: boolean;
  title: string;
  options: { value: T; label: string }[];
  value: T;
  onSelect: (v: T) => void;
  onClose: () => void;
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50" role="dialog" aria-modal="true">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm animate-fade-in" onClick={onClose} />
      <div className="absolute inset-x-0 bottom-0 max-h-[75vh] bg-zinc-950 border-t border-zinc-800 rounded-t-2xl flex flex-col pb-[env(safe-area-inset-bottom)] animate-slide-in-up">
        <div className="flex items-center justify-between px-5 py-4 border-b border-zinc-800 shrink-0">
          <h3 className="font-display text-base font-semibold tracking-wide text-zinc-100">{title}</h3>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-full active:bg-zinc-800" aria-label="Fermer">
            <X size={18} className="text-zinc-400" />
          </button>
        </div>
        <div className="overflow-y-auto py-1">
          {options.map((opt) => {
            const active = opt.value === value;
            return (
              <button
                key={opt.value}
                onClick={() => {
                  onSelect(opt.value);
                  onClose();
                }}
                className="w-full flex items-center justify-between gap-3 px-5 py-3.5 text-left border-b border-zinc-900 active:bg-zinc-900"
              >
                <span className={`text-[15px] ${active ? 'text-gold font-semibold' : 'text-zinc-300 font-medium'}`}>
                  {opt.label}
                </span>
                {active && <Check size={18} className="text-gold shrink-0" />}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export function FilterButton({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-sm font-medium text-zinc-300"
    >
      <SlidersHorizontal size={15} className="text-gold" />
      {label}
    </button>
  );
}
