import { Circle, XCircle, CheckCircle2 } from 'lucide-react';
import type { EvaluationStatus } from '../../types';

const CONFIG: Record<EvaluationStatus, { icon: typeof Circle; className: string; label: string }> = {
  'Non évaluée': {
    icon: Circle,
    className: 'bg-zinc-800 text-zinc-400 border-zinc-700',
    label: 'Non évaluée',
  },
  'Non validée': {
    icon: XCircle,
    className: 'bg-amber-950 text-amber-400 border-amber-800',
    label: 'Non validée',
  },
  Validée: {
    icon: CheckCircle2,
    className: 'bg-emerald-950 text-emerald-400 border-emerald-800',
    label: 'Validée',
  },
};

export function StatusBadge({ status, size = 'md' }: { status: EvaluationStatus; size?: 'sm' | 'md' }) {
  const { icon: Icon, className, label } = CONFIG[status];
  const sizeClasses = size === 'sm' ? 'text-xs px-2 py-0.5 gap-1' : 'text-sm px-2.5 py-1 gap-1.5';
  const iconSize = size === 'sm' ? 12 : 14;

  return (
    <span
      className={`inline-flex items-center rounded-full border font-medium whitespace-nowrap ${sizeClasses} ${className}`}
    >
      <Icon size={iconSize} strokeWidth={2.5} />
      {label}
    </span>
  );
}
