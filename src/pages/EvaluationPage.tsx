import { useState, useMemo } from 'react';
import { Search, Users } from 'lucide-react';
import { useAppData } from '../contexts/AppDataContext';
import { evaluationService } from '../services/evaluationService';
import { observationService } from '../services/observationService';
import { SKILL_DOMAINS } from '../types';
import type { SkillDomain, MasteryLevel, EvaluationStatus, ObservationScore } from '../types';
import { QuickEvalCard } from '../components/evaluation/QuickEvalCard';
import { ObservationDomainCard } from '../components/observation/ObservationDomainCard';
import { BoxerCard } from '../components/boxer/BoxerCard';
import { EmptyState } from '../components/ui/EmptyState';
import { FilterSheet, FilterButton } from '../components/ui/FilterSheet';
import { computeBoxerProgress } from '../services/progressService';
import type { Route } from '../types/route';

type EvalMode = 'guide' | 'skills';

export function EvaluationPage({
  boxerId,
  onNavigate,
}: {
  boxerId?: string;
  onNavigate: (r: Route) => void;
}) {
  const { boxers, skills, domains, addEvaluation, addObservation } = useAppData();
  const [mode, setMode] = useState<EvalMode>('guide');
  const [query, setQuery] = useState('');
  const [domainFilter, setDomainFilter] = useState<SkillDomain | 'all'>('all');
  const [domainSheetOpen, setDomainSheetOpen] = useState(false);
  const coachName = 'Coach'; // Nom du coach : personnalisable dans Réglages (V+)

  const boxer = boxerId ? boxers.find((b) => b.id === boxerId) : null;

  // Étape 1 : pas de boxeur sélectionné → choisir un boxeur
  if (!boxer) {
    const activeBoxers = boxers.filter((b) => b.active);
    return (
      <div className="px-4 py-4">
        <p className="text-sm text-zinc-500 mb-4">Sélectionnez un boxeur pour démarrer l'évaluation.</p>
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
  const observationMap = observationService.getCurrentMap(boxer.id);

  const filteredSkills = useMemo(() => {
    return skills.filter((s) => {
      if (domainFilter !== 'all' && s.domain !== domainFilter) return false;
      if (query && !s.name.toLowerCase().includes(query.toLowerCase())) return false;
      return true;
    });
  }, [skills, query, domainFilter]);

  function handleSaveSkill(skillId: string, status: EvaluationStatus, mastery: MasteryLevel | null, comment: string) {
    addEvaluation({ boxerId: boxer!.id, skillId, status, mastery, comment, coach: coachName });
  }

  function handleSaveObservation(domainId: string, score: ObservationScore, comment: string) {
    addObservation({ boxerId: boxer!.id, domainId, score, comment, coach: coachName });
  }

  const domainOptions = [
    { value: 'all' as const, label: 'Tous les domaines' },
    ...SKILL_DOMAINS.map((d) => ({ value: d, label: d })),
  ];

  return (
    <div className="px-4 py-4">
      <button onClick={() => onNavigate({ name: 'evaluate' })} className="text-xs font-semibold text-gold mb-3">
        ← Changer de boxeur
      </button>

      <div className="bg-zinc-900 border border-zinc-800 rounded-xl px-3.5 py-3 mb-4">
        <p className="font-semibold text-zinc-100">
          {boxer.firstName} {boxer.lastName}
        </p>
        <p className="text-xs text-zinc-500">{boxer.level}</p>
      </div>

      <div className="flex bg-zinc-900 border border-zinc-800 rounded-xl p-1 mb-4">
        <button
          onClick={() => setMode('guide')}
          className={`flex-1 py-2.5 rounded-lg text-sm font-semibold ${
            mode === 'guide' ? 'bg-gold text-black' : 'text-zinc-400'
          }`}
        >
          Guide d'observation
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

      {mode === 'guide' ? (
        <div className="space-y-3">
          {domains.map((domain) => (
            <ObservationDomainCard
              key={domain.id}
              domain={domain}
              lastScore={observationMap.get(domain.id)?.score ?? null}
              onSave={(score, comment) => handleSaveObservation(domain.id, score, comment)}
            />
          ))}
        </div>
      ) : (
        <>
          <div className="relative mb-3">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Rechercher une compétence..."
              className="w-full bg-zinc-900 border border-zinc-800 rounded-xl pl-9 pr-3 py-3 text-sm text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:border-gold"
            />
          </div>

          <div className="mb-4">
            <FilterButton
              label={domainFilter === 'all' ? 'Domaine : tous' : `Domaine : ${domainFilter}`}
              onClick={() => setDomainSheetOpen(true)}
            />
          </div>

          <div className="space-y-3">
            {filteredSkills.map((skill) => (
              <QuickEvalCard
                key={skill.id}
                skill={skill}
                currentStatus={statusMap.get(skill.id)?.status ?? 'Non évaluée'}
                onSave={(status, mastery, comment) => handleSaveSkill(skill.id, status, mastery, comment)}
              />
            ))}
          </div>

          <FilterSheet
            open={domainSheetOpen}
            title="Filtrer par domaine"
            options={domainOptions}
            value={domainFilter}
            onSelect={setDomainFilter}
            onClose={() => setDomainSheetOpen(false)}
          />
        </>
      )}
    </div>
  );
}
