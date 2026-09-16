import { type ReactNode } from 'react';
import { Settings, ChevronLeft } from 'lucide-react';
import { BottomNav } from './BottomNav';
import { SideNav } from './SideNav';
import type { Route } from '../../types/route';

export function AppShell({
  route,
  onNavigate,
  title,
  showBack,
  onBack,
  children,
}: {
  route: Route;
  onNavigate: (r: Route) => void;
  title: string;
  showBack?: boolean;
  onBack?: () => void;
  children: ReactNode;
}) {
  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex">
      <SideNav current={route.name} onNavigate={onNavigate} />

      <div className="flex-1 flex flex-col min-w-0">
        <header className="sticky top-0 z-30 bg-zinc-950/95 backdrop-blur border-b border-zinc-800 px-4 py-3 flex items-center gap-3 pt-[env(safe-area-inset-top)]">
          {showBack ? (
            <button
              onClick={onBack}
              className="w-9 h-9 -ml-1.5 flex items-center justify-center rounded-full active:bg-zinc-800"
              aria-label="Retour"
            >
              <ChevronLeft size={22} className="text-zinc-300" />
            </button>
          ) : (
            <div className="w-9 h-9 rounded-lg bg-red-600 flex items-center justify-center sm:hidden">
              <span className="text-white font-bold text-sm">BT</span>
            </div>
          )}
          <h1 className="text-lg font-bold text-zinc-100 flex-1 truncate">{title}</h1>
          {!showBack && (
            <button
              onClick={() => onNavigate({ name: 'settings' })}
              className="w-9 h-9 flex items-center justify-center rounded-full active:bg-zinc-800 sm:hidden"
              aria-label="Réglages"
            >
              <Settings size={20} className="text-zinc-400" />
            </button>
          )}
        </header>

        <main className="flex-1 pb-20 sm:pb-6">{children}</main>
      </div>

      <BottomNav current={route.name} onNavigate={onNavigate} />
    </div>
  );
}
