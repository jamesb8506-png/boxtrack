import { createContext, useContext, useState, useCallback, useMemo, type ReactNode } from 'react';
import type { Boxer, Evaluation } from '../types';
import { boxerService } from '../services/boxerService';
import { evaluationService, type CreateEvaluationInput } from '../services/evaluationService';
import { allSkills } from '../data/skills';

interface AppDataContextValue {
  boxers: Boxer[];
  evaluations: Evaluation[];
  skills: typeof allSkills;
  loading: boolean;
  refresh: () => void;

  createBoxer: (input: Parameters<typeof boxerService.create>[0]) => Boxer;
  updateBoxer: (id: string, patch: Parameters<typeof boxerService.update>[1]) => void;
  removeBoxer: (id: string) => void;

  addEvaluation: (input: CreateEvaluationInput) => void;

  importData: (boxers: Boxer[], evaluations: Evaluation[]) => void;
}

const AppDataContext = createContext<AppDataContextValue | null>(null);

export function AppDataProvider({ children }: { children: ReactNode }) {
  const [boxers, setBoxers] = useState<Boxer[]>(() => boxerService.getAll());
  const [evaluations, setEvaluations] = useState<Evaluation[]>(() => evaluationService.getAll());
  const [loading] = useState(false);

  const refresh = useCallback(() => {
    setBoxers(boxerService.getAll());
    setEvaluations(evaluationService.getAll());
  }, []);

  const createBoxer = useCallback((input: Parameters<typeof boxerService.create>[0]) => {
    const boxer = boxerService.create(input);
    setBoxers(boxerService.getAll());
    return boxer;
  }, []);

  const updateBoxer = useCallback((id: string, patch: Parameters<typeof boxerService.update>[1]) => {
    boxerService.update(id, patch);
    setBoxers(boxerService.getAll());
  }, []);

  const removeBoxer = useCallback((id: string) => {
    boxerService.remove(id);
    evaluationService.removeAllForBoxer(id);
    setBoxers(boxerService.getAll());
    setEvaluations(evaluationService.getAll());
  }, []);

  const addEvaluation = useCallback((input: CreateEvaluationInput) => {
    evaluationService.add(input);
    setEvaluations(evaluationService.getAll());
  }, []);

  const importData = useCallback((newBoxers: Boxer[], newEvaluations: Evaluation[]) => {
    boxerService.replaceAll(newBoxers);
    evaluationService.replaceAll(newEvaluations);
    setBoxers(boxerService.getAll());
    setEvaluations(evaluationService.getAll());
  }, []);

  const value = useMemo(
    () => ({
      boxers,
      evaluations,
      skills: allSkills,
      loading,
      refresh,
      createBoxer,
      updateBoxer,
      removeBoxer,
      addEvaluation,
      importData,
    }),
    [boxers, evaluations, loading, refresh, createBoxer, updateBoxer, removeBoxer, addEvaluation, importData]
  );

  return <AppDataContext.Provider value={value}>{children}</AppDataContext.Provider>;
}

export function useAppData(): AppDataContextValue {
  const ctx = useContext(AppDataContext);
  if (!ctx) throw new Error('useAppData doit être utilisé à l’intérieur de AppDataProvider');
  return ctx;
}
