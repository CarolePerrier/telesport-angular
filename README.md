# TéléSport · Statistiques olympiques

TéléSport est une application Angular qui permet de comparer les totaux de
médailles olympiques par pays et de consulter les résultats d’un pays par
édition.

## Fonctionnalités

- **Accueil (`/`)** — nombre de pays, nombre d’éditions et camembert des
  médailles par pays. Un clic sur une part ou sur un lien dans la liste
  ouvre le détail du pays.
- **Détail (`/country/:id`)** — nombre de participations, total des médailles
  et des athlètes, courbe des médailles par édition et lien de retour à
  l’accueil. Exemple pour la France avec `/country/5`.
- **Gestion des erreurs** — page dédiée aux URL et aux pays introuvables,
  messages de chargement, de données vides et d’échec de la requête.
- **Accessibilité et responsive** — données des graphiques disponibles en
  texte, liens utilisables au clavier et mise en page adaptée aux écrans
  d’ordinateur, de tablette et de mobile.

## Prérequis et lancement

Node.js et npm doivent être installés. Les dépendances du projet, dont Angular
CLI et Chart.js, sont installées avec npm.

À la racine du projet, lancez les commandes suivantes.

```bash
npm ci
npx ng serve
```

Ouvrez ensuite [http://localhost:4200/](http://localhost:4200/).

## Compilation

```bash
npm run build
```

Les fichiers générés se trouvent dans `dist/`.

## Structure du projet

| Emplacement | Rôle |
|---|---|
| `src/app/pages/` | Accueil, détail pays et page introuvable |
| `src/app/components/` | En-tête, cartes d’indicateurs et graphiques réutilisables |
| `src/app/services/data.service.ts` | Chargement du fichier JSON via `HttpClient` |
| `src/app/models/` | Interfaces TypeScript des données olympiques |
| `src/app/app-routing.module.ts` | Déclaration des routes Angular |
| `src/assets/mock/olympic.json` | Données utilisées par l’application |

## Choix techniques

Les pages préparent les indicateurs et les séries à afficher. L’en-tête
partagé reçoit le titre et les indicateurs, tandis que le composant graphique
reçoit les libellés et les valeurs à tracer avec Chart.js. Le détail utilise
l’identifiant du pays fourni dans l’URL pour retrouver ses données.

Pour aller plus loin, voir [ARCHITECTURE.md](./ARCHITECTURE.md).

## Captures d’écran

Le livrable `telesport-captures.zip` contient les quatre captures de
l’accueil et du détail France, sur ordinateur et sur mobile.