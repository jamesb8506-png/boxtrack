import type {
  Skill,
  Evaluation,
  BoxerProgress,
  DomainProgress,
  SkillDomain,
} from '../types';
import { SKILL_DOMAINS } from '../types';

/**
 * Calcule la progression d'un boxeur à partir du référentiel complet
 * et de la map "dernière évaluation par compétence".
 *
 * Règle fondamentale : une compétence Non évaluée n'est PAS un échec.
 * Elle est exclue du taux d'évaluation autant que du taux de progression
 * au numérateur, mais compte au dénominateur (total).
 */
export function computeBoxerProgress(
  boxerId: string,
  allSkills: Skill[],
  currentStatusMap: Map<string, Evaluation>
): BoxerProgress {
  const byDomain: DomainProgress[] = SKILL_DOMAINS.map((domain) =>
    computeDomainProgress(domain, allSkills, currentStatusMap)
  ).filter((d) => d.total > 0);

  let validated = 0;
  let notValidated = 0;
  let notEvaluated = 0;

  for (const skill of allSkills) {
    const current = currentStatusMap.get(skill.id);
    if (!current || current.status === 'Non évaluée') notEvaluated++;
    else if (current.status === 'Validée') validated++;
    else notValidated++;
  }

  const totalSkills = allSkills.length;
  const evaluated = validated + notValidated;

  return {
    boxerId,
    totalSkills,
    validated,
    notValidated,
    notEvaluated,
    progressRate: totalSkills > 0 ? validated / totalSkills : 0,
    evaluationRate: totalSkills > 0 ? evaluated / totalSkills : 0,
    byDomain,
    priorities: computePriorities(allSkills, currentStatusMap),
  };
}

function computeDomainProgress(
  domain: SkillDomain,
  allSkills: Skill[],
  currentStatusMap: Map<string, Evaluation>
): DomainProgress {
  const domainSkills = allSkills.filter((s) => s.domain === domain);
  let validated = 0;
  let notValidated = 0;
  let notEvaluated = 0;

  for (const skill of domainSkills) {
    const current = currentStatusMap.get(skill.id);
    if (!current || current.status === 'Non évaluée') notEvaluated++;
    else if (current.status === 'Validée') validated++;
    else notValidated++;
  }

  const total = domainSkills.length;
  const evaluated = validated + notValidated;

  return {
    domain,
    total,
    validated,
    notValidated,
    notEvaluated,
    progressRate: total > 0 ? validated / total : 0,
    evaluationRate: total > 0 ? evaluated / total : 0,
  };
}

/**
 * Détermine les compétences prioritaires à travailler pour un boxeur.
 *
 * Heuristique de score (plus haut = plus prioritaire) :
 * - Compétences "Non validée" avec importance "Essentielle" : priorité maximale
 * - Compétences essentielles jamais évaluées : haute priorité (à découvrir)
 * - Compétences dont les prérequis sont déjà validés mais qui restent
 *   elles-mêmes non traitées : prêtes à être travaillées
 * - Importance Importante/Complémentaire : priorité décroissante
 */
function computePriorities(
  allSkills: Skill[],
  currentStatusMap: Map<string, Evaluation>
) {
  const importanceWeight: Record<string, number> = {
    Essentielle: 30,
    Importante: 15,
    Complémentaire: 5,
  };

  const priorities = allSkills
    .map((skill) => {
      const current = currentStatusMap.get(skill.id);
      const status = current?.status ?? 'Non évaluée';

      if (status === 'Validée') return null; // déjà acquis, pas prioritaire

      let score = importanceWeight[skill.importance] ?? 5;
      let reason = '';

      if (status === 'Non validée') {
        score += 20;
        reason = 'En cours de travail, pas encore maîtrisée';
      } else {
        reason = 'Jamais évaluée';
      }

      // Bonus si tous les prérequis sont déjà validés → prêt à travailler
      if (skill.prerequisites.length > 0) {
        const prereqsValidated = skill.prerequisites.every(
          (id) => currentStatusMap.get(id)?.status === 'Validée'
        );
        if (prereqsValidated) {
          score += 10;
          reason += ' · prérequis validés';
        } else {
          score -= 15;
          reason += ' · prérequis non validés';
        }
      }

      return { skill, reason, score };
    })
    .filter((p): p is NonNullable<typeof p> => p !== null)
    .sort((a, b) => b.score - a.score);

  return priorities.slice(0, 10);
}
