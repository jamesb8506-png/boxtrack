/**
 * Génère les signaux sonores du timer via l'API Web Audio — aucun fichier
 * audio à charger, donc aucun poids ajouté au bundle (voir cahier des
 * charges section 33 : éviter les composants lourds).
 *
 * Un seul AudioContext est réutilisé pour tout le cycle de vie du timer.
 * Sur iOS/Safari, l'AudioContext doit être débloqué par une interaction
 * utilisateur (le bouton "Démarrer" du timer sert de déblocage).
 */
let audioCtx: AudioContext | null = null;

function getContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  if (!AudioContextClass) return null;
  if (!audioCtx) {
    try {
      audioCtx = new AudioContextClass();
    } catch {
      return null;
    }
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume().catch(() => {});
  }
  return audioCtx;
}

function beep(frequency: number, durationMs: number, delayMs = 0, volume = 0.3): void {
  const ctx = getContext();
  if (!ctx) return;
  try {
    const oscillator = ctx.createOscillator();
    const gain = ctx.createGain();
    oscillator.type = 'sine';
    oscillator.frequency.value = frequency;
    gain.gain.value = volume;
    oscillator.connect(gain);
    gain.connect(ctx.destination);
    const startAt = ctx.currentTime + delayMs / 1000;
    const stopAt = startAt + durationMs / 1000;
    // Éviter le clic audio : montée/descente rapide du volume
    gain.gain.setValueAtTime(0, startAt);
    gain.gain.linearRampToValueAtTime(volume, startAt + 0.01);
    gain.gain.linearRampToValueAtTime(0, stopAt);
    oscillator.start(startAt);
    oscillator.stop(stopAt + 0.02);
  } catch {
    // Silencieux : un son manqué ne doit jamais interrompre le timer
  }
}

export const timerSounds = {
  /** Débloque l'AudioContext — à appeler depuis le clic "Démarrer". */
  unlock(): void {
    getContext();
  },
  startWork(): void {
    beep(880, 150);
    beep(880, 150, 200);
  },
  startRest(): void {
    beep(440, 250);
  },
  lastSeconds(): void {
    beep(660, 100);
  },
  endSession(): void {
    beep(880, 150, 0);
    beep(880, 150, 200);
    beep(1046, 300, 400);
  },
};

export function vibrate(pattern: number | number[]): void {
  if (typeof navigator === 'undefined' || !navigator.vibrate) return;
  try {
    navigator.vibrate(pattern);
  } catch {
    // Vibration non supportée : ignoré silencieusement
  }
}
