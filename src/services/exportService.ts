import type { BoxTrackExport, Boxer, Evaluation } from '../types';

const EXPORT_VERSION = '1.0';

export function buildExport(boxers: Boxer[], evaluations: Evaluation[]): BoxTrackExport {
  return {
    version: EXPORT_VERSION,
    exportedAt: new Date().toISOString(),
    boxers,
    evaluations,
  };
}

export function downloadExport(boxers: Boxer[], evaluations: Evaluation[]): void {
  const data = buildExport(boxers, evaluations);
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
}

/**
 * Valide et parse un fichier JSON d'import. Ne fait AUCUNE hypothèse sur
 * la fiabilité du fichier fourni par l'utilisateur : validation stricte
 * avant d'écraser les données locales.
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

  // Validation minimale de forme sur chaque enregistrement
  const validBoxers = data.boxers.every(
    (b) => b && typeof b === 'object' && 'id' in b && 'firstName' in b && 'lastName' in b
  );
  const validEvals = data.evaluations.every(
    (e) => e && typeof e === 'object' && 'id' in e && 'boxerId' in e && 'skillId' in e && 'status' in e
  );

  if (!validBoxers || !validEvals) {
    return { success: false, error: 'Certains enregistrements du fichier sont mal formés.' };
  }

  return { success: true, boxers: data.boxers as Boxer[], evaluations: data.evaluations as Evaluation[] };
}
