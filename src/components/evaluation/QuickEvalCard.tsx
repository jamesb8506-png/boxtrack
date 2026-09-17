import { useState } from 'react';
import { Check, X, MessageSquarePlus } from 'lucide-react';
import type { EvaluationStatus, MasteryLevel, Skill } from '../../types';
import { MASTERY_LEVELS } from '../../types';
import { StatusBadge } from '../ui/StatusBadge';

export function QuickEvalCard({
  skill,
  currentStatus,
  onSave,
}: {
  skill: Skill;
  currentStatus: EvaluationStatus;
  onSave: (status: EvaluationStatus, mastery: MasteryLevel | null, comment: string) => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const [mastery, setMastery] = useState<MasteryLevel | null>(null);
  const [comment, setComment] = useState('');
  const [saved, setSaved] = useState(false);

  function handleQuickSave(status: EvaluationStatus) {
    onSave(status, mastery, comment);
    setSaved(true);
    setTimeout(() => setSaved(false), 1200);
    setExpanded(false);
    setComment('');
  }

  return (
    <div className="bg-zinc-900 rounded-2xl border border-zinc-800 p-4">
      <div className="flex items-start justify-between gap-2 mb-3">
        <div className="min-w-0">
          <p className="font-semibold text-zinc-100 truncate">{skill.name}</p>
          <p className="text-xs text-zinc-500">{skill.domain}</p>
        </div>
        <StatusBadge status={saved ? currentStatus : currentStatus} size="sm" />
      </div>

      <div className="flex flex-col gap-2 mb-2">
        <button
          onClick={() => handleQuickSave('Validée')}
          className="w-full flex items-center justify-center gap-1.5 py-3.5 rounded-xl bg-emerald-950 text-emerald-400 font-semibold text-sm active:bg-emerald-900 border border-emerald-900"
        >
          <Check size={16} /> Validée
        </button>
        <button
          onClick={() => handleQuickSave('Non validée')}
          className="w-full flex items-center justify-center gap-1.5 py-3.5 rounded-xl bg-orange-950 text-orange-400 font-semibold text-sm active:bg-orange-900 border border-orange-900"
        >
          <X size={16} /> Non validée
        </button>
      </div>

      <button
        onClick={() => setExpanded((v) => !v)}
        className="w-full flex items-center justify-center gap-1.5 py-2 text-xs text-zinc-500 font-medium"
      >
        <MessageSquarePlus size={14} />
        {expanded ? 'Masquer les détails' : 'Ajouter niveau / commentaire'}
      </button>

      {expanded && (
        <div className="pt-2 space-y-3 border-t border-zinc-800 mt-1">
          <div>
            <label className="text-xs font-medium text-zinc-500 mb-1.5 block">Niveau de maîtrise</label>
            <div className="flex flex-wrap gap-1.5">
              {MASTERY_LEVELS.map((m) => (
                <button
                  key={m}
                  onClick={() => setMastery(mastery === m ? null : m)}
                  className={`text-xs px-2.5 py-1.5 rounded-lg border font-medium ${
                    mastery === m
                      ? 'bg-gold border-gold text-black'
                      : 'bg-zinc-800 border-zinc-700 text-zinc-400'
                  }`}
                >
                  {m}
                </button>
              ))}
            </div>
          </div>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Commentaire rapide..."
            className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:border-gold min-h-[60px] resize-none"
          />
        </div>
      )}
    </div>
  );
}
