import { ChevronRight } from 'lucide-react';
import type { Skill, EvaluationStatus } from '../../types';
import { StatusBadge } from '../ui/StatusBadge';

export function SkillCard({
  skill,
  status,
  onClick,
}: {
  skill: Skill;
  status: EvaluationStatus;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="w-full flex items-center gap-3 p-3.5 bg-zinc-900 rounded-2xl active:bg-zinc-800 text-left border border-zinc-800"
    >
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-zinc-100 truncate">{skill.name}</p>
        <p className="text-xs text-zinc-500 truncate mb-1.5">{skill.domain}</p>
        <StatusBadge status={status} size="sm" />
      </div>
      <ChevronRight size={18} className="text-zinc-600 shrink-0" />
    </button>
  );
}
