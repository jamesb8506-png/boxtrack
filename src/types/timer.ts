// ============================================================
// TIMER — types du module Entraînement
// ============================================================

export type TimerCategory = 'boxe' | 'fractionne' | 'tabata' | 'rapide' | 'personnalise';

export interface TimerConfig {
  name: string;
  workSeconds: number;
  restSeconds: number;
  rounds: number;
  sets: number; // "séries" — groupes de rounds séparés par une récupération plus longue
  restBetweenSetsSeconds: number;
  category: TimerCategory;
}

export interface TimerPreset extends TimerConfig {
  id: string;
  builtIn: boolean; // true = preset fourni par l'app, false = créé par le coach
}

export type TimerPhase = 'idle' | 'countdown' | 'work' | 'rest' | 'rest-between-sets' | 'finished';

export interface TimerState {
  phase: TimerPhase;
  running: boolean;
  remainingSeconds: number;
  currentRound: number; // 1-indexé
  currentSet: number; // 1-indexé
  totalRounds: number;
  totalSets: number;
}

export interface TimerSettings {
  soundEnabled: boolean;
  vibrationEnabled: boolean;
}
