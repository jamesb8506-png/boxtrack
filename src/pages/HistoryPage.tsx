import { useState, useMemo } from 'react';
import { History as HistoryIcon } from 'lucide-react';
import { useAppData } from '../contexts/AppDataContext';
import { StatusBadge } from '../components/ui/StatusBadge';
import { EmptyState } from '../components/ui/EmptyState';
import { formatDateTime } from '../utils/age';
import type { Route } from '../types/route';

export function HistoryPage({ boxerId, onNavigate }: { boxerId?: string; onNavigate: (r: Route) => void }) {
  const { boxers, skills, evaluations } = useAppData();
  const [filterBoxerId, setFilterBoxerId] = useState<string>(boxerId ?? 'all');

  const filtered = useMemo(() => {
    if (filterBoxerId === 'all') return evaluations;
    return evaluations.filter((e) => e.boxerId === filterBoxerId);
  }, [evaluations, filterBoxerId]);

  return (
    <div className="px-4 py-4">
      <select
        value={filterBoxerId}
        onChange={(e) => setFilterBoxerId(e.target.value)}
        className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3.5 py-3 text-sm text-zinc-100 mb-4 focus:outline-none focus:border-red-600"
      >
        <option value="all">Tous les boxeurs</option>
        {boxers.map((b) => (
          <option key={b.id} value={b.id}>
            {b.firstName} {b.lastName}
          </option>
        ))}
      </select>

      {filtered.length === 0 ? (
        <EmptyState icon={HistoryIcon} title="Aucune évaluation" description="L'historique apparaîtra ici après les premières évaluations." />
      ) : (
        <div className="space-y-2.5">
          {filtered.map((ev) => {
            const boxer = boxers.find((b) => b.id === ev.boxerId);
            const skill = skills.find((s) => s.id === ev.skillId);
            if (!boxer || !skill) return null;
            return (
              <button
                key={ev.id}
                onClick={() => onNavigate({ name: 'skill-detail', skillId: skill.id, boxerId: boxer.id })}
                className="w-full text-left bg-zinc-900 border border-zinc-800 rounded-xl px-3.5 py-3 active:bg-zinc-800"
              >
                <div className="flex items-center justify-between mb-1">
                  <p className="text-sm font-semibold text-zinc-200 truncate">{skill.name}</p>
                  <StatusBadge status={ev.status} size="sm" />
                </div>
                <p className="text-xs text-zinc-500">
                  {boxer.firstName} {boxer.lastName} · {formatDateTime(ev.date)}
                </p>
                {ev.comment && <p className="text-sm text-zinc-400 mt-1 truncate">{ev.comment}</p>}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
