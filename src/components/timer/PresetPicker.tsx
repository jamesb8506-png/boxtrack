import { Wand2, Trash2 } from 'lucide-react';
import type { TimerPreset } from '../../types/timer';
import { boxingPresets, fractionnePresets, tabataPresets, quickModePresets } from '../../data/timer/presets';

function formatPreset(p: TimerPreset): string {
  const parts = [`${p.rounds} rounds`, `${p.workSeconds}s travail`, `${p.restSeconds}s repos`];
  if (p.sets > 1) parts.push(`${p.sets} séries`);
  return parts.join(' · ');
}

function PresetGroup({
  title,
  presets,
  onSelect,
}: {
  title: string;
  presets: TimerPreset[];
  onSelect: (p: TimerPreset) => void;
}) {
  return (
    <div className="mb-5">
      <h3 className="font-display text-sm font-semibold tracking-wide text-zinc-400 uppercase mb-2 px-1">{title}</h3>
      <div className="flex flex-col gap-2">
        {presets.map((p) => (
          <button
            key={p.id}
            onClick={() => onSelect(p)}
            className="w-full text-left bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 active:bg-zinc-800"
          >
            <p className="font-semibold text-zinc-100">{p.name}</p>
            <p className="text-xs text-zinc-500 mt-0.5">{formatPreset(p)}</p>
          </button>
        ))}
      </div>
    </div>
  );
}

export function PresetPicker({
  customPresets,
  onSelect,
  onCreateCustom,
  onDeleteCustom,
}: {
  customPresets: TimerPreset[];
  onSelect: (p: TimerPreset) => void;
  onCreateCustom: () => void;
  onDeleteCustom: (id: string) => void;
}) {
  return (
    <div>
      <button
        onClick={onCreateCustom}
        className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl bg-gold text-black font-semibold text-sm mb-5 active:bg-gold-dark"
      >
        <Wand2 size={18} /> Créer mon entraînement
      </button>

      {customPresets.length > 0 && (
        <div className="mb-5">
          <h3 className="font-display text-sm font-semibold tracking-wide text-zinc-400 uppercase mb-2 px-1">
            Mes entraînements
          </h3>
          <div className="flex flex-col gap-2">
            {customPresets.map((p) => (
              <div key={p.id} className="flex items-center gap-2">
                <button
                  onClick={() => onSelect(p)}
                  className="flex-1 text-left bg-zinc-900 border border-gold/30 rounded-xl px-4 py-3 active:bg-zinc-800"
                >
                  <p className="font-semibold text-zinc-100">{p.name}</p>
                  <p className="text-xs text-zinc-500 mt-0.5">{formatPreset(p)}</p>
                </button>
                <button
                  onClick={() => onDeleteCustom(p.id)}
                  className="w-11 h-11 shrink-0 flex items-center justify-center rounded-xl bg-zinc-900 border border-zinc-800 active:bg-zinc-800"
                  aria-label="Supprimer"
                >
                  <Trash2 size={16} className="text-red-500" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      <PresetGroup title="Modes rapides" presets={quickModePresets} onSelect={onSelect} />
      <PresetGroup title="Boxe" presets={boxingPresets} onSelect={onSelect} />
      <PresetGroup title="Fractionné" presets={fractionnePresets} onSelect={onSelect} />
      <PresetGroup title="Tabata" presets={tabataPresets} onSelect={onSelect} />
    </div>
  );
}
