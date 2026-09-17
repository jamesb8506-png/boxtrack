import type { ReactNode } from 'react';
import type { Skill } from '../../types';
import { Target, ListChecks, AlertTriangle, Dumbbell, Users, Target as TargetIcon, CheckSquare, Link2 } from 'lucide-react';
import { getSkillById } from '../../data/skills';

function Section({
  icon: Icon,
  title,
  children,
}: {
  icon: typeof Target;
  title: string;
  children: ReactNode;
}) {
  return (
    <div className="mb-5">
      <div className="flex items-center gap-2 mb-2">
        <Icon size={16} className="text-gold" />
        <h3 className="text-sm font-semibold text-zinc-300 uppercase tracking-wide">{title}</h3>
      </div>
      {children}
    </div>
  );
}

function BulletList({ items }: { items: string[] }) {
  if (items.length === 0) return <p className="text-sm text-zinc-600 italic">Aucun élément renseigné.</p>;
  return (
    <ul className="space-y-1.5">
      {items.map((item, i) => (
        <li key={i} className="text-sm text-zinc-400 flex gap-2">
          <span className="text-gold mt-1 shrink-0">•</span>
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

export function SkillDetail({ skill }: { skill: Skill }) {
  const prereqSkills = skill.prerequisites.map((id) => getSkillById(id)).filter(Boolean) as Skill[];

  return (
    <div className="px-4 py-4">
      <div className="mb-4">
        <span className="text-xs font-medium px-2 py-1 rounded-md bg-zinc-800 text-zinc-400">{skill.domain}</span>
        <span className="text-xs font-medium px-2 py-1 rounded-md bg-gold/15 text-gold-light ml-2">{skill.importance}</span>
      </div>

      <p className="text-zinc-300 text-[15px] leading-relaxed mb-5">{skill.description}</p>

      <Section icon={TargetIcon} title="Objectif">
        <p className="text-sm text-zinc-400">{skill.objective}</p>
      </Section>

      {prereqSkills.length > 0 && (
        <Section icon={Link2} title="Prérequis">
          <BulletList items={prereqSkills.map((s) => s.name)} />
        </Section>
      )}

      <Section icon={ListChecks} title="Exécution">
        <p className="text-sm text-zinc-400">{skill.execution}</p>
      </Section>

      <Section icon={Target} title="Points de vigilance">
        <BulletList items={skill.coachingPoints} />
      </Section>

      <Section icon={AlertTriangle} title="Erreurs fréquentes">
        <BulletList items={skill.commonErrors} />
      </Section>

      <Section icon={Dumbbell} title="Exercices solo">
        <BulletList items={skill.soloExercises} />
      </Section>

      <Section icon={Users} title="Exercices avec partenaire">
        <BulletList items={skill.partnerExercises} />
      </Section>

      <Section icon={Dumbbell} title="Exercices ATH / pao / sac">
        <BulletList items={skill.athExercises} />
      </Section>

      <Section icon={CheckSquare} title="Critères de validation">
        <BulletList items={skill.validationCriteria} />
      </Section>

      {skill.recommendedLevels.length > 0 && (
        <div className="flex flex-wrap gap-1.5 pt-2 border-t border-zinc-800">
          <span className="text-xs text-zinc-600 mr-1 mt-1">Niveaux recommandés :</span>
          {skill.recommendedLevels.map((l) => (
            <span key={l} className="text-xs px-2 py-1 rounded-md bg-zinc-800 text-zinc-400">
              {l}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
