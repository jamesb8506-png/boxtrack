import { createContext, useContext, useState, useCallback, useMemo, type ReactNode } from 'react';
import type { Boxer, Evaluation, ObservationEntry, WeightEntry } from '../types';
import { boxerService } from '../services/boxerService';
import { evaluationService, type CreateEvaluationInput } from '../services/evaluationService';
import { observationService, type CreateObservationInput } from '../services/observationService';
import { weightService, type CreateWeightInput } from '../services/weightService';
import { allSkills } from '../data/skills';
import { observationDomains } from '../data/observation/domains';

interface AppDataContextValue {
  boxers: Boxer[];
  evaluations: Evaluation[];
  observations: ObservationEntry[];
  weights: WeightEntry[];
  skills: typeof allSkills;
  domains: typeof observationDomains;
  loading: boolean;
  refresh: () => void;

  createBoxer: (input: Parameters<typeof boxerService.create>[0]) => Boxer;
  updateBoxer: (id: string, patch: Parameters<typeof boxerService.update>[1]) => void;
  removeBoxer: (id: string) => void;

  addEvaluation: (input: CreateEvaluationInput) => void;
  addObservation: (input: CreateObservationInput) => void;
  addWeight: (input: CreateWeightInput) => void;

  importData: (
    boxers: Boxer[],
    evaluations: Evaluation[],
    observations: ObservationEntry[],
    weights: WeightEntry[]
  ) => void;
}

const AppDataContext = createContext<AppDataContextValue | null>(null);

export function AppDataProvider({ children }: { children: ReactNode }) {
  const [boxers, setBoxers] = useState<Boxer[]>(() => boxerService.getAll());
  const [evaluations, setEvaluations] = useState<Evaluation[]>(() => evaluationService.getAll());
  const [observations, setObservations] = useState<ObservationEntry[]>(() => observationService.getAll());
  const [weights, setWeights] = useState<WeightEntry[]>(() => weightService.getAll());
  const [loading] = useState(false);

  const refresh = useCallback(() => {
    setBoxers(boxerService.getAll());
    setEvaluations(evaluationService.getAll());
    setObservations(observationService.getAll());
    setWeights(weightService.getAll());
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
    observationService.removeAllForBoxer(id);
    weightService.removeAllForBoxer(id);
    setBoxers(boxerService.getAll());
    setEvaluations(evaluationService.getAll());
    setObservations(observationService.getAll());
    setWeights(weightService.getAll());
  }, []);

  const addEvaluation = useCallback((input: CreateEvaluationInput) => {
    evaluationService.add(input);
    setEvaluations(evaluationService.getAll());
  }, []);

  const addObservation = useCallback((input: CreateObservationInput) => {
    observationService.add(input);
    setObservations(observationService.getAll());
  }, []);

  const addWeight = useCallback((input: CreateWeightInput) => {
    weightService.add(input);
    setWeights(weightService.getAll());
  }, []);

  const importData = useCallback(
    (
      newBoxers: Boxer[],
      newEvaluations: Evaluation[],
      newObservations: ObservationEntry[],
      newWeights: WeightEntry[]
    ) => {
      boxerService.replaceAll(newBoxers);
      evaluationService.replaceAll(newEvaluations);
      observationService.replaceAll(newObservations);
      weightService.replaceAll(newWeights);
      setBoxers(boxerService.getAll());
      setEvaluations(evaluationService.getAll());
      setObservations(observationService.getAll());
      setWeights(weightService.getAll());
    },
    []
  );

  const value = useMemo(
    () => ({
      boxers,
      evaluations,
      observations,
      weights,
      skills: allSkills,
      domains: observationDomains,
      loading,
      refresh,
      createBoxer,
      updateBoxer,
      removeBoxer,
      addEvaluation,
      addObservation,
      addWeight,
      importData,
    }),
    [
      boxers,
      evaluations,
      observations,
      weights,
      loading,
      refresh,
      createBoxer,
      updateBoxer,
      removeBoxer,
      addEvaluation,
      addObservation,
      addWeight,
      importData,
    ]
  );

  return <AppDataContext.Provider value={value}>{children}</AppDataContext.Provider>;
}

export function useAppData(): AppDataContextValue {
  const ctx = useContext(AppDataContext);
  if (!ctx) throw new Error('useAppData doit être utilisé à l’intérieur de AppDataProvider');
  return ctx;
}
