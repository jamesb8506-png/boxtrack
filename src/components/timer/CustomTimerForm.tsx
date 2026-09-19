import { useState, type FormEvent } from 'react';
import type { TimerConfig } from '../../types/timer';

const inputClass =
  'w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3.5 py-3 text-zinc-100 text-base placeholder:text-zinc-600 focus:outline-none focus:border-gold';
const labelClass = 'block text-sm font-medium text-zinc-400 mb-1.5';

export function CustomTimerForm({
  onSubmit,
  onCancel,
}: {
  onSubmit: (config: TimerConfig, save: boolean) => void;
  onCancel: () => void;
}) {
  const [name, setName] = useState('Mon entraînement');
  const [workSeconds, setWorkSeconds] = useState('120');
  const [restSeconds, setRestSeconds] = useState('60');
  const [rounds, setRounds] = useState('6');
  const [sets, setSets] = useState('1');
  const [restBetweenSets, setRestBetweenSets] = useState('120');
  const [error, setError] = useState('');

  function toPositiveInt(v: string): number | null {
    const n = Number(v);
    if (!Number.isFinite(n) || n <= 0 || !Number.isInteger(n)) return null;
    return n;
  }

  function buildConfig(): TimerConfig | null {
    const w = toPositiveInt(workSeconds);
    const r = toPositiveInt(restSeconds.trim() === '' ? '0' : restSeconds);
    const rd = toPositiveInt(rounds);
    const st = toPositiveInt(sets);
    const rbs = toPositiveInt(restBetweenSets.trim() === '' ? '0' : restBetweenSets);

    if (!w || rd === null || st === null) {
      setError('Travail, rounds et séries doivent être des nombres entiers positifs.');
      return null;
    }
    return {
      name: name.trim() || 'Mon entraînement',
      workSeconds: w,
      restSeconds: r ?? 0,
      rounds: rd,
      sets: st,
      restBetweenSetsSeconds: rbs ?? 0,
      category: 'personnalise',
    };
  }

  function handleSubmit(e: FormEvent, save: boolean) {
    e.preventDefault();
    const config = buildConfig();
    if (!config) return;
    setError('');
    onSubmit(config, save);
  }

  return (
    <form className="space-y-4">
      <div>
        <label className={labelClass}>Nom</label>
        <input className={inputClass} value={name} onChange={(e) => setName(e.target.value)} placeholder="Mon entraînement" />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className={labelClass}>Travail (secondes) *</label>
          <input className={inputClass} value={workSeconds} onChange={(e) => setWorkSeconds(e.target.value)} inputMode="numeric" />
        </div>
        <div>
          <label className={labelClass}>Récupération (secondes)</label>
          <input className={inputClass} value={restSeconds} onChange={(e) => setRestSeconds(e.target.value)} inputMode="numeric" />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className={labelClass}>Rounds *</label>
          <input className={inputClass} value={rounds} onChange={(e) => setRounds(e.target.value)} inputMode="numeric" />
        </div>
        <div>
          <label className={labelClass}>Séries *</label>
          <input className={inputClass} value={sets} onChange={(e) => setSets(e.target.value)} inputMode="numeric" />
        </div>
      </div>

      {Number(sets) > 1 && (
        <div>
          <label className={labelClass}>Récupération entre séries (secondes)</label>
          <input
            className={inputClass}
            value={restBetweenSets}
            onChange={(e) => setRestBetweenSets(e.target.value)}
            inputMode="numeric"
          />
        </div>
      )}

      {error && <p className="text-red-500 text-xs">{error}</p>}

      <div className="flex flex-col gap-3 pt-2">
        <button onClick={(e) => handleSubmit(e, false)} className="w-full py-3.5 rounded-xl bg-gold text-black font-semibold text-sm active:bg-gold-dark">
          Démarrer sans enregistrer
        </button>
        <button
          onClick={(e) => handleSubmit(e, true)}
          className="w-full py-3.5 rounded-xl bg-zinc-800 text-zinc-100 font-semibold text-sm active:bg-zinc-700"
        >
          Enregistrer et démarrer
        </button>
        <button type="button" onClick={onCancel} className="w-full py-3 text-sm text-zinc-500 font-medium">
          Annuler
        </button>
      </div>
    </form>
  );
}
