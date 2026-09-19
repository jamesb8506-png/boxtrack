import type { TimerPreset } from '../../types/timer';

function preset(
  id: string,
  name: string,
  workSeconds: number,
  restSeconds: number,
  rounds: number,
  category: TimerPreset['category']
): TimerPreset {
  return {
    id,
    name,
    workSeconds,
    restSeconds,
    rounds,
    sets: 1,
    restBetweenSetsSeconds: 0,
    category,
    builtIn: true,
  };
}

// ------------------------------------------------------------
// Boxe — rounds classiques, récupération standard 1 min
// ------------------------------------------------------------
export const boxingPresets: TimerPreset[] = [
  preset('boxe-3x1', '3 × 1 min', 60, 60, 3, 'boxe'),
  preset('boxe-3x1-30', '3 × 1 min 30', 90, 60, 3, 'boxe'),
  preset('boxe-3x2', '3 × 2 min', 120, 60, 3, 'boxe'),
  preset('boxe-4x2', '4 × 2 min', 120, 60, 4, 'boxe'),
  preset('boxe-6x2', '6 × 2 min', 120, 60, 6, 'boxe'),
  preset('boxe-8x2', '8 × 2 min', 120, 60, 8, 'boxe'),
  preset('boxe-10x2', '10 × 2 min', 120, 60, 10, 'boxe'),
];

// ------------------------------------------------------------
// Fractionné — 8 rounds par défaut, modifiable par le coach
// ------------------------------------------------------------
export const fractionnePresets: TimerPreset[] = [
  preset('frac-20-20', '20 / 20', 20, 20, 8, 'fractionne'),
  preset('frac-30-30', '30 / 30', 30, 30, 8, 'fractionne'),
  preset('frac-30-15', '30 / 15', 30, 15, 8, 'fractionne'),
  preset('frac-40-20', '40 / 20', 40, 20, 8, 'fractionne'),
  preset('frac-60-30', '1 min / 30 s', 60, 30, 8, 'fractionne'),
  preset('frac-60-60', '1 min / 1 min', 60, 60, 8, 'fractionne'),
];

// ------------------------------------------------------------
// Tabata
// ------------------------------------------------------------
export const tabataPresets: TimerPreset[] = [preset('tabata-20-10', 'Tabata 20/10 × 8', 20, 10, 8, 'tabata')];

// ------------------------------------------------------------
// Modes rapides — types d'exercice courants
// ------------------------------------------------------------
export const quickModePresets: TimerPreset[] = [
  preset('rapide-corde', 'Corde', 120, 60, 4, 'rapide'),
  preset('rapide-shadow', 'Shadow', 180, 60, 4, 'rapide'),
  preset('rapide-sac', 'Sac', 120, 60, 6, 'rapide'),
  preset('rapide-pattes-ours', "Pattes d'ours", 180, 60, 4, 'rapide'),
  preset('rapide-assaut', 'Assaut', 120, 60, 3, 'rapide'),
];

export const allBuiltInPresets: TimerPreset[] = [
  ...boxingPresets,
  ...fractionnePresets,
  ...tabataPresets,
  ...quickModePresets,
];

export function getPresetById(id: string): TimerPreset | undefined {
  return allBuiltInPresets.find((p) => p.id === id);
}
