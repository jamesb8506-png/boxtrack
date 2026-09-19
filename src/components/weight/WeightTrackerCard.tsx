import { useState } from 'react';
import { Scale, Plus, TrendingDown, TrendingUp, Minus, Target } from 'lucide-react';
import type { WeightEntry } from '../../types';
import { computeWeightStats } from '../../services/weightStatsService';
import { formatDate } from '../../utils/age';
import { AddWeightSheet } from './AddWeightSheet';

function VariationBadge({ value }: { value: number | null }) {
  if (value === null) return null;
  const Icon = value > 0 ? TrendingUp : value < 0 ? TrendingDown : Minus;
  const color = value === 0 ? 'text-zinc-400' : value < 0 ? 'text-emerald-400' : 'text-orange-400';
  return (
    <span className={`inline-flex items-center gap-1 text-xs font-medium ${color}`}>
      <Icon size={12} />
      {value > 0 ? '+' : ''}
      {value} kg
    </span>
  );
}

function MiniChart({ entries }: { entries: WeightEntry[] }) {
  const recent = entries.slice(-8); // du plus ancien au plus récent, 8 derniers max
  if (recent.length < 2) return null;

  const values = recent.map((e) => e.weightKg);
  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max - min || 1;

  return (
    <div className="flex items-end gap-1.5 h-16 mt-3">
      {recent.map((entry, i) => {
        const heightPct = 15 + ((entry.weightKg - min) / range) * 85;
        return (
          <div key={entry.id} className="flex-1 flex flex-col items-center gap-1">
            <div className="w-full flex items-end h-12">
              <div
                className="w-full bg-gold/70 rounded-t"
                style={{ height: `${heightPct}%` }}
                title={`${entry.weightKg} kg — ${formatDate(entry.date)}`}
              />
            </div>
            {i === recent.length - 1 && <div className="w-1.5 h-1.5 rounded-full bg-gold" />}
          </div>
        );
      })}
    </div>
  );
}

export function WeightTrackerCard({
  goalKg,
  entriesChronological,
  onAddWeight,
}: {
  goalKg: number | null;
  entriesChronological: WeightEntry[]; // du plus ancien au plus récent
  onAddWeight: (weightKg: number, date: string, comment: string) => void;
  }) {
  const [sheetOpen, setSheetOpen] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const stats = computeWeightStats(entriesChronological, goalKg);
  const recentDesc = [...entriesChronological].reverse();

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4">
      <div className="flex items-center justify-between mb-1">
        <div className="flex items-center gap-2">
          <Scale size={16} className="text-gold" />
          <h3 className="font-display text-base font-semibold tracking-wide text-zinc-100">Poids</h3>
        </div>
        <button
          onClick={() => setSheetOpen(true)}
          className="flex items-center gap-1 text-xs font-semibold text-gold"
          aria-label="Ajouter une pesée"
        >
          <Plus size={14} /> Pesée
        </button>
      </div>

      {stats.entryCount === 0 ? (
        <p className="text-sm text-zinc-500 mt-2">Aucune pesée enregistrée pour ce boxeur.</p>
      ) : (
        <>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="font-display text-3xl font-semibold text-zinc-100">{stats.current}</span>
            <span className="text-sm text-zinc-500">kg</span>
            <VariationBadge value={stats.recentVariationKg} />
          </div>

          {goalKg !== null && (
            <div className="flex items-center gap-1.5 mt-1.5">
              <Target size={12} className="text-zinc-500" />
              <span className="text-xs text-zinc-500">
                Objectif {goalKg} kg
                {stats.distanceToGoalKg !== null && (
                  <>
                    {' '}
                    ·{' '}
                    {Math.abs(stats.distanceToGoalKg) < 0.05
                      ? 'atteint'
                      : `${stats.distanceToGoalKg > 0 ? 'encore' : 'dépassé de'} ${Math.abs(stats.distanceToGoalKg)} kg`}
                  </>
                )}
              </span>
            </div>
          )}

          <MiniChart entries={entriesChronological} />

          <div className="grid grid-cols-2 gap-3 mt-3 pt-3 border-t border-zinc-800 text-xs">
            <div>
              <span className="text-zinc-500">Poids initial</span>
              <p className="text-zinc-200 font-medium">{stats.initial} kg</p>
            </div>
            <div>
              <span className="text-zinc-500">Variation totale</span>
              <p className="text-zinc-200 font-medium">
                {stats.totalVariationKg !== null && stats.totalVariationKg > 0 ? '+' : ''}
                {stats.totalVariationKg} kg
              </p>
            </div>
          </div>

          <button onClick={() => setShowHistory((v) => !v)} className="w-full text-center text-xs text-zinc-500 font-medium mt-3">
            {showHistory ? 'Masquer l\u2019historique' : `Voir l'historique (${stats.entryCount})`}
          </button>

          {showHistory && (
            <div className="mt-2 space-y-1.5">
              {recentDesc.map((entry) => (
                <div key={entry.id} className="flex items-center justify-between text-xs py-1.5 border-b border-zinc-900">
                  <span className="text-zinc-500">{formatDate(entry.date)}</span>
                  <span className="text-zinc-300 font-medium">{entry.weightKg} kg</span>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      <AddWeightSheet
        open={sheetOpen}
        onClose={() => setSheetOpen(false)}
        onSave={(weightKg, date, comment) => onAddWeight(weightKg, date, comment)}
      />
    </div>
  );
}
