import { useState, useMemo } from 'react';
import { Search, ListChecks } from 'lucide-react';
import { useAppData } from '../contexts/AppDataContext';
import { evaluationService } from '../services/evaluationService';
import { SKILL_DOMAINS } from '../types';
import type { EvaluationStatus, SkillDomain } from '../types';
import { SkillCard } from '../components/skill/SkillCard';
import { EmptyState } from '../components/ui/EmptyState';
import { FilterSheet, FilterButton } from '../components/ui/FilterSheet';
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
  const [domainSheetOpen, setDomainSheetOpen] = useState(false);
  const [statusSheetOpen, setStatusSheetOpen] = useState(false);

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

  const domainOptions = [
    { value: 'all' as const, label: 'Tous les domaines' },
    ...SKILL_DOMAINS.map((d) => ({ value: d, label: d })),
  ];
  const statusOptions = [
    { value: 'all' as const, label: 'Tous les statuts' },
    ...STATUS_FILTERS.map((s) => ({ value: s, label: s })),
  ];

  return (
    <div className="px-4 py-4">
      <div className="relative mb-3">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Rechercher une compétence..."
          className="w-full bg-zinc-900 border border-zinc-800 rounded-xl pl-9 pr-3 py-3 text-sm text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:border-gold"
        />
      </div>

      <div className="flex flex-col gap-2 mb-4">
        <FilterButton
          label={domainFilter === 'all' ? 'Domaine : tous' : `Domaine : ${domainFilter}`}
          onClick={() => setDomainSheetOpen(true)}
        />
        {boxerId && (
          <FilterButton
            label={statusFilter === 'all' ? 'Statut : tous' : `Statut : ${statusFilter}`}
            onClick={() => setStatusSheetOpen(true)}
          />
        )}
      </div>

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

      <FilterSheet
        open={domainSheetOpen}
        title="Filtrer par domaine"
        options={domainOptions}
        value={domainFilter}
        onSelect={setDomainFilter}
        onClose={() => setDomainSheetOpen(false)}
      />
      <FilterSheet
        open={statusSheetOpen}
        title="Filtrer par statut"
        options={statusOptions}
        value={statusFilter}
        onSelect={setStatusFilter}
        onClose={() => setStatusSheetOpen(false)}
      />
    </div>
  );
}
