# BoxTrack Coach — V1

Application de suivi pédagogique et d'évaluation de la progression technique
des boxeurs, pour un coach de boxe anglaise. PWA installable, mobile-first,
100% locale (aucune donnée envoyée à un serveur).

## ⚠️ À lire avant de commencer

Ce projet a été écrit dans un environnement **sans accès réseau**. Cela
signifie concrètement :

- Je n'ai **pas pu exécuter `npm install`**, donc je n'ai jamais eu les vrais
  packages (`react`, `vite`, `tailwindcss`, `lucide-react`, `vite-plugin-pwa`...)
  sous la main.
- Je n'ai donc **pas pu lancer `npm run build` ni `npm run dev`** pour
  vérifier que l'application se compile et s'affiche réellement dans un
  navigateur.

**Ce que j'ai pu vérifier malgré cette contrainte** (en exécutant le code
réel avec `tsx`, sans les dépendances React/Vite) :

- ✅ Le référentiel de 77 compétences n'a aucun doublon d'identifiant et
  aucune référence cassée (prérequis/dépendances pointant vers un id
  inexistant).
- ✅ Le moteur de calcul de progression (`progressService.ts`) : les totaux
  s'additionnent correctement, aucune compétence déjà validée ne réapparaît
  dans les priorités.
- ✅ Le calcul d'âge (`age.ts`) sur les cas limites (anniversaire aujourd'hui,
  demain, dates invalides, dates futures → jamais négatif).
- ✅ L'historique d'évaluation est bien *append-only* (chaque évaluation
  s'ajoute, rien n'est écrasé) et le statut "courant" correspond bien à la
  dernière entrée par date.
- ✅ La validation des fichiers d'import rejette bien le JSON invalide, les
  fichiers sans les bonnes clés, et les enregistrements mal formés.
- ✅ Un typecheck TypeScript partiel (avec des stubs de types faits main pour
  `react`/`lucide-react`, en l'absence de `@types/react`) a permis de trouver
  et corriger 5 vrais bugs (types `React.X` utilisés sans import) et une
  ligne de code mort.

**Ce que je n'ai PAS pu vérifier** (nécessite un vrai `npm install` avec
accès réseau, donc sur votre machine) :

- La compilation Vite complète (`npm run build`).
- Le rendu réel dans un navigateur (CSS Tailwind généré, mise en page mobile,
  tactile).
- L'enregistrement effectif du service worker et l'installabilité PWA.
- Le comportement réel de LocalStorage dans un vrai navigateur.

Donc : **le code est écrit avec soin et la logique métier est testée, mais
tant que vous n'avez pas lancé `npm run build` avec succès sur votre poste,
considérez que ce n'est pas encore "terminé et vérifié".**

## Installation (sur une machine avec accès internet)

```bash
npm install
npm run dev       # démarre le serveur de développement
```

Puis ouvrez l'URL affichée (généralement http://localhost:5173) — idéalement
sur votre téléphone via le réseau local pour tester le rendu mobile réel.

Pour vérifier la compilation de production complète :

```bash
npm run typecheck   # tsc -b --noEmit, avec les vrais types cette fois
npm run build       # build Vite + génération du service worker PWA
npm run preview     # sert le build de production localement
```

Si `npm run typecheck` remonte des erreurs, ce sont des erreurs réelles (pas
des artefacts d'environnement comme dans mon propre run) — n'hésitez pas à
me les copier-coller pour que je les corrige.

## Ce qui est couvert dans cette V1

- **Architecture** : couche de stockage abstraite (`StorageProvider`),
  LocalStorage aujourd'hui, remplaçable par Supabase/Firebase plus tard sans
  toucher au reste du code.
- **Boxeurs** : CRUD complet, âge toujours calculé (jamais stocké), actif/inactif,
  recherche.
- **Référentiel de compétences** : 77 compétences réparties sur 9 domaines
  (Fondamentaux, Déplacements, Coups, Répétitions, Changements de cibles,
  Combinaisons, Défense — incluant transitions défense→attaque et contres,
  Distance & timing, Physique & énergie). Chaque compétence a : description,
  objectif, prérequis, exécution technique, points de vigilance, erreurs
  fréquentes, exercices (solo/partenaire/ATH), critères de validation,
  importance, niveaux recommandés.
- **Évaluation** : statut à 3 états (Non évaluée / Non validée / Validée),
  jamais un système binaire réussite/échec. Historique complet conservé
  (append-only) avec date, commentaire, niveau de maîtrise, coach.
- **Évaluation rapide** : écran pensé pour l'usage terrain (boutons larges,
  peu de taps, filtrage par domaine/recherche).
- **Progression** : taux de progression et taux d'évaluation (distincts,
  jamais confondus), par boxeur et par domaine.
- **Priorités de travail** : algorithme qui met en avant les compétences
  essentielles non maîtrisées dont les prérequis sont déjà acquis.
- **Historique** : liste complète filtrable par boxeur.
- **Export/Import JSON** : sauvegarde manuelle, validation stricte à l'import.
- **PWA** : manifest, icônes, service worker (via `vite-plugin-pwa`),
  installable sur mobile.
- **Design** : mobile-first, thème sombre rouge/noir, navigation adaptée
  (barre basse sur mobile, menu latéral sur desktop/tablette).

## Pas encore couvert (prochaines itérations)

Ces domaines demandent une structure de données différente (comportementale
plutôt que gestuelle) et n'ont pas été inclus pour garder cette V1 cohérente
et livrable :

- Lecture de l'adversaire
- Tactique de combat
- Mental
- Compétition (préparation, coin, analyse post-combat)

Dites-moi si vous voulez qu'on les ajoute ensuite — je proposerai une
structure de données adaptée avant de les intégrer au référentiel existant.

## Structure du projet

```
src/
  types/          Modèles de données (Boxer, Skill, Evaluation, Route)
  services/       Logique métier pure (storage, boxerService, evaluationService,
                   progressService, exportService) — testable indépendamment de React
  data/skills/    Référentiel de compétences, un fichier par domaine
  contexts/       AppDataContext (état global)
  hooks/          useRouter (routage léger par hash), useBoxerProgress
  components/     UI réutilisable (layout, boxer, skill, evaluation, ui)
  pages/          Un composant par écran
```
