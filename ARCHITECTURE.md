# Architecture de l’application TéléSport

## 1. Présentation

TéléSport est une application Angular qui permet de comparer les totaux de
médailles olympiques par pays et de consulter les résultats d’un pays par
édition.

## 2. Organisation du projet

| Emplacement | Responsabilité |
|---|---|
| `src/app/pages/` | Pages du tableau de bord, du détail pays et de la page introuvable. |
| `src/app/components/` | En-tête, cartes d’indicateurs et graphiques réutilisables. |
| `src/app/services/data.service.ts` | Chargement des données olympiques avec `HttpClient`. |
| `src/app/models/` | Interfaces `Olympic` et `Participation`. |
| `src/app/app-routing.module.ts` | Déclaration des routes de l’application. |
| `src/assets/mock/olympic.json` | Source de données de l’application. |

`HeaderComponent` reçoit un titre et une liste d’indicateurs via `@Input()`.
Il utilise `StatsCardComponent` pour afficher le libellé et la valeur de
chaque indicateur. L’accueil lui transmet deux indicateurs et le détail pays
lui en transmet trois.

`MedalChartComponent` reçoit le type du graphique, les libellés et les
valeurs à tracer avec Chart.js. Il détruit l’instance du graphique lors
de son remplacement et à la destruction du composant.

## 3. Circulation des données et navigation

1. La page appelle `DataService.getOlympics()`. Le service lit le fichier
   JSON avec `HttpClient` et retourne un `Observable<Olympic[]>`.
2. `HomeComponent` compte les pays et les années olympiques distinctes.
   Il additionne les médailles des différentes participations pour obtenir
   le total par pays.
3. Au clic sur une part du camembert, `MedalChartComponent` émet le nom du
   pays via `@Output()`. `HomeComponent` retrouve son identifiant et ouvre
   `/country/:id`. La liste sous le graphique fournit des liens vers les
   mêmes pages, utilisables au clavier.
4. `CountryComponent` combine le paramètre de route et les données avec
   `combineLatest`. Il retrouve le pays par son identifiant, puis prépare
   les indicateurs et la série des médailles par édition. L’abonnement est
   libéré lorsque le composant est détruit.

Le lien « Go back » ramène à l’accueil. Si la liste chargée contient des
pays mais qu’aucun ne correspond à l’identifiant demandé, la page détail
redirige vers `/not-found`. La route générique `**` affiche également
`NotFoundComponent` pour les URL inconnues.

## 4. États d’affichage

L’accueil et le détail utilisent `loadState` pour choisir le contenu affiché.

| État | Contenu affiché |
|---|---|
| `loading` | Message pendant la récupération des données. |
| `ready` | Indicateurs, graphique et liste des valeurs. |
| `empty` | Message si la liste des pays est vide ou, sur le détail, si le pays ne possède aucune participation. |
| `error` | Message si la requête de chargement échoue. |

Sur le détail, le lien de retour reste disponible dans chacun de ces états.

## 5. Affichage responsive et accès aux données

Le CSS dimensionne le cadre du graphique. Chart.js redimensionne le canvas
pour suivre ce cadre. Le camembert utilise un cadre carré, tandis que la
courbe utilise un cadre plus large que haut.

Les valeurs des deux graphiques sont également affichées sous forme de
listes. Sur le tableau de bord, chaque élément indique le total de médailles
et donne accès au détail du pays. Sur le détail, chaque élément associe une
année au nombre de médailles obtenu.

## 6. Évolutions possibles

- Remplacer le fichier JSON par une API REST Java et Spring Boot.
- Compléter les tests automatisés du service et des composants.