import { ChevronRight, User } from 'lucide-react';
import type { Boxer } from '../../types';
import { calculateAge } from '../../utils/age';

export function BoxerCard({ boxer, progressRate, onClick }: { boxer: Boxer; progressRate?: number; onClick: () => void }) {
  const age = calculateAge(boxer.birthDate);

  return (
    <button
      onClick={onClick}
      className="w-full flex items-center gap-3 p-3.5 bg-zinc-900 rounded-2xl active:bg-zinc-800 text-left border border-zinc-800"
    >
      <div className="w-12 h-12 rounded-full bg-zinc-800 flex items-center justify-center shrink-0 overflow-hidden">
        {boxer.photo ? (
          <img src={boxer.photo} alt="" className="w-full h-full object-cover" />
        ) : (
          <User size={20} className="text-zinc-500" />
        )}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <p className="font-semibold text-zinc-100 truncate">
            {boxer.firstName} {boxer.lastName}
          </p>
          {!boxer.active && (
            <span className="text-[10px] font-medium px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-500 shrink-0">
              Inactif
            </span>
          )}
        </div>
        <p className="text-sm text-zinc-500 truncate">
          {age} ans · {boxer.level} {boxer.club && `· ${boxer.club}`}
        </p>
        {progressRate !== undefined && (
          <div className="mt-1.5 h-1.5 bg-zinc-800 rounded-full overflow-hidden max-w-[160px]">
            <div className="h-full bg-red-600 rounded-full" style={{ width: `${Math.round(progressRate * 100)}%` }} />
          </div>
        )}
      </div>
      <ChevronRight size={18} className="text-zinc-600 shrink-0" />
    </button>
  );
}
