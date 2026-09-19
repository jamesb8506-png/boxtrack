import type { TimerState } from '../../types/timer';

const PHASE_LABELS: Record<TimerState['phase'], string> = {
  idle: 'Prêt',
  countdown: 'Prêt',
  work: 'Travail',
  rest: 'Repos',
  'rest-between-sets': 'Récupération',
  finished: 'Terminé',
};

function formatTime(totalSeconds: number): string {
  const m = Math.floor(totalSeconds / 60);
  const s = totalSeconds % 60;
  return `${m}:${String(s).padStart(2, '0')}`;
}

export function TimerDisplay({ state, timerName }: { state: TimerState; timerName: string }) {
  const isWork = state.phase === 'work';
  const isRest = state.phase === 'rest' || state.phase === 'rest-between-sets';
  const isFinished = state.phase === 'finished';

  return (
    <div className="flex flex-col items-center justify-center py-8">
      <p className="text-sm text-zinc-500 font-medium mb-1">{timerName}</p>

      <div
        className={`font-display text-8xl font-semibold tabular-nums tracking-tight ${
          isWork ? 'text-gold' : isRest ? 'text-orange-400' : isFinished ? 'text-emerald-400' : 'text-zinc-100'
        }`}
      >
        {formatTime(state.remainingSeconds)}
      </div>

      <div
        className={`mt-3 px-4 py-1.5 rounded-full font-display font-semibold text-sm tracking-wide ${
          isWork
            ? 'bg-gold/15 text-gold'
            : isRest
              ? 'bg-orange-950 text-orange-400'
              : isFinished
                ? 'bg-emerald-950 text-emerald-400'
                : 'bg-zinc-800 text-zinc-300'
        }`}
      >
        {PHASE_LABELS[state.phase]}
      </div>

      {!isFinished && (
        <p className="text-zinc-500 text-sm mt-3">
          {state.totalSets > 1 ? `Série ${state.currentSet}/${state.totalSets} · ` : ''}
          Round {state.currentRound}/{state.totalRounds}
        </p>
      )}
    </div>
  );
}
