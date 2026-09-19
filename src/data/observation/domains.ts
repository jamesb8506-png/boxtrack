import type { ObservationDomain } from '../../types';

export const observationDomains: ObservationDomain[] = [
  {
    id: 'obs-technique-offensive',
    name: 'Technique offensive',
    icon: 'Swords',
    whatWeEvaluate: [
      'Directs (jab, cross)',
      'Crochets',
      'Uppercuts',
      'Combinaisons',
      'Précision',
      'Vitesse',
      'Retour en garde',
    ],
    whereToLook: [
      'Les mains, en particulier le retour en garde après chaque frappe',
      "L'alignement épaule-hanche sur le direct",
      'La trajectoire du crochet (coude à la même hauteur que le poing)',
      'La flexion des jambes sur l\u2019uppercut',
    ],
    whatToObserve: [
      'Le boxeur revient-il en garde après chaque coup ?',
      'Les coups partent-ils en ligne droite ou "en moulinet" ?',
      'La combinaison garde-t-elle un rythme fluide, sans à-coups ?',
      "Y a-t-il un temps mort entre deux coups d'une même combinaison ?",
    ],
    commonErrors: [
      'La main traîne après le coup au lieu de revenir',
      "Jab sans rotation d'épaule",
      'Crochet "en moulinet", sans rotation du bassin',
      "Perte de garde pendant l'enchaînement",
      'Tous les coups à la même vitesse, aucune variation',
    ],
    correctionCues: [
      '« Reviens vite »',
      '« Tourne l\u2019épaule »',
      '« Garde le coude à hauteur du poing »',
      '« Un coup, un retour »',
    ],
  },
  {
    id: 'obs-defense',
    name: 'Défense',
    icon: 'Shield',
    whatWeEvaluate: [
      'Garde',
      'Blocages',
      'Esquives',
      'Retraits',
      'Déplacements défensifs',
      'Réaction après une attaque adverse',
      'Retour en garde',
    ],
    whereToLook: [
      'La position des mains au repos, entre deux échanges',
      'La réaction du buste et de la tête face à une frappe',
      'Est-ce que ce sont les pieds qui bougent pour sortir de l\u2019axe, ou seulement le buste ?',
    ],
    whatToObserve: [
      'Le boxeur garde-t-il les mains hautes en toute situation, même fatigué ?',
      'Esquive-t-il avec les jambes ou seulement avec le buste ?',
      'Riposte-t-il après une défense réussie, ou reste-t-il passif ?',
    ],
    commonErrors: [
      'Mains qui descendent après plusieurs échanges',
      'Esquive uniquement du buste, jambes figées',
      'Recul en ligne droite au lieu de sortir d\u2019angle',
      'Aucune riposte après une défense pourtant réussie',
    ],
    correctionCues: [
      '« Mains hautes »',
      '« Bouge la tête ET les pieds »',
      '« Après le blocage, réponds »',
      '« Ne recule pas tout droit »',
    ],
  },
  {
    id: 'obs-deplacements',
    name: 'Déplacements',
    icon: 'Footprints',
    whatWeEvaluate: [
      'Équilibre',
      'Position des pieds',
      'Largeur des appuis',
      'Déplacement sans croiser les jambes',
      'Capacité à conserver la garde en bougeant',
    ],
    whereToLook: [
      'Les pieds, en priorité',
      'La largeur des appuis',
      'La position du bassin',
      'Le haut du corps : reste-t-il équilibré pendant le déplacement ?',
    ],
    whatToObserve: [
      'Le boxeur reste-t-il équilibré pendant tout le déplacement ?',
      'Ses pieds accompagnent-ils correctement le mouvement ?',
      'Revient-il rapidement dans une position stable après s\u2019être déplacé ?',
    ],
    commonErrors: [
      'Croisement des pieds',
      'Appuis trop serrés (perte de stabilité)',
      'Le haut du corps part avant les jambes',
      'Perte de garde pendant le déplacement',
    ],
    correctionCues: [
      '« Garde tes appuis sous toi »',
      '« Déplace-toi sans croiser les pieds »',
    ],
  },
  {
    id: 'obs-distance',
    name: 'Distance',
    icon: 'Ruler',
    whatWeEvaluate: [
      'Bonne distance de frappe',
      "Capacité à entrer dans la distance",
      'Capacité à sortir après une action',
      'Gestion de la distance dans la durée',
    ],
    whereToLook: [
      "L'écart entre les deux boxeurs juste avant que le coup ne parte",
      "Ce qui se passe juste après la frappe : le boxeur reste-t-il à portée ?",
    ],
    whatToObserve: [
      'Le coup touche-t-il en bout de course, ou le boxeur doit-il "plonger" pour toucher ?',
      "Sort-il de la distance après avoir attaqué, ou reste-t-il figé à portée de contre ?",
      "Entre-t-il dans la distance protégé (derrière un jab, un angle), ou de façon frontale et exposée ?",
    ],
    commonErrors: [
      'Frappe dans le vide, hors de portée réelle',
      'Entrée frontale, sans protection',
      "Reste à distance de contre après avoir attaqué",
    ],
    correctionCues: [
      '« Rapproche-toi avant de frapper »',
      '« Sors après ton attaque »',
      '« Ne reste pas à sa portée »',
    ],
  },
  {
    id: 'obs-comprehension',
    name: 'Compréhension',
    icon: 'Brain',
    whatWeEvaluate: [
      'Écoute des consignes',
      'Réaction à une situation',
      'Adaptation',
      "Prise d'information",
      'Anticipation',
    ],
    whereToLook: [
      'Le regard du boxeur pendant que la consigne est donnée',
      'Sa réaction dans les secondes qui suivent une nouvelle consigne',
      'Sa capacité à ajuster son geste après une correction',
    ],
    whatToObserve: [
      'Applique-t-il la consigne dès la répétition suivante, ou faut-il la répéter plusieurs fois ?',
      'Repère-t-il les ouvertures ou les erreurs de son partenaire ?',
      "S'adapte-t-il si l'exercice ou la consigne change en cours de route ?",
    ],
    commonErrors: [
      'Répète la même erreur juste après avoir été corrigé',
      'Ne regarde pas le coach pendant la consigne',
      'Reste figé face à une situation inhabituelle',
    ],
    correctionCues: [
      '« Qu\u2019est-ce que je viens de te dire ? »',
      '« Regarde-moi »',
      '« Qu\u2019est-ce que tu peux faire différemment ? »',
    ],
  },
  {
    id: 'obs-physique',
    name: 'Physique',
    icon: 'Activity',
    whatWeEvaluate: [
      'Endurance',
      'Explosivité',
      'Vitesse',
      'Récupération',
      "Gestion de l'effort",
      'Respiration',
    ],
    whereToLook: [
      'La respiration : bloquée (apnée) ou fluide ?',
      'La qualité technique en fin de round comparée au début',
      'La vitesse de récupération entre deux efforts intenses',
    ],
    whatToObserve: [
      'La technique se dégrade-t-elle avec la fatigue ?',
      'Le boxeur retient-il sa respiration en frappant ?',
      'Récupère-t-il vite entre deux séquences intenses ?',
    ],
    commonErrors: [
      "Apnée pendant l'effort",
      'La technique s\u2019effondre en fin de round',
      'Récupération lente entre deux efforts',
      "Tout donner d'un coup plutôt que gérer son effort dans la durée",
    ],
    correctionCues: [
      '« Respire »',
      '« Garde ta technique même fatigué »',
      '« Gère ton effort »',
    ],
  },
  {
    id: 'obs-comportement',
    name: 'Comportement',
    icon: 'HeartHandshake',
    whatWeEvaluate: [
      'Concentration',
      'Discipline',
      'Confiance',
      'Engagement',
      'Respect des consignes',
    ],
    whereToLook: [
      "L'attention du boxeur entre deux exercices, pas seulement pendant",
      'Son attitude face à une difficulté ou un échec',
      'Son comportement avec les autres boxeurs et le matériel',
    ],
    whatToObserve: [
      "Reste-t-il concentré pendant toute la durée de l'exercice ?",
      'Comment réagit-il face à l\u2019échec : abandonne, persévère, se décourage ?',
      'Respecte-t-il les consignes de sécurité et ses partenaires ?',
    ],
    commonErrors: [
      "Décrochage d'attention pendant les temps morts",
      'Découragement rapide face à la difficulté',
      "Manque d'engagement réel dans l'exercice",
      'Non-respect des consignes de sécurité',
    ],
    correctionCues: [
      '« Reste concentré »',
      '« Recommence, c\u2019est normal de rater »',
      '« Engage-toi à fond »',
    ],
  },
];

export function getObservationDomainById(id: string): ObservationDomain | undefined {
  return observationDomains.find((d) => d.id === id);
}
