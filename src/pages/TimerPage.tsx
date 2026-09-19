import { useState, useCallback } from 'react';
import { PresetPicker } from '../components/timer/PresetPicker';
import { CustomTimerForm } from '../components/timer/CustomTimerForm';
import { TimerDisplay } from '../components/timer/TimerDisplay';
import { TimerControls } from '../components/timer/TimerControls';
import { TimerSettingsToggle } from '../components/timer/TimerSettingsToggle';
import { useTimerEngine } from '../hooks/useTimerEngine';
import { useWakeLock } from '../hooks/useWakeLock';
import { customPresetService, timerSettingsService } from '../services/timerSettingsService';
import type { TimerConfig, TimerPreset, TimerSettings } from '../types/timer';

type Mode = 'select' | 'custom-form' | 'running';

function presetToConfig(p: TimerPreset): TimerConfig {
  return {
    name: p.name,
    workSeconds: p.workSeconds,
    restSeconds: p.restSeconds,
    rounds: p.rounds,
    sets: p.sets,
    restBetweenSetsSeconds: p.restBetweenSetsSeconds,
    category: p.category,
  };
}

export function TimerPage() {
  const [mode, setMode] = useState<Mode>('select');
  const [config, setConfig] = useState<TimerConfig | null>(null);
  const [customPresets, setCustomPresets] = useState<TimerPreset[]>(() => customPresetService.getAll());
  const [settings, setSettings] = useState<TimerSettings>(() => timerSettingsService.get());

  const engine = useTimerEngine(
    config ?? { name: '', workSeconds: 60, restSeconds: 60, rounds: 1, sets: 1, restBetweenSetsSeconds: 0, category: 'boxe' },
    settings
  );
  useWakeLock(engine.state.running);

  const handleSelectPreset = useCallback((p: TimerPreset) => {
    setConfig(presetToConfig(p));
    setMode('running');
  }, []);

  const handleCustomSubmit = useCallback((newConfig: TimerConfig, save: boolean) => {
    if (save) {
      const saved = customPresetService.save(newConfig);
      setCustomPresets(customPresetService.getAll());
      setConfig(presetToConfig(saved));
    } else {
      setConfig(newConfig);
    }
    setMode('running');
  }, []);

  const handleDeleteCustom = useCallback((id: string) => {
    customPresetService.remove(id);
    setCustomPresets(customPresetService.getAll());
  }, []);

  const handleSettingsChange = useCallback((patch: Partial<TimerSettings>) => {
    const next = timerSettingsService.update(patch);
    setSettings(next);
  }, []);

  const handleStop = useCallback(() => {
    engine.stop();
    setMode('select');
  }, [engine]);

  if (mode === 'custom-form') {
    return (
      <div className="px-4 py-4">
        <CustomTimerForm onSubmit={handleCustomSubmit} onCancel={() => setMode('select')} />
      </div>
    );
  }

  if (mode === 'running' && config) {
    return (
      <div className="px-4 py-4 flex flex-col min-h-[calc(100vh-64px)]">
        <div className="flex-1 flex flex-col justify-center">
          <TimerDisplay state={engine.state} timerName={config.name} />
        </div>
        <div className="space-y-4 pb-4">
          <TimerControls state={engine.state} onStart={engine.start} onPause={engine.pause} onStop={handleStop} onSkip={engine.skipToNext} />
          <TimerSettingsToggle settings={settings} onChange={handleSettingsChange} />
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 py-4">
      <PresetPicker
        customPresets={customPresets}
        onSelect={handleSelectPreset}
        onCreateCustom={() => setMode('custom-form')}
        onDeleteCustom={handleDeleteCustom}
      />
    </div>
  );
}
