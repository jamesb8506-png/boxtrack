import type { BoxTrackExport, Boxer, Evaluation, ObservationEntry, WeightEntry } from '../types';

const EXPORT_VERSION = '1.2';

export function buildExport(
  boxers: Boxer[],
  evaluations: Evaluation[],
  observations: ObservationEntry[],
  weights: WeightEntry[]
): BoxTrackExport {
  return {
    version: EXPORT_VERSION,
    exportedAt: new Date().toISOString(),
    boxers,
    evaluations,
    observations,
    weights,
  };
}

export function downloadExport(
  boxers: Boxer[],
  evaluations: Evaluation[],
  observations: ObservationEntry[],
  weights: WeightEntry[]
): void {
  const data = buildExport(boxers, evaluations, observations, weights);
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  const date = new Date().toISOString().slice(0, 10);
  a.href = url;
  a.download = `boxtrack-coach-export-${date}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export interface ImportResult {
  success: boolean;
  error?: string;
  boxers?: Boxer[];
  evaluations?: Evaluation[];
  observations?: ObservationEntry[];
  weights?: WeightEntry[];
}

/**
 * Valide et parse un fichier JSON d'import. Ne fait AUCUNE hypothèse sur
 * la fiabilité du fichier fourni par l'utilisateur : validation stricte
 * avant d'écraser les données locales.
 *
 * Rétrocompatible : un export généré avant l'ajout des observations et/ou
 * des pesées (sans ces champs) reste valide — traité comme n'ayant aucune
 * entrée à importer pour les champs absents.
 */
export function parseImportFile(raw: string): ImportResult {
  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    return { success: false, error: 'Le fichier n’est pas un JSON valide.' };
  }

  if (typeof parsed !== 'object' || parsed === null) {
    return { success: false, error: 'Format de fichier invalide.' };
  }

  const data = parsed as Partial<BoxTrackExport>;

  if (!Array.isArray(data.boxers) || !Array.isArray(data.evaluations)) {
    return { success: false, error: 'Le fichier ne contient pas de données BoxTrack valides.' };
  }

  const observationsRaw = data.observations ?? [];
  const weightsRaw = data.weights ?? [];
  if (!Array.isArray(observationsRaw) || !Array.isArray(weightsRaw)) {
    return { success: false, error: 'Le fichier contient des champs mal formés.' };
  }

  // Validation minimale de forme sur chaque enregistrement
  const validBoxers = data.boxers.every(
    (b) => b && typeof b === 'object' && 'id' in b && 'firstName' in b && 'lastName' in b
  );
  const validEvals = data.evaluations.every(
    (e) => e && typeof e === 'object' && 'id' in e && 'boxerId' in e && 'skillId' in e && 'status' in e
  );
  const validObservations = observationsRaw.every(
    (o) => o && typeof o === 'object' && 'id' in o && 'boxerId' in o && 'domainId' in o && 'score' in o
  );
  const validWeights = weightsRaw.every(
    (w) => w && typeof w === 'object' && 'id' in w && 'boxerId' in w && 'weightKg' in w && 'date' in w
  );

  if (!validBoxers || !validEvals || !validObservations || !validWeights) {
    return { success: false, error: 'Certains enregistrements du fichier sont mal formés.' };
  }

  return {
    success: true,
    boxers: data.boxers as Boxer[],
    evaluations: data.evaluations as Evaluation[],
    observations: observationsRaw as ObservationEntry[],
    weights: weightsRaw as WeightEntry[],
  };
}
