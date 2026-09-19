import type { WeightEntry } from '../types';

export interface WeightStats {
  current: number | null;
  initial: number | null;
  totalVariationKg: number | null; // current - initial
  recentVariationKg: number | null; // current - avant-dernière pesée
  goalKg: number | null;
  distanceToGoalKg: number | null; // goal - current (négatif si déjà dépassé)
  entryCount: number;
}

/**
 * Calcule les statistiques de poids d'un boxeur à partir de son historique
 * complet (du plus ancien au plus récent, voir weightService.getForBoxerChronological)
 * et de son objectif éventuel.
 */
export function computeWeightStats(
  chronologicalEntries: WeightEntry[],
  goalKg: number | null
): WeightStats {
  const count = chronologicalEntries.length;

  if (count === 0) {
    return {
      current: null,
      initial: null,
      totalVariationKg: null,
      recentVariationKg: null,
      goalKg,
      distanceToGoalKg: null,
      entryCount: 0,
    };
  }

  const initial = chronologicalEntries[0].weightKg;
  const current = chronologicalEntries[count - 1].weightKg;
  const previous = count >= 2 ? chronologicalEntries[count - 2].weightKg : null;

  return {
    current,
    initial,
    totalVariationKg: round1(current - initial),
    recentVariationKg: previous !== null ? round1(current - previous) : null,
    goalKg,
    distanceToGoalKg: goalKg !== null ? round1(goalKg - current) : null,
    entryCount: count,
  };
}

function round1(n: number): number {
  return Math.round(n * 10) / 10;
}
