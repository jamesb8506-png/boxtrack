import type { TimerConfig } from '../types/timer';

export interface TimerStep {
  phase: 'work' | 'rest' | 'rest-between-sets';
  durationSeconds: number;
  round: number; // 1-indexé, dans le set courant
  set: number; // 1-indexé
}

/**
 * Construit la séquence complète d'un entraînement à partir de sa config.
 * Pure fonction, aucune dépendance au temps réel — donc entièrement
 * testable sans mock d'horloge.
 *
 * Règles :
 * - Pas de repos après le tout dernier round du tout dernier set.
 * - Repos normal entre les rounds d'un même set.
 * - Repos "entre séries" (plus long, configurable) entre deux sets.
 */
export function buildTimerSequence(config: TimerConfig): TimerStep[] {
  const steps: TimerStep[] = [];
  const sets = Math.max(1, config.sets);
  const rounds = Math.max(1, config.rounds);

  for (let s = 1; s <= sets; s++) {
    for (let r = 1; r <= rounds; r++) {
      steps.push({ phase: 'work', durationSeconds: config.workSeconds, round: r, set: s });

      const isLastRoundOfSet = r === rounds;
      const isLastSet = s === sets;

      if (!isLastRoundOfSet) {
        if (config.restSeconds > 0) {
          steps.push({ phase: 'rest', durationSeconds: config.restSeconds, round: r, set: s });
        }
      } else if (!isLastSet) {
        if (config.restBetweenSetsSeconds > 0) {
          steps.push({ phase: 'rest-between-sets', durationSeconds: config.restBetweenSetsSeconds, round: r, set: s });
        }
      }
      // dernier round du dernier set : aucun repos ajouté, l'entraînement se termine
    }
  }

  return steps;
}

export function totalDurationSeconds(config: TimerConfig): number {
  return buildTimerSequence(config).reduce((sum, step) => sum + step.durationSeconds, 0);
}
