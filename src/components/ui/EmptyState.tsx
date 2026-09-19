import type { ReactNode } from 'react';
import type { LucideIcon } from 'lucide-react';

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
}: {
  icon: LucideIcon;
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center text-center py-16 px-6">
      <div className="w-16 h-16 rounded-full bg-zinc-800/80 flex items-center justify-center mb-4">
        <Icon size={28} className="text-zinc-500" />
      </div>
      <h3 className="text-zinc-200 font-semibold text-base mb-1">{title}</h3>
      {description && <p className="text-zinc-500 text-sm max-w-xs">{description}</p>}
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}
