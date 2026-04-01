# EtudiantFrontend

Frontend Angular de l'application EtuBibliothèque — interface de gestion des étudiants abonnés à une bibliothèque.

## Stack technique

- Angular 19.2 (standalone components)
- Angular Material 19.2
- TypeScript 5.7
- Jest 29.7 (tests unitaires)
- Cypress 15.13 (tests E2E)

## Pré-requis

- Node.js 18+ et npm
- Backend Spring Boot démarré sur le port 8080

## Démarrage du serveur de développement

```bash
npm install
npm start
```

L'application est accessible sur `http://localhost:4200/`. Les appels API vers `/api/*` sont redirigés vers le backend via le proxy (`proxy.conf.json`).

## Fonctionnalités

- Inscription et connexion avec authentification JWT
- Guard de route : redirection vers `/login` si non authentifié
- Intercepteur HTTP : injection automatique du token Bearer
- CRUD complet des étudiants (liste, création, modification, suppression)
- Validation des formulaires (reactive forms)
- Dialogue de confirmation pour la suppression

## Build de production

```bash
npm run build
```

Les fichiers compilés sont générés dans le répertoire `dist/`.

## Tests unitaires (Jest)

```bash
npm test
```

- 58 tests unitaires couvrant services, guards, intercepteurs et composants
- Seuil de couverture configuré à 80% (branches, fonctions, lignes, statements)
- Rapport de couverture : `coverage/jest/index.html`

### Couverture Jest

| Métrique   | Couverture | Détail  |
|------------|-----------|---------|
| Statements | **99,04%** | 311/314 |
| Branches   | **93,10%** | 27/29   |
| Functions  | **94,64%** | 53/56   |
| Lines      | **98,96%** | 288/291 |

## Tests end-to-end (Cypress)

Le backend et le frontend doivent être démarrés avant de lancer les tests E2E.

```bash
npm run cypress:open    # mode interactif
npm run cypress:run     # mode headless (CI)
```

- 20 tests E2E couvrant l'authentification et le CRUD étudiants
- Rapport de couverture : `coverage/cypress/index.html`

### Couverture Cypress

| Métrique   | Couverture | Détail  |
|------------|-----------|---------|
| Statements | **93,92%** | 526/560 |
| Branches   | **87,41%** | 125/143 |
| Functions  | **92,85%** | 78/84   |
| Lines      | **94,64%** | 371/392 |
