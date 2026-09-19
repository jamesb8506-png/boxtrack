import type { ObservationEntry, ObservationScore } from '../types';
import { storage, STORAGE_KEYS } from './storage';
import { generateId } from '../utils/id';

function readAll(): ObservationEntry[] {
  return storage.getItem<ObservationEntry[]>(STORAGE_KEYS.OBSERVATIONS) ?? [];
}

function writeAll(entries: ObservationEntry[]): void {
  storage.setItem(STORAGE_KEYS.OBSERVATIONS, entries);
}

export interface CreateObservationInput {
  boxerId: string;
  domainId: string;
  score: ObservationScore;
  comment: string;
  coach: string;
}

export const observationService = {
  getAll(): ObservationEntry[] {
    return readAll().sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  },

  getForBoxer(boxerId: string): ObservationEntry[] {
    return this.getAll().filter((e) => e.boxerId === boxerId);
  },

  /**
   * Historique complet pour un domaine donné d'un boxeur (le plus récent en premier).
   * Permet la comparaison dans le temps (ex : Déplacements 2/5 en septembre → 4/5 en décembre).
   */
  getHistory(boxerId: string, domainId: string): ObservationEntry[] {
    return this.getForBoxer(boxerId).filter((e) => e.domainId === domainId);
  },

  /**
   * Dernière observation enregistrée pour un domaine donné (ou null si jamais observé).
   */
  getCurrent(boxerId: string, domainId: string): ObservationEntry | null {
    return this.getHistory(boxerId, domainId)[0] ?? null;
  },

  /**
   * Map domainId -> dernière observation, pour un boxeur (un seul passage).
   */
  getCurrentMap(boxerId: string): Map<string, ObservationEntry> {
    const forBoxer = this.getForBoxer(boxerId); // déjà trié desc par date
    const map = new Map<string, ObservationEntry>();
    for (const entry of forBoxer) {
      if (!map.has(entry.domainId)) map.set(entry.domainId, entry);
    }
    return map;
  },

  /**
   * Ajoute une nouvelle observation. N'écrase jamais l'historique existant.
   */
  add(input: CreateObservationInput): ObservationEntry {
    const entry: ObservationEntry = {
      ...input,
      id: generateId('obs'),
      date: new Date().toISOString(),
    };
    const all = readAll();
    all.push(entry);
    writeAll(all);
    return entry;
  },

  removeEntry(id: string): void {
    const all = readAll().filter((e) => e.id !== id);
    writeAll(all);
  },

  removeAllForBoxer(boxerId: string): void {
    const all = readAll().filter((e) => e.boxerId !== boxerId);
    writeAll(all);
  },

  replaceAll(entries: ObservationEntry[]): void {
    writeAll(entries);
  },
};
