import { useMemo } from 'react';
import { useAppData } from '../contexts/AppDataContext';
import { computeBoxerProgress } from '../services/progressService';
import { evaluationService } from '../services/evaluationService';

export function useBoxerProgress(boxerId: string | undefined) {
  const { skills, evaluations } = useAppData();

  return useMemo(() => {
    if (!boxerId) return null;
    // evaluations en dépendance déclenche le recalcul à chaque évaluation ajoutée
    void evaluations;
    const statusMap = evaluationService.getCurrentStatusMap(boxerId);
    return computeBoxerProgress(boxerId, skills, statusMap);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [boxerId, skills, evaluations]);
}
