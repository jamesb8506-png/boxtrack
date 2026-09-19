import type { WeightEntry } from '../types';
import { storage, STORAGE_KEYS } from './storage';
import { generateId } from '../utils/id';

function readAll(): WeightEntry[] {
  return storage.getItem<WeightEntry[]>(STORAGE_KEYS.WEIGHTS) ?? [];
}

function writeAll(entries: WeightEntry[]): void {
  storage.setItem(STORAGE_KEYS.WEIGHTS, entries);
}

export interface CreateWeightInput {
  boxerId: string;
  date: string;
  weightKg: number;
  comment: string;
}

export const weightService = {
  getAll(): WeightEntry[] {
    return readAll().sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  },

  /**
   * Historique d'un boxeur, du plus récent au plus ancien.
   */
  getForBoxer(boxerId: string): WeightEntry[] {
    return this.getAll().filter((e) => e.boxerId === boxerId);
  },

  /**
   * Historique d'un boxeur, du plus ANCIEN au plus récent — pratique pour
   * tracer un graphique ou calculer une variation dans l'ordre chronologique.
   */
  getForBoxerChronological(boxerId: string): WeightEntry[] {
    return [...this.getForBoxer(boxerId)].reverse();
  },

  add(input: CreateWeightInput): WeightEntry {
    const entry: WeightEntry = { ...input, id: generateId('weight') };
    const all = readAll();
    all.push(entry);
    writeAll(all);
    return entry;
  },

  removeEntry(id: string): void {
    writeAll(readAll().filter((e) => e.id !== id));
  },

  removeAllForBoxer(boxerId: string): void {
    writeAll(readAll().filter((e) => e.boxerId !== boxerId));
  },

  replaceAll(entries: WeightEntry[]): void {
    writeAll(entries);
  },
};
