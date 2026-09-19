import { Home, Users, ListChecks, ClipboardEdit, Timer, History, Settings, Dumbbell } from 'lucide-react';
import type { Route, RouteName } from '../../types/route';

const ITEMS: { name: RouteName; label: string; icon: typeof Home }[] = [
  { name: 'home', label: 'Accueil', icon: Home },
  { name: 'boxers', label: 'Boxeurs', icon: Users },
  { name: 'skills', label: 'Compétences', icon: ListChecks },
  { name: 'evaluate', label: 'Évaluation rapide', icon: ClipboardEdit },
  { name: 'timer', label: 'Timer', icon: Timer },
  { name: 'history', label: 'Historique', icon: History },
  { name: 'settings', label: 'Réglages', icon: Settings },
];

export function SideNav({ current, onNavigate }: { current: RouteName; onNavigate: (r: Route) => void }) {
  return (
    <nav className="hidden sm:flex flex-col w-60 shrink-0 bg-zinc-950 border-r border-zinc-800 p-4">
      <div className="flex items-center gap-2 px-2 mb-8 mt-2">
        <div className="w-9 h-9 rounded-lg bg-gold flex items-center justify-center">
          <Dumbbell size={18} className="text-black" />
        </div>
        <span className="font-display text-zinc-100 font-semibold text-lg tracking-wide">BoxTrack</span>
      </div>
      <div className="flex flex-col gap-1">
        {ITEMS.map(({ name, label, icon: Icon }) => {
          const active = current === name;
          return (
            <button
              key={name}
              onClick={() => onNavigate({ name })}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-left transition-colors ${
                active ? 'bg-gold/15 text-gold' : 'text-zinc-400 hover:bg-zinc-900 hover:text-zinc-200'
              }`}
            >
              <Icon size={18} strokeWidth={2.2} />
              {label}
            </button>
          );
        })}
      </div>
    </nav>
  );
}
