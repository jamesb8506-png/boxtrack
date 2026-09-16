import type { Evaluation, EvaluationStatus, MasteryLevel } from '../types';
import { storage, STORAGE_KEYS } from './storage';
import { generateId } from '../utils/id';

function readAll(): Evaluation[] {
  return storage.getItem<Evaluation[]>(STORAGE_KEYS.EVALUATIONS) ?? [];
}

function writeAll(evals: Evaluation[]): void {
  storage.setItem(STORAGE_KEYS.EVALUATIONS, evals);
}

export interface CreateEvaluationInput {
  boxerId: string;
  skillId: string;
  status: EvaluationStatus;
  mastery: MasteryLevel | null;
  comment: string;
  coach: string;
}

export const evaluationService = {
  /**
   * Historique complet, non filtré, trié du plus récent au plus ancien.
   */
  getAll(): Evaluation[] {
    return readAll().sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  },

  getForBoxer(boxerId: string): Evaluation[] {
    return this.getAll().filter((e) => e.boxerId === boxerId);
  },

  /**
   * Historique complet pour une compétence donnée d'un boxeur (le plus récent en premier).
   */
  getHistory(boxerId: string, skillId: string): Evaluation[] {
    return this.getForBoxer(boxerId).filter((e) => e.skillId === skillId);
  },

  /**
   * L'état "courant" d'une compétence = la dernière évaluation enregistrée.
   * Si aucune évaluation n'existe, la compétence est implicitement "Non évaluée".
   */
  getCurrentStatus(boxerId: string, skillId: string): Evaluation | null {
    const history = this.getHistory(boxerId, skillId);
    return history[0] ?? null;
  },

  /**
   * Map skillId -> dernière évaluation, pour un boxeur. Calculée en un seul
   * passage (plutôt que d'appeler getCurrentStatus en boucle) pour rester
   * performant avec un référentiel large.
   */
  getCurrentStatusMap(boxerId: string): Map<string, Evaluation> {
    const forBoxer = this.getForBoxer(boxerId); // déjà trié desc par date
    const map = new Map<string, Evaluation>();
    for (const ev of forBoxer) {
      if (!map.has(ev.skillId)) {
        map.set(ev.skillId, ev);
      }
    }
    return map;
  },

  /**
   * Ajoute une nouvelle entrée d'évaluation. N'écrase JAMAIS l'historique
   * existant : chaque évaluation est un nouvel événement horodaté.
   */
  add(input: CreateEvaluationInput): Evaluation {
    const evaluation: Evaluation = {
      ...input,
      id: generateId('eval'),
      date: new Date().toISOString(),
    };
    const all = readAll();
    all.push(evaluation);
    writeAll(all);
    return evaluation;
  },

  removeEntry(id: string): void {
    const all = readAll().filter((e) => e.id !== id);
    writeAll(all);
  },

  removeAllForBoxer(boxerId: string): void {
    const all = readAll().filter((e) => e.boxerId !== boxerId);
    writeAll(all);
  },

  replaceAll(evals: Evaluation[]): void {
    writeAll(evals);
  },
};
