import { Home, Users, ListChecks, ClipboardEdit, History, Settings, Dumbbell, X } from 'lucide-react';
import type { Route, RouteName } from '../../types/route';

const ITEMS: { name: RouteName; label: string; icon: typeof Home }[] = [
  { name: 'home', label: 'Accueil', icon: Home },
  { name: 'boxers', label: 'Boxeurs', icon: Users },
  { name: 'skills', label: 'Compétences', icon: ListChecks },
  { name: 'evaluate', label: 'Évaluation rapide', icon: ClipboardEdit },
  { name: 'history', label: 'Historique', icon: History },
  { name: 'settings', label: 'Réglages', icon: Settings },
];

export function NavDrawer({
  open,
  current,
  onNavigate,
  onClose,
}: {
  open: boolean;
  current: RouteName;
  onNavigate: (r: Route) => void;
  onClose: () => void;
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 sm:hidden">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm animate-fade-in" onClick={onClose} />

      <div className="absolute inset-y-0 left-0 w-[82%] max-w-[320px] bg-zinc-950 border-r border-zinc-800 flex flex-col pt-[env(safe-area-inset-top)] pb-[env(safe-area-inset-bottom)] animate-slide-in-left">
        <div className="flex items-center justify-between px-4 py-4 border-b border-zinc-800">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-lg bg-gold flex items-center justify-center">
              <Dumbbell size={18} className="text-black" />
            </div>
            <span className="font-display text-zinc-100 font-semibold text-lg tracking-wide">BoxTrack</span>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 flex items-center justify-center rounded-full active:bg-zinc-800"
            aria-label="Fermer le menu"
          >
            <X size={20} className="text-zinc-400" />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto py-2">
          {ITEMS.map(({ name, label, icon: Icon }) => {
            const active = current === name;
            return (
              <button
                key={name}
                onClick={() => {
                  onNavigate({ name });
                  onClose();
                }}
                className={`w-full flex items-center gap-4 px-5 py-4 text-left border-b border-zinc-900 border-l-[3px] ${
                  active ? 'bg-gold/10 border-l-gold' : 'border-l-transparent active:bg-zinc-900'
                }`}
              >
                <Icon size={22} strokeWidth={2} className={active ? 'text-gold' : 'text-zinc-400'} />
                <span className={`text-[15px] font-medium ${active ? 'text-gold' : 'text-zinc-200'}`}>{label}</span>
              </button>
            );
          })}
        </nav>
      </div>
    </div>
  );
}
