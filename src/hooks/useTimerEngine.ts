import { useCallback, useEffect, useRef, useState } from 'react';
import type { TimerConfig, TimerPhase, TimerState } from '../types/timer';
import { buildTimerSequence, type TimerStep } from '../services/timerSequence';
import { timerSounds, vibrate } from '../services/timerSounds';

const LAST_SECONDS_WARNING = 3;

function idleState(config: TimerConfig): TimerState {
  return {
    phase: 'idle',
    running: false,
    remainingSeconds: config.workSeconds,
    currentRound: 1,
    currentSet: 1,
    totalRounds: config.rounds,
    totalSets: config.sets,
  };
}

export function useTimerEngine(config: TimerConfig, settings: { soundEnabled: boolean; vibrationEnabled: boolean }) {
  const sequenceRef = useRef<TimerStep[]>(buildTimerSequence(config));
  const stepIndexRef = useRef(0);
  const endTimestampRef = useRef<number | null>(null);
  const rafRef = useRef<number | null>(null);
  const lastWarnedSecondRef = useRef<number | null>(null);

  const [state, setState] = useState<TimerState>(() => idleState(config));

  // Reconstruit la séquence si la config change (nouveau preset choisi)
  useEffect(() => {
    sequenceRef.current = buildTimerSequence(config);
    stepIndexRef.current = 0;
    setState(idleState(config));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [config.workSeconds, config.restSeconds, config.rounds, config.sets, config.restBetweenSetsSeconds]);

  const playSignal = useCallback(
    (phase: TimerPhase) => {
      if (settings.soundEnabled) {
        if (phase === 'work') timerSounds.startWork();
        else if (phase === 'rest' || phase === 'rest-between-sets') timerSounds.startRest();
        else if (phase === 'finished') timerSounds.endSession();
      }
      if (settings.vibrationEnabled) {
        if (phase === 'work') vibrate([100, 50, 100]);
        else if (phase === 'rest' || phase === 'rest-between-sets') vibrate(150);
        else if (phase === 'finished') vibrate([200, 100, 200, 100, 200]);
      }
    },
    [settings.soundEnabled, settings.vibrationEnabled]
  );

  const goToStep = useCallback(
    (index: number) => {
      const sequence = sequenceRef.current;
      if (index >= sequence.length) {
        if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
        playSignal('finished');
        setState((s) => ({ ...s, phase: 'finished', running: false, remainingSeconds: 0 }));
        return;
      }
      const step = sequence[index];
      stepIndexRef.current = index;
      endTimestampRef.current = Date.now() + step.durationSeconds * 1000;
      lastWarnedSecondRef.current = null;
      playSignal(step.phase);
      setState({
        phase: step.phase,
        running: true,
        remainingSeconds: step.durationSeconds,
        currentRound: step.round,
        currentSet: step.set,
        totalRounds: config.rounds,
        totalSets: config.sets,
      });
    },
    [config.rounds, config.sets, playSignal]
  );

  const tick = useCallback(() => {
    if (endTimestampRef.current === null) return;
    const remainingMs = endTimestampRef.current - Date.now();
    const remainingSeconds = Math.max(0, Math.ceil(remainingMs / 1000));

    if (
      remainingSeconds <= LAST_SECONDS_WARNING &&
      remainingSeconds > 0 &&
      lastWarnedSecondRef.current !== remainingSeconds
    ) {
      lastWarnedSecondRef.current = remainingSeconds;
      if (settings.soundEnabled) timerSounds.lastSeconds();
      if (settings.vibrationEnabled) vibrate(60);
    }

    if (remainingMs <= 0) {
      goToStep(stepIndexRef.current + 1);
    } else {
      setState((s) => (s.remainingSeconds === remainingSeconds ? s : { ...s, remainingSeconds }));
    }
    rafRef.current = requestAnimationFrame(tick);
  }, [goToStep, settings.soundEnabled, settings.vibrationEnabled]);

  const stop = useCallback(() => {
    if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    rafRef.current = null;
    endTimestampRef.current = null;
    stepIndexRef.current = 0;
    lastWarnedSecondRef.current = null;
    setState(idleState(config));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [config]);

  const start = useCallback(() => {
    timerSounds.unlock(); // débloque l'audio sur le geste utilisateur (iOS/Safari)
    if (state.phase === 'idle' || state.phase === 'finished') {
      goToStep(0);
    } else {
      // reprise après pause : recalcule l'échéance à partir du temps restant affiché
      endTimestampRef.current = Date.now() + state.remainingSeconds * 1000;
      setState((s) => ({ ...s, running: true }));
    }
    rafRef.current = requestAnimationFrame(tick);
  }, [state.phase, state.remainingSeconds, goToStep, tick]);

  const pause = useCallback(() => {
    if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    rafRef.current = null;
    setState((s) => ({ ...s, running: false }));
  }, []);

  const skipToNext = useCallback(() => {
    if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    goToStep(stepIndexRef.current + 1);
    rafRef.current = requestAnimationFrame(tick);
  }, [goToStep, tick]);

  useEffect(() => {
    return () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return {
    state,
    totalSteps: sequenceRef.current.length,
    currentStepIndex: stepIndexRef.current,
    start,
    pause,
    stop,
    skipToNext,
  };
}
