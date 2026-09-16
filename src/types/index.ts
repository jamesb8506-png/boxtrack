// ============================================================
// BOXTRACK COACH — Modèles de données
// ============================================================

export type Sex = 'M' | 'F';

export type BoxerLevel =
  | 'Débutant'
  | 'Initiation'
  | 'Intermédiaire'
  | 'Confirmé'
  | 'Compétiteur';

export const BOXER_LEVELS: BoxerLevel[] = [
  'Débutant',
  'Initiation',
  'Intermédiaire',
  'Confirmé',
  'Compétiteur',
];

export interface Boxer {
  id: string;
  firstName: string;
  lastName: string;
  birthDate: string; // ISO date (YYYY-MM-DD)
  sex: Sex;
  weight: number | null; // kg
  category: string; // catégorie de poids ou d'âge, libre
  level: BoxerLevel;
  club: string;
  photo: string | null; // base64 or URL, optional
  notes: string;
  createdAt: string; // ISO datetime
  active: boolean;
}

// L'âge n'est jamais stocké : il est calculé depuis birthDate (voir utils/age.ts)

// ------------------------------------------------------------
// Référentiel de compétences
// ------------------------------------------------------------

export type SkillDomain =
  | 'Fondamentaux'
  | 'Déplacements'
  | 'Coups'
  | 'Répétitions'
  | 'Changements de cibles'
  | 'Combinaisons'
  | 'Défense'
  | 'Distance & timing'
  | 'Physique & énergie';

export const SKILL_DOMAINS: SkillDomain[] = [
  'Fondamentaux',
  'Déplacements',
  'Coups',
  'Répétitions',
  'Changements de cibles',
  'Combinaisons',
  'Défense',
  'Distance & timing',
  'Physique & énergie',
];

export type SkillImportance = 'Essentielle' | 'Importante' | 'Complémentaire';

export interface Skill {
  id: string;
  name: string;
  domain: SkillDomain;
  description: string;
  objective: string;
  prerequisites: string[]; // ids d'autres skills
  execution: string; // description technique du mouvement
  coachingPoints: string[];
  commonErrors: string[];
  soloExercises: string[];
  partnerExercises: string[];
  athExercises: string[]; // exercices sur ATH / pao / sac
  validationCriteria: string[];
  importance: SkillImportance;
  recommendedLevels: BoxerLevel[];
  dependencies: string[]; // ids de skills dont celle-ci dépend logiquement
}

// ------------------------------------------------------------
// Évaluation
// ------------------------------------------------------------

export type EvaluationStatus = 'Non évaluée' | 'Non validée' | 'Validée';

export type MasteryLevel =
  | 'Découverte'
  | 'Maîtrise technique'
  | 'Application partenaire'
  | 'ATH'
  | 'Opposition'
  | 'Autonome';

export const MASTERY_LEVELS: MasteryLevel[] = [
  'Découverte',
  'Maîtrise technique',
  'Application partenaire',
  'ATH',
  'Opposition',
  'Autonome',
];

// Une entrée d'évaluation = un événement d'historique.
// L'état "courant" d'une compétence pour un boxeur est simplement
// la dernière entrée (par date) de son historique.
export interface Evaluation {
  id: string;
  boxerId: string;
  skillId: string;
  status: EvaluationStatus;
  mastery: MasteryLevel | null;
  comment: string;
  coach: string;
  date: string; // ISO datetime
}

// ------------------------------------------------------------
// Agrégats calculés (jamais stockés, toujours dérivés)
// ------------------------------------------------------------

export interface DomainProgress {
  domain: SkillDomain;
  total: number;
  validated: number;
  notValidated: number;
  notEvaluated: number;
  progressRate: number; // validated / total
  evaluationRate: number; // (validated + notValidated) / total
}

export interface BoxerProgress {
  boxerId: string;
  totalSkills: number;
  validated: number;
  notValidated: number;
  notEvaluated: number;
  progressRate: number;
  evaluationRate: number;
  byDomain: DomainProgress[];
  priorities: PrioritySkill[];
}

export interface PrioritySkill {
  skill: Skill;
  reason: string;
  score: number; // score de priorité, plus haut = plus prioritaire
}

// ------------------------------------------------------------
// Export / Import
// ------------------------------------------------------------

export interface BoxTrackExport {
  version: string;
  exportedAt: string;
  boxers: Boxer[];
  evaluations: Evaluation[];
}
