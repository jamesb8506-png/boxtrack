import { type ReactNode, useState } from 'react';
import { Menu, ChevronLeft } from 'lucide-react';
import { NavDrawer } from './NavDrawer';
import { SideNav } from './SideNav';
import { FabEvaluate } from './FabEvaluate';
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
  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <div className="min-h-screen bg-black text-zinc-100 flex">
      <SideNav current={route.name} onNavigate={onNavigate} />

      <div className="flex-1 flex flex-col min-w-0">
        <header className="sticky top-0 z-30 bg-black/95 backdrop-blur border-b border-zinc-800 px-4 py-3 flex items-center gap-3 pt-[env(safe-area-inset-top)]">
          {showBack ? (
            <button
              onClick={onBack}
              className="w-9 h-9 -ml-1.5 flex items-center justify-center rounded-full active:bg-zinc-800"
              aria-label="Retour"
            >
              <ChevronLeft size={22} className="text-zinc-300" />
            </button>
          ) : (
            <button
              onClick={() => setDrawerOpen(true)}
              className="w-9 h-9 -ml-1.5 flex items-center justify-center rounded-full active:bg-zinc-800 sm:hidden"
              aria-label="Ouvrir le menu"
            >
              <Menu size={22} className="text-zinc-300" />
            </button>
          )}
          <h1 className="font-display text-lg font-semibold tracking-wide text-zinc-100 flex-1 truncate">{title}</h1>
        </header>

        <main className="flex-1 pb-8">{children}</main>
      </div>

      <NavDrawer open={drawerOpen} current={route.name} onNavigate={onNavigate} onClose={() => setDrawerOpen(false)} />

      <FabEvaluate
        onClick={() => onNavigate({ name: 'evaluate' })}
        hidden={route.name === 'evaluate' || route.name === 'skill-detail'}
      />
    </div>
  );
}
