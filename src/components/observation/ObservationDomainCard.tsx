import { useState } from 'react';
import {
  Swords,
  Shield,
  Footprints,
  Ruler,
  Brain,
  Activity,
  HeartHandshake,
  Eye,
  Search,
  AlertTriangle,
  MessageCircle,
  ChevronDown,
  type LucideIcon,
} from 'lucide-react';
import type { ObservationDomain, ObservationScore } from '../../types';
import { OBSERVATION_SCORE_LABELS } from '../../types';
import { ScoreSelector } from './ScoreSelector';

const ICON_MAP: Record<string, LucideIcon> = {
  Swords,
  Shield,
  Footprints,
  Ruler,
  Brain,
  Activity,
  HeartHandshake,
};

function GuideSection({ icon: Icon, title, items }: { icon: LucideIcon; title: string; items: string[] }) {
  return (
    <div className="mb-3">
      <div className="flex items-center gap-1.5 mb-1.5">
        <Icon size={14} className="text-gold" />
        <h4 className="text-xs font-semibold text-zinc-300 uppercase tracking-wide">{title}</h4>
      </div>
      <ul className="space-y-1">
        {items.map((item, i) => (
          <li key={i} className="text-sm text-zinc-400 flex gap-2">
            <span className="text-gold mt-1 shrink-0 text-[8px]">●</span>
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function ObservationDomainCard({
  domain,
  lastScore,
  onSave,
}: {
  domain: ObservationDomain;
  lastScore: ObservationScore | null;
  onSave: (score: ObservationScore, comment: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const [score, setScore] = useState<ObservationScore | null>(null);
  const [comment, setComment] = useState('');
  const [justSaved, setJustSaved] = useState(false);
  const DomainIcon = ICON_MAP[domain.icon] ?? Swords;

  function handleSave() {
    if (!score) return;
    onSave(score, comment);
    setJustSaved(true);
    setComment('');
    setScore(null);
    setTimeout(() => setJustSaved(false), 1500);
    setOpen(false);
  }

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden">
      <button onClick={() => setOpen((v) => !v)} className="w-full flex items-center gap-3 p-4 text-left active:bg-zinc-800">
        <div className="w-10 h-10 rounded-full bg-gold/10 flex items-center justify-center shrink-0">
          <DomainIcon size={18} className="text-gold" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-display font-semibold text-zinc-100 tracking-wide">{domain.name}</p>
          <p className="text-xs text-zinc-500">
            {justSaved
              ? 'Enregistré ✓'
              : lastScore
                ? `Dernière note : ${lastScore}/5 — ${OBSERVATION_SCORE_LABELS[lastScore]}`
                : 'Jamais observé'}
          </p>
        </div>
        <ChevronDown size={18} className={`text-zinc-500 shrink-0 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <div className="px-4 pb-4 border-t border-zinc-800 pt-3">
          <div className="flex flex-wrap gap-1.5 mb-4">
            {domain.whatWeEvaluate.map((item, i) => (
              <span key={i} className="text-xs px-2 py-1 rounded-md bg-zinc-800 text-zinc-400">
                {item}
              </span>
            ))}
          </div>

          <GuideSection icon={Eye} title="Où regarder" items={domain.whereToLook} />
          <GuideSection icon={Search} title="Ce qu'il faut observer" items={domain.whatToObserve} />
          <GuideSection icon={AlertTriangle} title="Erreurs fréquentes" items={domain.commonErrors} />
          <GuideSection icon={MessageCircle} title="Quoi dire au boxeur" items={domain.correctionCues} />

          <div className="border-t border-zinc-800 pt-3 mt-1">
            <p className="text-xs font-semibold text-zinc-300 uppercase tracking-wide mb-2">Noter cette séance</p>
            <ScoreSelector value={score} onChange={setScore} />
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Commentaire (optionnel)..."
              className="w-full mt-2 bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:border-gold min-h-[56px] resize-none"
            />
            <button
              onClick={handleSave}
              disabled={!score}
              className="w-full mt-2 py-3 rounded-xl bg-gold text-black font-semibold text-sm disabled:opacity-40 disabled:pointer-events-none active:bg-gold-dark"
            >
              Enregistrer la note
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
