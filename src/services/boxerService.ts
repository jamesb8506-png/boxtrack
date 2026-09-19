import type { Boxer } from '../types';
import { storage, STORAGE_KEYS } from './storage';
import { generateId } from '../utils/id';

function readAll(): Boxer[] {
  return storage.getItem<Boxer[]>(STORAGE_KEYS.BOXERS) ?? [];
}

function writeAll(boxers: Boxer[]): void {
  storage.setItem(STORAGE_KEYS.BOXERS, boxers);
}

export const boxerService = {
  getAll(): Boxer[] {
    return readAll().sort((a, b) => a.lastName.localeCompare(b.lastName, 'fr'));
  },

  getActive(): Boxer[] {
    return this.getAll().filter((b) => b.active);
  },

  getById(id: string): Boxer | null {
    return readAll().find((b) => b.id === id) ?? null;
  },

  create(input: Omit<Boxer, 'id' | 'createdAt'>): Boxer {
    const boxer: Boxer = {
      ...input,
      id: generateId('boxer'),
      createdAt: new Date().toISOString(),
    };
    const all = readAll();
    all.push(boxer);
    writeAll(all);
    return boxer;
  },

  update(id: string, patch: Partial<Omit<Boxer, 'id' | 'createdAt'>>): Boxer | null {
    const all = readAll();
    const idx = all.findIndex((b) => b.id === id);
    if (idx === -1) return null;
    all[idx] = { ...all[idx], ...patch };
    writeAll(all);
    return all[idx];
  },

  setActive(id: string, active: boolean): void {
    this.update(id, { active });
  },

  remove(id: string): void {
    const all = readAll().filter((b) => b.id !== id);
    writeAll(all);
  },

  replaceAll(boxers: Boxer[]): void {
    writeAll(boxers);
  },
};
