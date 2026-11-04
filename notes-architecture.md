# Audit d'architecture — TéléSport

## 1. Analyse fonctionnelle et visuelle de l'application existante

### 1.1 Fonctionnalités observées

L'application démarre correctement et propose deux vues principales :

**Page d'accueil :**

* Affichage d'un diagramme circulaire représentant les médailles de cinq pays.
* Affichage du nombre de pays et du nombre d'éditions des Jeux Olympiques.
* Présence d'infobulles au survol des portions du graphique.
* Navigation vers la page détaillée d'un pays au clic sur sa portion.

**Page détaillée :**

* Affichage du pays sélectionné.
* Présentation du nombre de participations, du total des médailles et du nombre total d'athlètes.
* Graphique représentant l'évolution des médailles selon les années.
* Lien permettant de revenir à la page d'accueil.

### 1.2 Problèmes visuels et ergonomiques identifiés

**Observation 1 — Dimensionnement du diagramme circulaire**

Le diagramme occupe une grande partie de l'écran et n'est pas entièrement visible sans défilement vertical.

* Conséquence : lecture moins confortable des informations.
* Amélioration envisagée : adapter les dimensions du graphique à l'espace disponible et vérifier son comportement sur différentes tailles d'écran.

**Observation 2 — Manque de précision des informations**

L'infobulle du diagramme affiche le total des médailles par pays sans préciser explicitement la période concernée.

* Conséquence : risque d'ambiguïté dans l'interprétation des statistiques.
* Amélioration envisagée : préciser que les résultats correspondent aux éditions des Jeux olympiques présentes dans les données.

**Observation 3 — Cohérence de l'interface**

Certains éléments de navigation et certains intitulés pourraient être plus explicites.

* Conséquence : expérience utilisateur perfectible.
* Amélioration envisagée : harmoniser les libellés et améliorer la visibilité des éléments de navigation.

### 1.3 Points restant à vérifier

* Conformité de l'interface aux spécifications fonctionnelles.
* Adaptation aux différentes tailles d'écran.
* Accessibilité des graphiques et de la navigation.
* Gestion des erreurs et des données absentes.
* Organisation du code Angular et séparation des responsabilités.

## 2. Analyse technique du composant HomeComponent

**Fichier analysé :** `src/app/pages/home/home.component.ts`

### 2.1 Mélange des responsabilités

**Constat :** Le composant gère plusieurs responsabilités : récupération des données, calcul des statistiques, construction du graphique et navigation.

**Conséquence :** Ce mélange peut compliquer la maintenance, les tests et les évolutions futures. Il présente un risque de non-respect du principe de responsabilité unique (SRP).

**Amélioration envisagée :** Séparer les responsabilités, notamment en utilisant un service pour l'accès aux données et des méthodes dédiées pour les calculs.

### 2.2 Appel HTTP directement dans le composant

**Constat :** `HomeComponent` utilise directement `HttpClient` dans sa méthode `ngOnInit()`.

**Conséquence :** Le composant est directement couplé à la récupération des données.

**Amélioration envisagée :** Créer un service Angular chargé de centraliser l'accès aux données olympiques.

### 2.3 Typage insuffisant

**Constat :** Plusieurs variables et paramètres utilisent le type `any`, notamment lors de la récupération et du traitement des données.

**Conséquence :** Certaines erreurs de typage peuvent ne pas être détectées pendant le développement.

**Amélioration envisagée :** Définir des interfaces TypeScript décrivant les pays et leurs participations olympiques.

### 2.4 Calculs statistiques peu lisibles

**Constat :** Certains calculs utilisent plusieurs transformations imbriquées (`map`, `flat`, `Set`, `reduce`).

**Conséquence :** Le code devient plus difficile à comprendre, à tester et à maintenir.

**Amélioration envisagée :** Extraire les calculs complexes dans des méthodes clairement nommées.

### 2.5 Présence de code de débogage

**Constat :** Le composant contient des instructions `console.log()`.

**Conséquence :** Ces instructions peuvent produire des informations inutiles dans la console en production.

**Amélioration envisagée :** Supprimer les traces de débogage inutiles ou utiliser un système de journalisation adapté.

### 2.6 Utilisation inutile de `pipe()`

**Constat :** Un appel à `pipe()` est présent sans aucun opérateur RxJS.

**Conséquence :** Cette instruction n'apporte aucune fonctionnalité et alourdit légèrement la lecture du code.

**Amélioration envisagée :** Supprimer le `pipe()` vide ou y placer des opérateurs lorsqu'ils sont réellement nécessaires.

### 2.7 — Gestion des erreurs HTTP à vérifier

Le composant intercepte les erreurs HTTP et stocke leur message dans une propriété error. Il reste à vérifier si ce message est effectivement présenté à l'utilisateur dans le template HTML.

### 2.8 — Absence de destruction explicite du graphique

Le composant crée une instance de Chart.js sans appeler explicitement sa méthode destroy() lors de la destruction du composant Angular. Cela peut entraîner une mauvaise gestion des ressources, notamment lors de navigations répétées.

## 3. Analyse du template HomeComponent

**Fichier analysé :** `src/app/pages/home/home.component.html`

### 3.1 Absence d'affichage des erreurs HTTP

**Constat :** Le composant TypeScript récupère les erreurs HTTP dans une propriété `error`, mais le template HTML ne prévoit aucun affichage de cette information.

**Conséquence :** En cas d'échec du chargement des données, l'utilisateur ne reçoit pas d'explication claire.

**Amélioration envisagée :** Ajouter un affichage conditionnel des messages d'erreur et prévoir un état de chargement.

### 3.2 Structure HTML peu sémantique

**Constat :** Le template contient plusieurs balises `<div>` imbriquées, notamment pour organiser les titres et les statistiques.

**Conséquence :** La structure du document manque de clarté sémantique et pourrait être plus facile à comprendre pour les outils d'accessibilité.

**Amélioration envisagée :** Utiliser des balises HTML adaptées lorsque cela est pertinent (`main`, `section`, `h1`, `h2`, etc.).

### 3.3 Accessibilité du graphique

**Constat :** Le graphique est affiché dans un élément `<canvas>` sans alternative textuelle explicite. La navigation vers les pays repose sur une interaction avec le graphique.

**Conséquence :** Les utilisateurs de lecteurs d'écran ou naviguant au clavier pourraient rencontrer des difficultés.

**Amélioration envisagée :** Fournir une alternative accessible aux informations et aux interactions du graphique.

### 3.4 Interpolation inutile dans le canvas

**Constat :** Le template contient l'interpolation `{{ pieChart }}` à l'intérieur de l'élément `<canvas>`.

**Conséquence :** Cette interpolation n'est pas nécessaire au rendu du graphique par Chart.js et peut rendre le code moins compréhensible.

**Amélioration envisagée :** Supprimer l'interpolation inutile et conserver uniquement l'élément nécessaire au rendu du graphique.

## 4. Analyse des styles globaux

**Fichier analysé :** `src/styles.scss`

### 4.1 Utilisation de sélecteurs génériques

**Constat :** Certaines règles SCSS ciblent tous les éléments descendants d'une classe, notamment `.split div`.

**Risque :** Des éléments ajoutés ultérieurement pourraient recevoir involontairement des styles.

**Amélioration envisagée :** Utiliser des sélecteurs plus précis ou des classes dédiées.

### 4.2 Répétition des couleurs

**Constat :** La couleur `#0b868f` est utilisée à plusieurs endroits dans les styles et apparaît également dans la configuration du graphique Chart.js.

**Conséquence :** Une évolution de la charte graphique nécessiterait plusieurs modifications.

**Amélioration envisagée :** Centraliser les couleurs communes, par exemple avec des variables CSS.

### 4.3 Adaptation responsive à vérifier

**Constat :** Les statistiques sont disposées horizontalement avec Flexbox. Aucune règle responsive spécifique n'est présente dans ce fichier.

**Risque :** La présentation pourrait être moins adaptée à certains formats d'écran.

**Amélioration envisagée :** Tester l'application sur différentes tailles d'écran avant de déterminer les ajustements nécessaires.

### 4.4 Dimensions du graphique

**Constat :** Aucune règle de dimensionnement du `<canvas>` n'est présente dans les styles globaux examinés. Le graphique utilise une configuration `aspectRatio` dans Chart.js.

**Conséquence :** Le dimensionnement du graphique mérite d'être examiné, notamment au regard du débordement visuel observé sur la page d'accueil.

**Amélioration envisagée :** Vérifier le conteneur du graphique et prévoir un dimensionnement adapté aux différentes tailles d'écran.

## 5. Analyse technique de CountryComponent

**Fichier analysé :** `src/app/pages/country/country.component.ts`

### 5.1 Duplication de l'accès aux données

**Constat :** `HomeComponent` et `CountryComponent` effectuent chacun un appel HTTP vers le même fichier `olympic.json`.

**Conséquence :** La logique d'accès aux données est dupliquée et directement intégrée aux composants.

**Amélioration envisagée :** Centraliser la récupération des données dans un service Angular partagé.

### 5.2 Typage insuffisant

**Constat :** Le composant utilise plusieurs fois le type `any`, notamment pour les données olympiques et certains calculs.

**Conséquence :** Le typage ne permet pas de détecter certaines erreurs pendant le développement.

**Amélioration envisagée :** Créer des interfaces TypeScript représentant les pays et leurs participations.

### 5.3 Absence de vérification du pays sélectionné

**Constat :** Le résultat de `find()` est utilisé directement avec `selectedCountry.country`, sans vérifier qu'un pays a effectivement été trouvé.

**Conséquence :** Une URL contenant un nom de pays inexistant peut provoquer une erreur d'exécution.

**Amélioration envisagée :** Vérifier l'existence du pays et prévoir une gestion adaptée des cas introuvables.

### 5.4 Conversions de types inutiles

**Constat :** Les nombres de médailles et d'athlètes sont convertis en chaînes de caractères avec `toString()`, puis reconvertis en nombres avec `parseInt()`.

**Conséquence :** Ces conversions compliquent inutilement les traitements.

**Amélioration envisagée :** Conserver des valeurs numériques correctement typées pour les calculs.

### 5.5 Gestion des paramètres de route

**Constat :** Le composant souscrit aux paramètres de route, mais charge les données HTTP indépendamment de leurs changements.

**Risque :** Le contenu peut ne pas être actualisé correctement si le paramètre change sans recréation du composant.

**Amélioration envisagée :** Synchroniser la récupération des données et le traitement du paramètre de route.

### 5.6 Gestion du graphique

**Constat :** Le composant crée une instance Chart.js sans nettoyage explicite lors de sa destruction.

**Risque :** Une mauvaise gestion des ressources peut apparaître lors de navigations répétées.

**Amélioration envisagée :** Prévoir la destruction du graphique lorsqu'il n'est plus utilisé.

## 6. Analyse du template CountryComponent

**Fichier analysé :** `src/app/pages/country/country.component.html`

### 6.1 Duplication de la structure de présentation

**Constat :** Les templates `HomeComponent` et `CountryComponent` utilisent une structure HTML similaire pour afficher les titres et les statistiques.

**Conséquence :** Certaines modifications de présentation pourraient nécessiter des interventions dans plusieurs fichiers.

**Amélioration envisagée :** Évaluer l'intérêt de composants réutilisables pour les éléments d'interface communs, sans multiplier inutilement les composants.

### 6.2 Interpolation inutile dans le canvas

**Constat :** L'élément `<canvas>` contient l'interpolation `{{ lineChart }}`, alors que Chart.js assure directement le rendu du graphique.

**Conséquence :** Cette interpolation est superflue et peut rendre le template moins clair.

**Amélioration envisagée :** Supprimer l'interpolation inutile.

### 6.3 Présentation du titre de l'axe horizontal

**Constat :** Le texte « Date » est affiché dans une balise `<h2>` sous le graphique.

**Conséquence :** Cette balise ne correspond pas idéalement à la fonction d'étiquette d'axe.

**Amélioration envisagée :** Configurer le titre de l'axe horizontal directement dans Chart.js.

### 6.4 Absence d'affichage des erreurs

**Constat :** Le composant TypeScript stocke les erreurs HTTP dans une propriété `error`, mais le template ne les affiche pas.

**Conséquence :** L'utilisateur ne reçoit pas d'explication claire en cas d'échec du chargement des données.

**Amélioration envisagée :** Prévoir un affichage conditionnel des erreurs et un état de chargement.

### 6.5 Accessibilité du graphique

**Constat :** Le graphique est affiché dans un `<canvas>` sans alternative textuelle explicite.

**Risque :** Les informations représentées peuvent être difficiles d'accès pour certains utilisateurs.

**Amélioration envisagée :** Ajouter une description accessible et envisager une représentation textuelle des données.

### 6.6 Analyse des styles de CountryComponent

**Fichier analysé :** `src/app/pages/country/country.component.scss`

**Points positifs :**

**Le graphique est centré horizontalement grâce à Flexbox.
**Sa largeur est limitée à 50 % du conteneur parent sur les grands écrans.
**Une media query adapte sa largeur à 100 % lorsque la fenêtre mesure au maximum 1000 pixels.

**Points de vigilance :**

**Dimensionnement différent entre les pages :** contrairement à `CountryComponent`, `HomeComponent` ne possède pas de règle CSS spécifique limitant la largeur de son graphique. Cette différence peut contribuer aux problèmes d'affichage observés.

**Nom de classe générique :** la classe `.container` pourrait être renommée pour exprimer plus précisément son rôle.

**Responsive à vérifier :** le seuil de 1000 pixels mérite d'être testé sur différentes tailles d'écran pour confirmer la qualité de l'affichage.

**Amélioration envisagée :** Harmoniser les règles de dimensionnement des graphiques et améliorer la précision des noms de classes si nécessaire.

## 7. Analyse du routage Angular

**Fichier analysé :** `src/app/app-routing.module.ts`

### 7.1 Organisation générale du routage

**Constat :** Les routes sont centralisées dans `AppRoutingModule`. L'application définit une route d'accueil, une route paramétrée pour les pays et une page destinée aux URL inconnues.

**Analyse :** Cette organisation est cohérente avec la taille actuelle de l'application. La route wildcard `**` est correctement placée en dernière position.

### 7.2 Gestion insuffisante des pays inexistants

**Constat :** La route `country/:countryName` accepte toute valeur pour le paramètre `countryName`. Cependant, `CountryComponent` ne vérifie pas que le pays recherché existe avant d'accéder à ses propriétés.

**Conséquence :** Une URL telle que `/country/Atlantide` peut provoquer une erreur d'exécution au lieu d'afficher une page adaptée.

**Amélioration envisagée :** Vérifier l'existence du pays et rediriger vers la page `not-found`, ou afficher un message explicite.

### 7.3 Réutilisation de la page NotFoundComponent

**Constat :** Une page `NotFoundComponent` existe déjà et est utilisée pour les URL inconnues.

**Amélioration envisagée :** Réutiliser ce composant pour traiter les cas où un pays demandé n'existe pas dans les données.

## 8. Analyse du module principal

**Fichier analysé :** `src/app/app.module.ts`

### 8.1 Configuration du module Angular

**Constat :** L'application utilise une architecture basée sur les NgModules. Les composants sont regroupés dans `declarations`, les modules nécessaires sont importés et `AppComponent` est défini comme composant racine.

**Analyse :** Cette configuration est cohérente avec l'organisation actuelle du projet. L'utilisation des NgModules reste valide dans Angular.

### 8.2 Configuration de HttpClient

**Constat :** `HttpClient` est configuré au niveau du module principal avec `provideHttpClient()`.

**Analyse :** Cette configuration permet l'injection de `HttpClient` dans les composants et les services. Elle ne constitue pas une anomalie.

### 8.3 Évolution envisagée

**Constat :** Aucun service dédié aux données olympiques n'a été identifié dans les fichiers examinés.

**Amélioration envisagée :** Créer un service partagé pour centraliser l'accès aux données, sans nécessiter de refonte complète du module principal.

## 9. Analyse des tests unitaires

**Fichiers analysés :**

* `home.component.spec.ts`
* `country.component.spec.ts`
* `not-found.component.spec.ts`
* `app.component.spec.ts`

### 9.1 Couverture fonctionnelle insuffisante — Priorité haute

**Constat :** Les tests de `HomeComponent`, `CountryComponent` et `NotFoundComponent` vérifient uniquement la création des composants.

**Conséquences :** Les calculs des statistiques olympiques, la construction des graphiques, la navigation et la gestion des erreurs ne sont pas couverts par des tests dédiés.

**Amélioration envisagée :** Ajouter des tests unitaires pour les calculs métier, les comportements des composants et les cas d'erreur.

### 9.2 Configuration incomplète des tests — Priorité haute

**Constat :** Les tests de `HomeComponent` et `CountryComponent` ne déclarent pas explicitement les dépendances nécessaires à l'injection de `HttpClient` et des services de routage.

**Conséquence :** Leur initialisation peut échouer en raison de dépendances non fournies.

**Amélioration envisagée :** Configurer les dépendances de test et simuler les appels HTTP afin d'isoler les comportements à vérifier.

### 9.3 Tests potentiellement obsolètes — Priorité moyenne

**Constat :** Les tests d'`AppComponent` contiennent des assertions liées au projet de démarrage Angular, notamment au titre `olympic-games-starter`.

**Conséquence :** Ces assertions pourraient ne plus correspondre au comportement actuel de l'application.

**Amélioration envisagée :** Comparer les assertions avec le composant réel, supprimer les vérifications obsolètes et tester le comportement attendu.

### 9.4 Vérification à effectuer

Exécuter la commande `npx ng test --watch=false` afin d'obtenir l'état réel de la suite de tests avant toute modification.

### 9.5 Résultat de l'exécution des tests

**Commande exécutée :** `npx ng test --watch=false`

**Résultat :** Échec de la compilation des tests.

**Erreur confirmée :** `TS2339: Property 'title' does not exist on type 'AppComponent'`, dans `app.component.spec.ts`, ligne 26.

**Analyse :** Le test référence une propriété qui n'existe plus dans le composant. Il n'a donc pas été maintenu à jour lors de l'évolution de l'application.

**Conséquence :** La suite de tests ne peut pas être exécutée correctement dans son état actuel.

**Priorité : Haute.**

**Correction envisagée :** Mettre à jour les tests d'`AppComponent` pour qu'ils correspondent au comportement actuel de l'application, puis relancer la suite de tests.

## 10. Analyse du composant racine

**Fichiers analysés :**

* `src/app/app.component.ts`
* `src/app/app.component.html`

### 10.1 Structure du composant

**Constat :** `AppComponent` ne contient aucune logique métier. Son template contient uniquement `<router-outlet>`, qui permet d'afficher les composants correspondant aux routes.

**Analyse :** Cette organisation est cohérente. Aucune modification particulière n'est nécessaire.

### 10.2 Tests obsolètes — Priorité haute

**Constat :** Deux tests de `app.component.spec.ts` ne correspondent plus au composant actuel :

* Un test vérifie une propriété `title` inexistante.
* Un autre recherche un élément HTML `.content span` absent du template.

**Conséquence :** Le premier test provoque une erreur de compilation TypeScript (`TS2339`). Le second échouerait également si la compilation aboutissait.

**Amélioration envisagée :** Supprimer ou remplacer les assertions obsolètes par des tests correspondant au comportement réel du composant racine.

## 11. Synthèse de l'analyse et priorisation des améliorations

L'exploration du starter code de TéléSport m'a permis de constater que l'application fonctionne et présente les informations olympiques attendues. Cependant, son architecture actuelle comporte plusieurs problèmes de maintenabilité, de lisibilité et de robustesse.

### Problèmes identifiés

| Priorité | Problème                                                           | Fichiers concernés                                             | Amélioration envisagée                                                  |
| -------- | ------------------------------------------------------------------ | -------------------------------------------------------------- | ----------------------------------------------------------------------- |
| Haute    | Appels HTTP effectués directement dans les composants et dupliqués | `home.component.ts`, `country.component.ts`                    | Créer un service partagé pour centraliser l'accès aux données           |
| Haute    | Gestion insuffisante d'un pays inexistant                          | `country.component.ts`                                         | Vérifier le résultat de `find()` avant d'accéder aux propriétés du pays |
| Haute    | Tests obsolètes empêchant leur compilation                         | `app.component.spec.ts`                                        | Adapter les tests au composant actuel                                   |
| Haute    | Absence de tests sur les fonctionnalités métier                    | `home.component.spec.ts`, `country.component.spec.ts`          | Ajouter des tests sur les calculs, les graphiques et les erreurs        |
| Moyenne  | Utilisation excessive du type `any`                                | `home.component.ts`, `country.component.ts`                    | Créer des interfaces TypeScript pour les données olympiques             |
| Moyenne  | Calculs métier directement dans les composants                     | `home.component.ts`, `country.component.ts`                    | Extraire les traitements réutilisables                                  |
| Moyenne  | Gestion des observables peu claire                                 | `home.component.ts`, `country.component.ts`                    | Supprimer les `pipe()` vides et améliorer la gestion des flux           |
| Moyenne  | Absence de nettoyage explicite des graphiques                      | `home.component.ts`, `country.component.ts`                    | Détruire les instances Chart.js lors de la destruction des composants   |
| Moyenne  | Gestion des erreurs HTTP non visible dans l'interface              | `home.component.ts`, `country.component.ts` et leurs templates | Afficher des messages d'erreur adaptés                                  |
| Basse    | Instructions `console.log` utilisées pour le débogage              | `home.component.ts`                                            | Supprimer les traces de débogage inutiles                               |
| Basse    | Conversions numériques inutiles                                    | `country.component.ts`                                         | Conserver les données numériques dans leur type d'origine               |
| Basse    | Dimensionnement des graphiques hétérogène                          | Templates et styles des pages                                  | Harmoniser les styles et vérifier le responsive design                  |

### Observations personnelles

L'application est relativement simple à comprendre et son fonctionnement général est satisfaisant. En revanche, j'ai constaté que les composants assument trop de responsabilités : ils récupèrent les données, effectuent les calculs et construisent les graphiques.

Cette organisation entraîne une duplication du code et rend les fonctionnalités plus difficiles à tester et à maintenir.

L'absence d'interfaces TypeScript précises réduit également la sécurité du typage. Certaines erreurs, notamment lorsqu'un pays demandé n'existe pas, pourraient être évitées grâce à des vérifications supplémentaires.

Enfin, les tests unitaires sont insuffisants et certains ne correspondent plus à l'application actuelle. L'exécution de `ng test --watch=false` a notamment révélé une erreur de compilation liée à une propriété `title` inexistante.

### Conclusion

La priorité de la refactorisation sera de séparer les responsabilités, de centraliser l'accès aux données olympiques dans un service, d'améliorer le typage et de sécuriser les traitements.

Ces améliorations permettront de rendre le code plus lisible, maintenable et testable, tout en préparant l'application à une future utilisation d'une API back-end.

À cette étape, aucune modification du code source n'a été effectuée, conformément aux consignes du projet.

# Étape 2 — Proposition d'une architecture Angular maintenable

## 12. Objectifs de la nouvelle architecture

À la suite de l'audit du starter code, je propose une architecture permettant de :

* Séparer la récupération des données, les traitements métier et l'affichage.
* Éviter la duplication des appels HTTP.
* Renforcer le typage avec des interfaces TypeScript.
* Favoriser la réutilisation des composants.
* Faciliter les tests unitaires.
* Préparer une future connexion à une API REST.

## 13. Arborescence proposée

```text
src/app/
├── components/
│   └── stats-card/
│       ├── stats-card.component.ts
│       ├── stats-card.component.html
│       └── stats-card.component.scss
│
├── pages/
│   ├── home/
│   │   └── home.component.*
│   ├── country/
│   │   └── country.component.*
│   └── not-found/
│       └── not-found.component.*
│
├── services/
│   ├── olympic.service.ts
│   └── olympic.service.spec.ts
│
├── models/
│   ├── olympic.model.ts
│   └── participation.model.ts
│
├── app-routing.module.ts
├── app.component.*
└── app.module.ts
```

Les fichiers `*.component.*` représentent les fichiers TypeScript, HTML, SCSS et les tests associés.

## 14. Répartition des responsabilités

| Élément              | Responsabilité                                                         |
| -------------------- | ---------------------------------------------------------------------- |
| `HomeComponent`      | Afficher les statistiques générales et le graphique circulaire         |
| `CountryComponent`   | Afficher les statistiques et l'évolution des médailles d'un pays       |
| `NotFoundComponent`  | Afficher une page adaptée aux ressources inexistantes                  |
| `StatsCardComponent` | Présenter une statistique de manière réutilisable                      |
| `OlympicService`     | Centraliser l'accès aux données olympiques et les traitements partagés |
| `Olympic`            | Définir la structure typée des données d'un pays                       |
| `Participation`      | Définir la structure typée des participations olympiques               |

## 15. Design patterns retenus

### 15.1 Singleton

Le service `OlympicService` sera fourni au niveau racine de l'application avec `providedIn: 'root'`.

Cette approche permet de partager une même instance du service entre les composants.

### 15.2 Séparation des responsabilités

Les composants seront principalement responsables de l'affichage et des interactions utilisateur.

L'accès aux données et les traitements métier réutilisables seront centralisés dans le service.

Cette séparation réduira la duplication du code et améliorera la testabilité.

### 15.3 Observer

Les données seront transmises sous forme d'`Observable` RxJS.

Les composants pourront réagir aux résultats des appels HTTP et gérer les erreurs.

## 16. Préparation à une API REST

Dans un premier temps, `OlympicService` récupérera les données depuis le fichier JSON fourni avec le projet.

Lors d'une future intégration back-end, le service pourra utiliser une API REST sans nécessiter de modifier profondément les composants.

Cette organisation facilite l'évolution de l'application et limite les dépendances entre l'interface utilisateur et la source des données.

## 17. Conclusion

Cette proposition conserve les pages existantes et introduit uniquement les éléments nécessaires à une meilleure maintenabilité.

Elle répond aux problèmes identifiés lors de l'audit tout en évitant une architecture inutilement complexe.

À cette étape, la nouvelle organisation est uniquement documentée : aucune modification du code source n'est encore effectuée.

