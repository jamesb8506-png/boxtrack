import { useState, useMemo } from 'react';
import { Search, Users } from 'lucide-react';
import { useAppData } from '../contexts/AppDataContext';
import { evaluationService } from '../services/evaluationService';
import { SKILL_DOMAINS } from '../types';
import type { SkillDomain, MasteryLevel, EvaluationStatus } from '../types';
import { QuickEvalCard } from '../components/evaluation/QuickEvalCard';
import { BoxerCard } from '../components/boxer/BoxerCard';
import { EmptyState } from '../components/ui/EmptyState';
import { computeBoxerProgress } from '../services/progressService';
import type { Route } from '../types/route';

export function EvaluationPage({
  boxerId,
  onNavigate,
}: {
  boxerId?: string;
  onNavigate: (r: Route) => void;
}) {
  const { boxers, skills, addEvaluation } = useAppData();
  const [query, setQuery] = useState('');
  const [domainFilter, setDomainFilter] = useState<SkillDomain | 'all'>('all');
  const coachName = 'Coach'; // Nom du coach : personnalisable dans Réglages (V+)

  const boxer = boxerId ? boxers.find((b) => b.id === boxerId) : null;

  // Étape 1 : pas de boxeur sélectionné → choisir un boxeur
  if (!boxer) {
    const activeBoxers = boxers.filter((b) => b.active);
    return (
      <div className="px-4 py-4">
        <p className="text-sm text-zinc-500 mb-4">Sélectionnez un boxeur pour démarrer l'évaluation rapide.</p>
        {activeBoxers.length === 0 ? (
          <EmptyState icon={Users} title="Aucun boxeur actif" description="Créez ou activez un boxeur pour commencer." />
        ) : (
          <div className="space-y-2.5">
            {activeBoxers.map((b) => {
              const statusMap = evaluationService.getCurrentStatusMap(b.id);
              const progress = computeBoxerProgress(b.id, skills, statusMap);
              return (
                <BoxerCard
                  key={b.id}
                  boxer={b}
                  progressRate={progress.progressRate}
                  onClick={() => onNavigate({ name: 'evaluate', boxerId: b.id })}
                />
              );
            })}
          </div>
        )}
      </div>
    );
  }

  const statusMap = evaluationService.getCurrentStatusMap(boxer.id);

  const filtered = useMemo(() => {
    return skills.filter((s) => {
      if (domainFilter !== 'all' && s.domain !== domainFilter) return false;
      if (query && !s.name.toLowerCase().includes(query.toLowerCase())) return false;
      return true;
    });
  }, [skills, query, domainFilter]);

  function handleSave(skillId: string, status: EvaluationStatus, mastery: MasteryLevel | null, comment: string) {
    addEvaluation({ boxerId: boxer!.id, skillId, status, mastery, comment, coach: coachName });
  }

  return (
    <div className="px-4 py-4">
      <button
        onClick={() => onNavigate({ name: 'evaluate' })}
        className="text-xs font-semibold text-red-500 mb-3"
      >
        ← Changer de boxeur
      </button>

      <div className="bg-zinc-900 border border-zinc-800 rounded-xl px-3.5 py-3 mb-4">
        <p className="font-semibold text-zinc-100">
          {boxer.firstName} {boxer.lastName}
        </p>
        <p className="text-xs text-zinc-500">{boxer.level}</p>
      </div>

      <div className="relative mb-3">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Rechercher une compétence..."
          className="w-full bg-zinc-900 border border-zinc-800 rounded-xl pl-9 pr-3 py-3 text-sm text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:border-red-600"
        />
      </div>

      <div className="flex gap-2 overflow-x-auto pb-3 mb-1 -mx-4 px-4 no-scrollbar">
        <FilterChip active={domainFilter === 'all'} onClick={() => setDomainFilter('all')} label="Tous" />
        {SKILL_DOMAINS.map((d) => (
          <FilterChip key={d} active={domainFilter === d} onClick={() => setDomainFilter(d)} label={d} />
        ))}
      </div>

      <div className="space-y-3">
        {filtered.map((skill) => (
          <QuickEvalCard
            key={skill.id}
            skill={skill}
            currentStatus={statusMap.get(skill.id)?.status ?? 'Non évaluée'}
            onSave={(status, mastery, comment) => handleSave(skill.id, status, mastery, comment)}
          />
        ))}
      </div>
    </div>
  );
}

function FilterChip({ active, onClick, label }: { active: boolean; onClick: () => void; label: string }) {
  return (
    <button
      onClick={onClick}
      className={`shrink-0 text-xs font-medium px-3 py-2 rounded-lg whitespace-nowrap border ${
        active ? 'bg-red-600 border-red-600 text-white' : 'bg-zinc-900 border-zinc-800 text-zinc-400'
      }`}
    >
      {label}
    </button>
  );
}
