import { Home, Users, ListChecks, ClipboardEdit, History } from 'lucide-react';
import type { Route, RouteName } from '../../types/route';

const ITEMS: { name: RouteName; label: string; icon: typeof Home }[] = [
  { name: 'home', label: 'Accueil', icon: Home },
  { name: 'boxers', label: 'Boxeurs', icon: Users },
  { name: 'skills', label: 'Compétences', icon: ListChecks },
  { name: 'evaluate', label: 'Évaluer', icon: ClipboardEdit },
  { name: 'history', label: 'Historique', icon: History },
];

export function BottomNav({ current, onNavigate }: { current: RouteName; onNavigate: (r: Route) => void }) {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-zinc-950/95 backdrop-blur border-t border-zinc-800 sm:hidden pb-[env(safe-area-inset-bottom)]">
      <div className="grid grid-cols-5">
        {ITEMS.map(({ name, label, icon: Icon }) => {
          const active = current === name;
          return (
            <button
              key={name}
              onClick={() => onNavigate({ name })}
              className="flex flex-col items-center justify-center gap-1 py-2.5 min-h-[56px] active:bg-zinc-900"
            >
              <Icon size={22} strokeWidth={2.2} className={active ? 'text-red-500' : 'text-zinc-500'} />
              <span className={`text-[10px] font-medium ${active ? 'text-red-500' : 'text-zinc-500'}`}>
                {label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
