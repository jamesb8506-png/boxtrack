import { Volume2, VolumeX, Vibrate } from 'lucide-react';
import type { TimerSettings } from '../../types/timer';

export function TimerSettingsToggle({
  settings,
  onChange,
}: {
  settings: TimerSettings;
  onChange: (patch: Partial<TimerSettings>) => void;
}) {
  return (
    <div className="flex gap-2">
      <button
        onClick={() => onChange({ soundEnabled: !settings.soundEnabled })}
        className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl border text-sm font-medium ${
          settings.soundEnabled ? 'bg-gold/15 border-gold/40 text-gold' : 'bg-zinc-900 border-zinc-800 text-zinc-500'
        }`}
      >
        {settings.soundEnabled ? <Volume2 size={16} /> : <VolumeX size={16} />}
        Son {settings.soundEnabled ? 'activé' : 'coupé'}
      </button>
      <button
        onClick={() => onChange({ vibrationEnabled: !settings.vibrationEnabled })}
        className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl border text-sm font-medium ${
          settings.vibrationEnabled ? 'bg-gold/15 border-gold/40 text-gold' : 'bg-zinc-900 border-zinc-800 text-zinc-500'
        }`}
      >
        <Vibrate size={16} />
        Vibration {settings.vibrationEnabled ? 'activée' : 'coupée'}
      </button>
    </div>
  );
}
