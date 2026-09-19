import type { Skill } from '../../types';
import { fondamentauxSkills } from './fondamentaux';
import { deplacementsSkills } from './deplacements';
import { coupsSkills } from './coups';
import { repetitionsSkills } from './repetitions';
import { ciblesSkills } from './cibles';
import { combinaisonsSkills } from './combinaisons';
import { defenseSkills } from './defense';
import { distanceTimingSkills } from './distanceTiming';
import { physiqueSkills } from './physique';

/**
 * Référentiel complet de compétences de boxe anglaise.
 *
 * Couverture actuelle (V1) : Fondamentaux, Déplacements, Coups, Répétitions,
 * Changements de cibles, Combinaisons, Défense (incluant transitions
 * défense→attaque et contres), Distance & timing, Physique & énergie.
 *
 * Non encore couvert dans cette V1 (prévu pour itérations suivantes,
 * cf. section "Étape 4" du cahier des charges) : Lecture de l'adversaire,
 * Tactique de combat, Mental, Compétition (préparation/coin/analyse
 * post-combat). Ces domaines nécessitent une structure de données
 * différente (moins "geste technique", plus "comportement/contexte")
 * et seront ajoutés dans un domaine dédié sans casser ce référentiel.
 */
export const allSkills: Skill[] = [
  ...fondamentauxSkills,
  ...deplacementsSkills,
  ...coupsSkills,
  ...repetitionsSkills,
  ...ciblesSkills,
  ...combinaisonsSkills,
  ...defenseSkills,
  ...distanceTimingSkills,
  ...physiqueSkills,
];

export function getSkillById(id: string): Skill | undefined {
  return allSkills.find((s) => s.id === id);
}

export function getSkillsByDomain(domain: string): Skill[] {
  return allSkills.filter((s) => s.domain === domain);
}
