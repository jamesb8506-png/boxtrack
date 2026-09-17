import { AlertCircle, History as HistoryIcon } from 'lucide-react';
import { getSkillById } from '../data/skills';
import { useAppData } from '../contexts/AppDataContext';
import { evaluationService } from '../services/evaluationService';
import { SkillDetail } from '../components/skill/SkillDetail';
import { StatusBadge } from '../components/ui/StatusBadge';
import { EmptyState } from '../components/ui/EmptyState';
import { formatDateTime } from '../utils/age';
import type { Route } from '../types/route';

export function SkillDetailPage({
  skillId,
  boxerId,
  onNavigate,
}: {
  skillId: string;
  boxerId?: string;
  onNavigate: (r: Route) => void;
}) {
  const { boxers } = useAppData();
  const skill = getSkillById(skillId);
  const boxer = boxerId ? boxers.find((b) => b.id === boxerId) : null;

  if (!skill) {
    return (
      <EmptyState
        icon={AlertCircle}
        title="Compétence introuvable"
        action={
          <button onClick={() => onNavigate({ name: 'skills' })} className="px-4 py-2.5 rounded-xl bg-zinc-800 text-zinc-200 text-sm font-semibold">
            Retour au référentiel
          </button>
        }
      />
    );
  }

  const history = boxer ? evaluationService.getHistory(boxer.id, skill.id) : [];

  return (
    <div>
      <div className="px-4 pt-4">
        <h2 className="font-display text-xl font-semibold tracking-wide text-zinc-100">{skill.name}</h2>
        {boxer && (
          <div className="flex items-center gap-2 mt-2">
            <span className="text-sm text-zinc-500">
              {boxer.firstName} {boxer.lastName}
            </span>
            <StatusBadge status={history[0]?.status ?? 'Non évaluée'} size="sm" />
          </div>
        )}
      </div>

      <SkillDetail skill={skill} />

      {boxer && (
        <div className="px-4 pb-6">
          <div className="flex items-center gap-2 mb-3">
            <HistoryIcon size={16} className="text-gold" />
            <h3 className="text-sm font-semibold text-zinc-300 uppercase tracking-wide">Historique pour ce boxeur</h3>
          </div>
          {history.length === 0 ? (
            <p className="text-sm text-zinc-600 italic">Jamais évaluée pour ce boxeur.</p>
          ) : (
            <div className="space-y-2">
              {history.map((ev) => (
                <div key={ev.id} className="bg-zinc-900 border border-zinc-800 rounded-xl px-3.5 py-3">
                  <div className="flex items-center justify-between mb-1">
                    <StatusBadge status={ev.status} size="sm" />
                    <span className="text-xs text-zinc-600">{formatDateTime(ev.date)}</span>
                  </div>
                  {ev.mastery && <p className="text-xs text-zinc-500 mt-1">Niveau : {ev.mastery}</p>}
                  {ev.comment && <p className="text-sm text-zinc-400 mt-1">{ev.comment}</p>}
                  {ev.coach && <p className="text-xs text-zinc-600 mt-1">Coach : {ev.coach}</p>}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
