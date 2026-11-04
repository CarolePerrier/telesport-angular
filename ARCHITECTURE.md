# Architecture de l'application TéléSport

## 1. Présentation

TéléSport est une application Angular permettant de consulter les résultats des Jeux olympiques.

Elle propose :

* Un tableau de bord présentant le nombre de pays participants, le nombre d'éditions des Jeux olympiques et la répartition des médailles par pays.
* Une page détaillée pour chaque pays, présentant ses participations, son nombre total de médailles, son nombre total d'athlètes et l'évolution de ses médailles au fil des éditions.

## 2. Organisation du projet

Le code de l'application est organisé dans le dossier `src/app/`.

### Pages (`pages/`)

* `HomeComponent` : affiche le tableau de bord et prépare les données du graphique circulaire.
* `CountryComponent` : affiche les statistiques et l'évolution des médailles d'un pays.
* `NotFoundComponent` : gère les routes inexistantes et les pays introuvables.

### Composants réutilisables (`components/`)

* `StatsCardComponent` : affiche une statistique à partir de deux propriétés d'entrée (`label` et `value`).
* `MedalChartComponent` : affiche un graphique circulaire ou linéaire avec Chart.js. Il reçoit les données par des propriétés d'entrée et émet un événement lorsqu'un pays est sélectionné.

### Service (`services/`)

* `DataService` : centralise les appels HTTP et récupère les données olympiques depuis le fichier JSON.

### Modèles (`models/`)

* `Olympic` : définit la structure des données d'un pays.
* `Participation` : définit les informations relatives à une participation aux Jeux olympiques.

## 3. Circulation des données

Le fichier `src/assets/mock/olympic.json` constitue actuellement la source de données.

Le fonctionnement est le suivant :

1. Une page appelle `DataService.getOlympics()`.
2. Le service utilise `HttpClient` pour récupérer les données JSON.
3. La page reçoit les données typées `Olympic[]`.
4. La page calcule les statistiques nécessaires à son affichage.
5. Les composants réutilisables reçoivent les données à afficher grâce à `@Input()`.
6. Le graphique circulaire utilise `@Output()` pour transmettre le pays sélectionné à `HomeComponent`, qui déclenche la navigation.

Cette organisation sépare l'accès aux données, la logique des pages et leur présentation.

## 4. Choix techniques

* **Angular** : framework utilisé pour construire l'application et organiser les composants.
* **TypeScript** : langage permettant de typer les données et de fiabiliser le code.
* **RxJS** : bibliothèque utilisée pour gérer les données asynchrones retournées par les appels HTTP.
* **Chart.js** : bibliothèque utilisée pour afficher les graphiques.
* **Angular Router** : système de navigation entre le tableau de bord et les pages des pays.
* **SCSS** : langage utilisé pour organiser les styles.

## 5. Principes de maintenabilité

Le refactoring repose sur plusieurs principes :

* **Séparation des responsabilités** : chaque composant possède un rôle clairement défini.
* **Réutilisabilité** : les statistiques et les graphiques utilisent des composants communs.
* **Typage explicite** : les interfaces `Olympic` et `Participation` remplacent les types `any`.
* **Centralisation des accès aux données** : les appels HTTP sont regroupés dans `DataService`.
* **Lisibilité** : les calculs sont simplifiés et les conversions inutiles supprimées.
* **Gestion des ressources** : les graphiques Chart.js sont détruits lors de leur remplacement ou de la destruction du composant.

## 6. Évolutions possibles

L'architecture permet d'envisager plusieurs améliorations :

* Remplacer le fichier JSON par une API REST développée avec Java et Spring Boot.
* Ajouter des indicateurs de chargement et des messages d'erreur visibles.
* Améliorer la gestion des données absentes ou invalides.
* Ajouter des tests unitaires pour les services et les composants.
* Renforcer l'accessibilité et l'adaptation aux différentes tailles d'écran.

## Conclusion

Le refactoring de TéléSport améliore la lisibilité, la réutilisabilité et la maintenabilité de l'application.

La séparation entre les pages, les composants réutilisables, les modèles et le service de données facilite les futures évolutions du projet.
