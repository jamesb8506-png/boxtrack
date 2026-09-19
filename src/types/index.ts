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
  weightGoalKg?: number | null; // objectif de poids, optionnel (absent sur les boxeurs créés avant cet ajout)
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

// Historique append-only, même principe que Evaluation/ObservationEntry.
export interface WeightEntry {
  id: string;
  boxerId: string;
  date: string; // ISO datetime (date + heure éventuelle)
  weightKg: number;
  comment: string;
}

export interface BoxTrackExport {
  version: string;
  exportedAt: string;
  boxers: Boxer[];
  evaluations: Evaluation[];
  observations?: ObservationEntry[]; // optionnel pour rétrocompatibilité avec les anciens exports
  weights?: WeightEntry[]; // optionnel pour rétrocompatibilité avec les anciens exports
}

// ------------------------------------------------------------
// Guide d'observation — évaluation pédagogique par grand domaine
// (distinct du référentiel technique fin de 77 compétences ci-dessus :
// celui-ci sert de guide en direct pendant l'entraînement, pas de
// checklist technique exhaustive)
// ------------------------------------------------------------

export interface ObservationDomain {
  id: string;
  name: string;
  icon: string; // nom d'icône lucide-react
  whatWeEvaluate: string[];
  whereToLook: string[];
  whatToObserve: string[];
  commonErrors: string[];
  correctionCues: string[];
}

export type ObservationScore = 1 | 2 | 3 | 4 | 5;

export const OBSERVATION_SCORE_LABELS: Record<ObservationScore, string> = {
  1: 'À travailler',
  2: 'En difficulté',
  3: 'En progression',
  4: 'Maîtrisé',
  5: 'Très bien maîtrisé',
};

// Historique append-only, même principe que Evaluation : chaque
// observation est un nouvel événement daté, rien n'est jamais écrasé.
export interface ObservationEntry {
  id: string;
  boxerId: string;
  domainId: string;
  score: ObservationScore;
  comment: string;
  coach: string;
  date: string; // ISO datetime
}
