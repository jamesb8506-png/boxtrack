import { Users, TrendingUp, Plus, Timer as TimerIcon, ClipboardEdit } from 'lucide-react';
import { useAppData } from '../contexts/AppDataContext';
import { evaluationService } from '../services/evaluationService';
import { computeBoxerProgress } from '../services/progressService';
import { BoxerCard } from '../components/boxer/BoxerCard';
import { EmptyState } from '../components/ui/EmptyState';
import type { Route } from '../types/route';
import { formatDateTime } from '../utils/age';

export function HomePage({ onNavigate }: { onNavigate: (r: Route) => void }) {
  const { boxers, evaluations, skills } = useAppData();
  const activeBoxers = boxers.filter((b) => b.active);

  const boxersWithProgress = activeBoxers.map((b) => {
    const statusMap = evaluationService.getCurrentStatusMap(b.id);
    const progress = computeBoxerProgress(b.id, skills, statusMap);
    return { boxer: b, progress };
  });

  const avgProgress =
    boxersWithProgress.length > 0
      ? boxersWithProgress.reduce((sum, b) => sum + b.progress.progressRate, 0) / boxersWithProgress.length
      : 0;

  const recentEvals = evaluations.slice(0, 5);

  return (
    <div className="px-4 py-4">
      <div className="flex flex-col gap-3 mb-5">
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4">
          <div className="flex items-center gap-2 text-zinc-500 mb-1">
            <Users size={14} />
            <span className="text-xs font-medium">Boxeurs actifs</span>
          </div>
          <p className="font-display text-3xl font-semibold text-zinc-100">{activeBoxers.length}</p>
        </div>
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4">
          <div className="flex items-center gap-2 text-zinc-500 mb-1">
            <TrendingUp size={14} />
            <span className="text-xs font-medium">Progression moy.</span>
          </div>
          <p className="font-display text-3xl font-semibold text-gold">{Math.round(avgProgress * 100)}%</p>
        </div>
      </div>

      <div className="flex flex-col gap-2.5 mb-6">
        <button
          onClick={() => onNavigate({ name: 'timer' })}
          className="w-full flex items-center gap-3 bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3.5 active:bg-zinc-800"
        >
          <TimerIcon size={18} className="text-gold" />
          <span className="text-sm font-semibold text-zinc-100">Lancer le timer</span>
        </button>
        <button
          onClick={() => onNavigate({ name: 'evaluate' })}
          className="w-full flex items-center gap-3 bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3.5 active:bg-zinc-800"
        >
          <ClipboardEdit size={18} className="text-gold" />
          <span className="text-sm font-semibold text-zinc-100">Évaluation rapide</span>
        </button>
      </div>

      <div className="flex items-center justify-between mb-3">
        <h2 className="font-display text-base font-semibold tracking-wide text-zinc-100">Boxeurs</h2>
        <button
          onClick={() => onNavigate({ name: 'boxer-form' })}
          className="flex items-center gap-1 text-xs font-semibold text-gold"
        >
          <Plus size={14} /> Ajouter
        </button>
      </div>

      {boxersWithProgress.length === 0 ? (
        <EmptyState
          icon={Users}
          title="Aucun boxeur pour le moment"
          description="Créez votre premier boxeur pour commencer le suivi."
          action={
            <button
              onClick={() => onNavigate({ name: 'boxer-form' })}
              className="px-4 py-2.5 rounded-xl bg-gold text-black text-sm font-semibold"
            >
              Créer un boxeur
            </button>
          }
        />
      ) : (
        <div className="space-y-2.5 mb-6">
          {boxersWithProgress.slice(0, 5).map(({ boxer, progress }) => (
            <BoxerCard
              key={boxer.id}
              boxer={boxer}
              progressRate={progress.progressRate}
              onClick={() => onNavigate({ name: 'boxer-profile', boxerId: boxer.id })}
            />
          ))}
        </div>
      )}

      {recentEvals.length > 0 && (
        <>
          <h2 className="font-display text-base font-semibold tracking-wide text-zinc-100 mb-3">Dernières évaluations</h2>
          <div className="space-y-2">
            {recentEvals.map((ev) => {
              const boxer = boxers.find((b) => b.id === ev.boxerId);
              const skill = skills.find((s) => s.id === ev.skillId);
              if (!boxer || !skill) return null;
              return (
                <div key={ev.id} className="bg-zinc-900 border border-zinc-800 rounded-xl px-3.5 py-3">
                  <p className="text-sm text-zinc-200">
                    <span className="font-semibold">
                      {boxer.firstName} {boxer.lastName}
                    </span>{' '}
                    · {skill.name}
                  </p>
                  <p className="text-xs text-zinc-500 mt-0.5">
                    {ev.status} · {formatDateTime(ev.date)}
                  </p>
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
