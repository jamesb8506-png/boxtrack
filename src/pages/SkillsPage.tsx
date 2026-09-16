import { useState, useMemo } from 'react';
import { Search, ListChecks } from 'lucide-react';
import { useAppData } from '../contexts/AppDataContext';
import { evaluationService } from '../services/evaluationService';
import { SKILL_DOMAINS } from '../types';
import type { EvaluationStatus, SkillDomain } from '../types';
import { SkillCard } from '../components/skill/SkillCard';
import { EmptyState } from '../components/ui/EmptyState';
import type { Route } from '../types/route';

const STATUS_FILTERS: EvaluationStatus[] = ['Non évaluée', 'Non validée', 'Validée'];

export function SkillsPage({
  boxerId,
  onNavigate,
}: {
  boxerId?: string;
  onNavigate: (r: Route) => void;
}) {
  const { skills } = useAppData();
  const [query, setQuery] = useState('');
  const [domainFilter, setDomainFilter] = useState<SkillDomain | 'all'>('all');
  const [statusFilter, setStatusFilter] = useState<EvaluationStatus | 'all'>('all');

  const statusMap = boxerId ? evaluationService.getCurrentStatusMap(boxerId) : new Map();

  const filtered = useMemo(() => {
    return skills.filter((s) => {
      if (domainFilter !== 'all' && s.domain !== domainFilter) return false;
      if (query && !s.name.toLowerCase().includes(query.toLowerCase())) return false;
      if (statusFilter !== 'all' && boxerId) {
        const status = statusMap.get(s.id)?.status ?? 'Non évaluée';
        if (status !== statusFilter) return false;
      }
      return true;
      // eslint-disable-next-line react-hooks/exhaustive-deps
    });
  }, [skills, query, domainFilter, statusFilter, boxerId]);

  return (
    <div className="px-4 py-4">
      <div className="relative mb-3">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Rechercher une compétence..."
          className="w-full bg-zinc-900 border border-zinc-800 rounded-xl pl-9 pr-3 py-3 text-sm text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:border-red-600"
        />
      </div>

      <div className="flex gap-2 overflow-x-auto pb-2 mb-2 -mx-4 px-4 no-scrollbar">
        <FilterChip active={domainFilter === 'all'} onClick={() => setDomainFilter('all')} label="Tous les domaines" />
        {SKILL_DOMAINS.map((d) => (
          <FilterChip key={d} active={domainFilter === d} onClick={() => setDomainFilter(d)} label={d} />
        ))}
      </div>

      {boxerId && (
        <div className="flex gap-2 overflow-x-auto pb-3 mb-1 -mx-4 px-4 no-scrollbar">
          <FilterChip active={statusFilter === 'all'} onClick={() => setStatusFilter('all')} label="Tous les statuts" />
          {STATUS_FILTERS.map((s) => (
            <FilterChip key={s} active={statusFilter === s} onClick={() => setStatusFilter(s)} label={s} />
          ))}
        </div>
      )}

      <p className="text-xs text-zinc-600 mb-3">{filtered.length} compétence(s)</p>

      {filtered.length === 0 ? (
        <EmptyState icon={ListChecks} title="Aucune compétence trouvée" description="Essayez d'ajuster vos filtres." />
      ) : (
        <div className="space-y-2.5">
          {filtered.map((skill) => (
            <SkillCard
              key={skill.id}
              skill={skill}
              status={boxerId ? statusMap.get(skill.id)?.status ?? 'Non évaluée' : 'Non évaluée'}
              onClick={() => onNavigate({ name: 'skill-detail', skillId: skill.id, boxerId })}
            />
          ))}
        </div>
      )}
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
