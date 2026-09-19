import type { ObservationScore } from '../../types';
import { OBSERVATION_SCORE_LABELS } from '../../types';

const SCORES: ObservationScore[] = [1, 2, 3, 4, 5];

export function ScoreSelector({
  value,
  onChange,
}: {
  value: ObservationScore | null;
  onChange: (score: ObservationScore) => void;
}) {
  return (
    <div>
      <div className="flex gap-1.5 mb-1.5">
        {SCORES.map((s) => (
          <button
            key={s}
            onClick={() => onChange(s)}
            aria-label={`${s} — ${OBSERVATION_SCORE_LABELS[s]}`}
            className={`flex-1 h-11 rounded-lg font-display font-semibold text-base border ${
              value === s ? 'bg-gold border-gold text-black' : 'bg-zinc-800 border-zinc-700 text-zinc-300'
            }`}
          >
            {s}
          </button>
        ))}
      </div>
      <p className="text-xs text-zinc-500 text-center">{value ? OBSERVATION_SCORE_LABELS[value] : 'Sélectionnez une note'}</p>
    </div>
  );
}
