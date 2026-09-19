import type { TimerConfig, TimerPreset, TimerSettings } from '../types/timer';
import { storage, STORAGE_KEYS } from './storage';
import { generateId } from '../utils/id';

const DEFAULT_SETTINGS: TimerSettings = { soundEnabled: true, vibrationEnabled: true };

export const timerSettingsService = {
  get(): TimerSettings {
    return storage.getItem<TimerSettings>(STORAGE_KEYS.SETTINGS) ?? DEFAULT_SETTINGS;
  },

  update(patch: Partial<TimerSettings>): TimerSettings {
    const next = { ...this.get(), ...patch };
    storage.setItem(STORAGE_KEYS.SETTINGS, next);
    return next;
  },
};

function readCustomPresets(): TimerPreset[] {
  return storage.getItem<TimerPreset[]>(STORAGE_KEYS.CUSTOM_TIMER_PRESETS) ?? [];
}

function writeCustomPresets(presets: TimerPreset[]): void {
  storage.setItem(STORAGE_KEYS.CUSTOM_TIMER_PRESETS, presets);
}

export const customPresetService = {
  getAll(): TimerPreset[] {
    return readCustomPresets();
  },

  save(config: TimerConfig): TimerPreset {
    const preset: TimerPreset = { ...config, id: generateId('preset'), builtIn: false, category: 'personnalise' };
    const all = readCustomPresets();
    all.push(preset);
    writeCustomPresets(all);
    return preset;
  },

  remove(id: string): void {
    writeCustomPresets(readCustomPresets().filter((p) => p.id !== id));
  },
};
