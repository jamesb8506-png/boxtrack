import { Play, Pause, Square, SkipForward, RotateCcw } from 'lucide-react';
import type { TimerState } from '../../types/timer';

export function TimerControls({
  state,
  onStart,
  onPause,
  onStop,
  onSkip,
}: {
  state: TimerState;
  onStart: () => void;
  onPause: () => void;
  onStop: () => void;
  onSkip: () => void;
}) {
  const idle = state.phase === 'idle';
  const finished = state.phase === 'finished';

  if (finished) {
    return (
      <button
        onClick={onStop}
        className="w-full flex items-center justify-center gap-2 py-4 rounded-2xl bg-gold text-black font-display font-semibold text-lg active:bg-gold-dark"
      >
        <RotateCcw size={22} /> Recommencer
      </button>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      <button
        onClick={state.running ? onPause : onStart}
        className="w-full flex items-center justify-center gap-2 py-5 rounded-2xl bg-gold text-black font-display font-semibold text-xl active:bg-gold-dark"
      >
        {state.running ? (
          <>
            <Pause size={26} /> Pause
          </>
        ) : (
          <>
            <Play size={26} /> {idle ? 'Démarrer' : 'Reprendre'}
          </>
        )}
      </button>

      <div className="flex gap-3">
        <button
          onClick={onSkip}
          disabled={idle}
          className="flex-1 flex items-center justify-center gap-2 py-4 rounded-xl bg-zinc-800 text-zinc-200 font-semibold text-sm disabled:opacity-40 active:bg-zinc-700"
        >
          <SkipForward size={18} /> Round suivant
        </button>
        <button
          onClick={onStop}
          disabled={idle}
          className="flex-1 flex items-center justify-center gap-2 py-4 rounded-xl bg-zinc-800 text-zinc-200 font-semibold text-sm disabled:opacity-40 active:bg-zinc-700"
        >
          <Square size={18} /> Arrêter
        </button>
      </div>
    </div>
  );
}
