import { useState } from 'react';
import { Pencil, Trash2, ClipboardEdit, AlertCircle } from 'lucide-react';
import { useAppData } from '../contexts/AppDataContext';
import { useBoxerProgress } from '../hooks/useBoxerProgress';
import { weightService } from '../services/weightService';
import { calculateAge, formatDate } from '../utils/age';
import { ConfirmDialog } from '../components/ui/ConfirmDialog';
import { EmptyState } from '../components/ui/EmptyState';
import { WeightTrackerCard } from '../components/weight/WeightTrackerCard';
import type { Route } from '../types/route';

export function BoxerProfilePage({ boxerId, onNavigate }: { boxerId: string; onNavigate: (r: Route) => void }) {
  const { boxers, removeBoxer, addWeight } = useAppData();
  const boxer = boxers.find((b) => b.id === boxerId);
  const progress = useBoxerProgress(boxerId);
  const [confirmDelete, setConfirmDelete] = useState(false);

  if (!boxer) {
    return (
      <EmptyState
        icon={AlertCircle}
        title="Boxeur introuvable"
        description="Ce profil n'existe plus ou a été supprimé."
        action={
          <button onClick={() => onNavigate({ name: 'boxers' })} className="px-4 py-2.5 rounded-xl bg-zinc-800 text-zinc-200 text-sm font-semibold">
            Retour à la liste
          </button>
        }
      />
    );
  }

  const age = calculateAge(boxer.birthDate);
  const weightEntries = weightService.getForBoxerChronological(boxer.id);

  return (
    <div className="px-4 py-4">
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4 mb-4">
        <div className="flex items-start justify-between mb-3">
          <div>
            <h2 className="font-display text-xl font-semibold tracking-wide text-zinc-100">
              {boxer.firstName} {boxer.lastName}
            </h2>
            <p className="text-sm text-zinc-500">
              {age} ans · {boxer.sex === 'M' ? 'Masculin' : 'Féminin'} {boxer.weight ? `· ${boxer.weight} kg` : ''}
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => onNavigate({ name: 'boxer-form', boxerId: boxer.id })}
              className="w-9 h-9 flex items-center justify-center rounded-full bg-zinc-800 active:bg-zinc-700"
              aria-label="Modifier"
            >
              <Pencil size={16} className="text-zinc-300" />
            </button>
            <button
              onClick={() => setConfirmDelete(true)}
              className="w-9 h-9 flex items-center justify-center rounded-full bg-zinc-800 active:bg-zinc-700"
              aria-label="Supprimer"
            >
              <Trash2 size={16} className="text-red-500" />
            </button>
          </div>
        </div>

        <div className="flex flex-wrap gap-1.5 mb-3">
          <span className="text-xs px-2 py-1 rounded-md bg-zinc-800 text-zinc-400">{boxer.level}</span>
          {boxer.category && <span className="text-xs px-2 py-1 rounded-md bg-zinc-800 text-zinc-400">{boxer.category}</span>}
          {boxer.club && <span className="text-xs px-2 py-1 rounded-md bg-zinc-800 text-zinc-400">{boxer.club}</span>}
          {!boxer.active && <span className="text-xs px-2 py-1 rounded-md bg-zinc-800 text-zinc-500">Inactif</span>}
        </div>

        {boxer.notes && <p className="text-sm text-zinc-400 border-t border-zinc-800 pt-3">{boxer.notes}</p>}
        <p className="text-xs text-zinc-600 mt-2">Créé le {formatDate(boxer.createdAt)}</p>
      </div>

      <button
        onClick={() => onNavigate({ name: 'evaluate', boxerId: boxer.id })}
        className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl bg-gold text-black font-semibold text-sm mb-4 active:bg-gold-dark"
      >
        <ClipboardEdit size={18} /> Évaluer ce boxeur
      </button>

      <div className="mb-5">
        <WeightTrackerCard
          goalKg={boxer.weightGoalKg ?? null}
          entriesChronological={weightEntries}
          onAddWeight={(weightKg, date, comment) =>
            addWeight({ boxerId: boxer.id, weightKg, date: new Date(date).toISOString(), comment })
          }
        />
      </div>

      {progress && progress.totalSkills > 0 && (
        <>
          <div className="grid grid-cols-3 gap-2.5 mb-5">
            <StatBox label="Validées" value={progress.validated} color="text-emerald-400" />
            <StatBox label="Non validées" value={progress.notValidated} color="text-orange-400" />
            <StatBox label="Non évaluées" value={progress.notEvaluated} color="text-zinc-400" />
          </div>

          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4 mb-5">
            <div className="flex justify-between text-sm mb-1.5">
              <span className="text-zinc-400">Progression globale</span>
              <span className="font-display font-semibold text-gold">{Math.round(progress.progressRate * 100)}%</span>
            </div>
            <div className="h-2 bg-zinc-800 rounded-full overflow-hidden mb-3">
              <div className="h-full bg-gold rounded-full" style={{ width: `${progress.progressRate * 100}%` }} />
            </div>
            <div className="flex justify-between text-sm mb-1.5">
              <span className="text-zinc-400">Taux d'évaluation</span>
              <span className="font-display font-semibold text-zinc-100">{Math.round(progress.evaluationRate * 100)}%</span>
            </div>
            <div className="h-2 bg-zinc-800 rounded-full overflow-hidden">
              <div className="h-full bg-zinc-500 rounded-full" style={{ width: `${progress.evaluationRate * 100}%` }} />
            </div>
          </div>

          <h3 className="font-display text-base font-semibold tracking-wide text-zinc-100 mb-3">Progression par domaine</h3>
          <div className="space-y-2 mb-5">
            {progress.byDomain.map((d) => (
              <div key={d.domain} className="bg-zinc-900 border border-zinc-800 rounded-xl px-3.5 py-3">
                <div className="flex justify-between text-sm mb-1.5">
                  <span className="text-zinc-300">{d.domain}</span>
                  <span className="text-zinc-500">
                    {d.validated}/{d.total}
                  </span>
                </div>
                <div className="h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                  <div className="h-full bg-gold rounded-full" style={{ width: `${d.progressRate * 100}%` }} />
                </div>
              </div>
            ))}
          </div>

          {progress.priorities.length > 0 && (
            <>
              <h3 className="font-display text-base font-semibold tracking-wide text-zinc-100 mb-3">Priorités de travail</h3>
              <div className="space-y-2">
                {progress.priorities.slice(0, 6).map(({ skill, reason }) => (
                  <button
                    key={skill.id}
                    onClick={() => onNavigate({ name: 'skill-detail', skillId: skill.id, boxerId: boxer.id })}
                    className="w-full text-left bg-zinc-900 border border-zinc-800 rounded-xl px-3.5 py-3 active:bg-zinc-800"
                  >
                    <p className="text-sm font-semibold text-zinc-200">{skill.name}</p>
                    <p className="text-xs text-zinc-500">{reason}</p>
                  </button>
                ))}
              </div>
            </>
          )}
        </>
      )}

      <ConfirmDialog
        open={confirmDelete}
        title="Supprimer ce boxeur ?"
        message={`Toutes les données de ${boxer.firstName} ${boxer.lastName}, y compris son historique d'évaluations, seront définitivement supprimées.`}
        confirmLabel="Supprimer"
        onCancel={() => setConfirmDelete(false)}
        onConfirm={() => {
          removeBoxer(boxer.id);
          setConfirmDelete(false);
          onNavigate({ name: 'boxers' });
        }}
      />
    </div>
  );
}

function StatBox({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-3 text-center">
      <p className={`font-display text-2xl font-semibold ${color}`}>{value}</p>
      <p className="text-[11px] text-zinc-500 mt-0.5">{label}</p>
    </div>
  );
}
