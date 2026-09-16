import { useState, useMemo } from 'react';
import { Users, Plus, Search } from 'lucide-react';
import { useAppData } from '../contexts/AppDataContext';
import { evaluationService } from '../services/evaluationService';
import { computeBoxerProgress } from '../services/progressService';
import { BoxerCard } from '../components/boxer/BoxerCard';
import { EmptyState } from '../components/ui/EmptyState';
import type { Route } from '../types/route';

export function BoxersPage({ onNavigate }: { onNavigate: (r: Route) => void }) {
  const { boxers, skills } = useAppData();
  const [query, setQuery] = useState('');
  const [showInactive, setShowInactive] = useState(false);

  const filtered = useMemo(() => {
    return boxers
      .filter((b) => showInactive || b.active)
      .filter((b) => `${b.firstName} ${b.lastName}`.toLowerCase().includes(query.toLowerCase()));
  }, [boxers, query, showInactive]);

  return (
    <div className="px-4 py-4">
      <div className="relative mb-3">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Rechercher un boxeur..."
          className="w-full bg-zinc-900 border border-zinc-800 rounded-xl pl-9 pr-3 py-3 text-sm text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:border-red-600"
        />
      </div>

      <div className="flex items-center justify-between mb-4">
        <label className="flex items-center gap-2 text-sm text-zinc-400">
          <input
            type="checkbox"
            checked={showInactive}
            onChange={(e) => setShowInactive(e.target.checked)}
            className="w-4 h-4 rounded accent-red-600"
          />
          Afficher les inactifs
        </label>
        <button
          onClick={() => onNavigate({ name: 'boxer-form' })}
          className="flex items-center gap-1 text-xs font-semibold text-red-500"
        >
          <Plus size={14} /> Ajouter
        </button>
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          icon={Users}
          title={boxers.length === 0 ? 'Aucun boxeur' : 'Aucun résultat'}
          description={boxers.length === 0 ? 'Créez votre premier boxeur.' : 'Essayez une autre recherche.'}
        />
      ) : (
        <div className="space-y-2.5">
          {filtered.map((boxer) => {
            const statusMap = evaluationService.getCurrentStatusMap(boxer.id);
            const progress = computeBoxerProgress(boxer.id, skills, statusMap);
            return (
              <BoxerCard
                key={boxer.id}
                boxer={boxer}
                progressRate={progress.progressRate}
                onClick={() => onNavigate({ name: 'boxer-profile', boxerId: boxer.id })}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}
