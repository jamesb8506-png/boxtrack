import { useState, useMemo } from 'react';
import { History as HistoryIcon } from 'lucide-react';
import { useAppData } from '../contexts/AppDataContext';
import { StatusBadge } from '../components/ui/StatusBadge';
import { EmptyState } from '../components/ui/EmptyState';
import { formatDateTime } from '../utils/age';
import { OBSERVATION_SCORE_LABELS } from '../types';
import type { Route } from '../types/route';

type HistoryMode = 'observations' | 'skills';

export function HistoryPage({ boxerId, onNavigate }: { boxerId?: string; onNavigate: (r: Route) => void }) {
  const { boxers, skills, evaluations, observations, domains } = useAppData();
  const [mode, setMode] = useState<HistoryMode>('observations');
  const [filterBoxerId, setFilterBoxerId] = useState<string>(boxerId ?? 'all');

  const filteredEvaluations = useMemo(() => {
    if (filterBoxerId === 'all') return evaluations;
    return evaluations.filter((e) => e.boxerId === filterBoxerId);
  }, [evaluations, filterBoxerId]);

  const filteredObservations = useMemo(() => {
    if (filterBoxerId === 'all') return observations;
    return observations.filter((o) => o.boxerId === filterBoxerId);
  }, [observations, filterBoxerId]);

  return (
    <div className="px-4 py-4">
      <select
        value={filterBoxerId}
        onChange={(e) => setFilterBoxerId(e.target.value)}
        className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3.5 py-3 text-sm text-zinc-100 mb-3 focus:outline-none focus:border-gold"
      >
        <option value="all">Tous les boxeurs</option>
        {boxers.map((b) => (
          <option key={b.id} value={b.id}>
            {b.firstName} {b.lastName}
          </option>
        ))}
      </select>

      <div className="flex bg-zinc-900 border border-zinc-800 rounded-xl p-1 mb-4">
        <button
          onClick={() => setMode('observations')}
          className={`flex-1 py-2.5 rounded-lg text-sm font-semibold ${
            mode === 'observations' ? 'bg-gold text-black' : 'text-zinc-400'
          }`}
        >
          Observations
        </button>
        <button
          onClick={() => setMode('skills')}
          className={`flex-1 py-2.5 rounded-lg text-sm font-semibold ${
            mode === 'skills' ? 'bg-gold text-black' : 'text-zinc-400'
          }`}
        >
          Compétences
        </button>
      </div>

      {mode === 'observations' ? (
        filteredObservations.length === 0 ? (
          <EmptyState
            icon={HistoryIcon}
            title="Aucune observation"
            description="L'historique apparaîtra ici après les premières évaluations guidées."
          />
        ) : (
          <div className="space-y-2.5">
            {filteredObservations.map((obs) => {
              const boxer = boxers.find((b) => b.id === obs.boxerId);
              const domain = domains.find((d) => d.id === obs.domainId);
              if (!boxer || !domain) return null;
              return (
                <div key={obs.id} className="bg-zinc-900 border border-zinc-800 rounded-xl px-3.5 py-3">
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-sm font-semibold text-zinc-200 truncate">{domain.name}</p>
                    <span className="font-display text-sm font-semibold text-gold shrink-0">
                      {obs.score}/5 · {OBSERVATION_SCORE_LABELS[obs.score]}
                    </span>
                  </div>
                  <p className="text-xs text-zinc-500">
                    {boxer.firstName} {boxer.lastName} · {formatDateTime(obs.date)}
                  </p>
                  {obs.comment && <p className="text-sm text-zinc-400 mt-1">{obs.comment}</p>}
                </div>
              );
            })}
          </div>
        )
      ) : filteredEvaluations.length === 0 ? (
        <EmptyState icon={HistoryIcon} title="Aucune évaluation" description="L'historique apparaîtra ici après les premières évaluations." />
      ) : (
        <div className="space-y-2.5">
          {filteredEvaluations.map((ev) => {
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
