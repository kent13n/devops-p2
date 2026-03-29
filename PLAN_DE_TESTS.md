# Plan de tests — EtuBibliothèque

## 1. Tests unitaires back-end

### 1.1 UserService (6 tests)

| # | Cas de test | Entrée | Sortie attendue | Priorité |
|---|------------|--------|-----------------|----------|
| 1 | Enregistrer un utilisateur `null` | `null` | `IllegalArgumentException` | Simple |
| 2 | Enregistrer un utilisateur valide | User(firstName, lastName, login, password) | User sauvegardé avec mot de passe hashé | Simple |
| 3 | Enregistrer un login déjà existant | User avec login existant en BDD | `IllegalArgumentException` | Simple |
| 4 | Login avec identifiants valides | login + password corrects | Token JWT (String non vide) | Simple |
| 5 | Login avec mauvais mot de passe | login existant + mauvais password | `IllegalArgumentException` | Simple |
| 6 | Login avec login inexistant | login inconnu + password | `IllegalArgumentException` | Simple |

### 1.2 StudentService (10 tests)

| # | Cas de test | Entrée | Sortie attendue | Priorité |
|---|------------|--------|-----------------|----------|
| 7 | Créer un étudiant valide | Student(firstName, lastName, email) | Student sauvegardé avec id généré | Simple |
| 8 | Créer un étudiant avec email existant | Student avec email déjà en BDD | `IllegalArgumentException` | Simple |
| 9 | Récupérer tous les étudiants | aucune | Liste de Student | Simple |
| 10 | Récupérer un étudiant par id existant | id existant | Student correspondant | Simple |
| 11 | Récupérer un étudiant par id inexistant | id inexistant | `ResourceNotFoundException` | Simple |
| 12 | Modifier un étudiant existant | id + nouvelles données | Student mis à jour | Moyen |
| 13 | Modifier avec un email déjà pris | id + email d'un autre étudiant | `IllegalArgumentException` | Moyen |
| 14 | Modifier un id inexistant | id inexistant + données | `ResourceNotFoundException` | Moyen |
| 15 | Supprimer un étudiant existant | id existant | Suppression effectuée (void) | Simple |
| 16 | Supprimer un étudiant inexistant | id inexistant | `ResourceNotFoundException` | Simple |

### 1.3 JwtService (5 tests)

| # | Cas de test | Entrée | Sortie attendue | Priorité |
|---|------------|--------|-----------------|----------|
| 17 | Générer un token | UserDetails(username) | Token JWT valide (String non vide) | Simple |
| 18 | Extraire le username d'un token | Token valide | Username correct | Simple |
| 19 | Valider un token valide | Token + UserDetails correspondant | `true` | Simple |
| 20 | Valider un token avec mauvais user | Token + UserDetails différent | `false` | Moyen |
| 21 | Valider un token expiré | Token expiré + UserDetails | `ExpiredJwtException` | Moyen |

### 1.4 RestExceptionHandler (5 tests)

| # | Cas de test | Entrée | Sortie attendue | Priorité |
|---|------------|--------|-----------------|----------|
| 22 | Gérer IllegalArgumentException | IllegalArgumentException | 400 Bad Request | Simple |
| 23 | Gérer BadCredentialsException | BadCredentialsException | 401 Unauthorized | Simple |
| 24 | Gérer AccessDeniedException | AccessDeniedException | 403 Forbidden | Simple |
| 25 | Gérer ResourceNotFoundException | ResourceNotFoundException | 404 Not Found | Simple |
| 26 | Gérer Exception générique | RuntimeException | 500 Internal Server Error | Simple |

### 1.5 CustomUserDetailService (2 tests)

| # | Cas de test | Entrée | Sortie attendue | Priorité |
|---|------------|--------|-----------------|----------|
| 27 | Charger un utilisateur existant | login existant | UserDetails correspondant | Simple |
| 28 | Charger un utilisateur inexistant | login inconnu | `UsernameNotFoundException` | Simple |

## 2. Tests d'intégration back-end (API)

### 2.1 UserController (6 tests)

| # | Cas de test | Requête | Sortie attendue | Priorité |
|---|------------|---------|-----------------|----------|
| 29 | Register sans données | POST /api/register body: `{}` | 400 Bad Request | Simple |
| 30 | Register valide | POST /api/register body: RegisterDTO complet | 201 Created | Simple |
| 31 | Register login existant | POST /api/register avec login déjà pris | 400 Bad Request | Simple |
| 32 | Login valide | POST /api/login body: login + password corrects | 200 OK + token JWT | Simple |
| 33 | Login mauvais identifiants | POST /api/login body: login + mauvais password | 400 Bad Request | Simple |
| 34 | Login sans données | POST /api/login body: `{}` | 400 Bad Request | Simple |

### 2.2 StudentController (10 tests)

| # | Cas de test | Requête | Sortie attendue | Priorité |
|---|------------|---------|-----------------|----------|
| 35 | Créer un étudiant (authentifié) | POST /api/students + Bearer token | 201 Created + StudentResponseDTO | Simple |
| 36 | Créer sans token | POST /api/students sans header Authorization | 401 Unauthorized | Simple |
| 37 | Créer avec données invalides | POST /api/students body: `{}` + token | 400 Bad Request | Simple |
| 38 | Créer avec email existant | POST /api/students email déjà pris + token | 400 Bad Request | Moyen |
| 39 | Lister les étudiants (authentifié) | GET /api/students + token | 200 OK + liste JSON | Simple |
| 40 | Lister sans token | GET /api/students sans Authorization | 401 Unauthorized | Simple |
| 41 | Récupérer un étudiant par id | GET /api/students/1 + token | 200 OK + StudentResponseDTO | Simple |
| 42 | Récupérer un id inexistant | GET /api/students/999 + token | 404 Not Found | Moyen |
| 43 | Modifier un étudiant | PUT /api/students/1 + body + token | 200 OK + StudentResponseDTO modifié | Moyen |
| 44 | Supprimer un étudiant | DELETE /api/students/1 + token | 204 No Content | Simple |

## 3. Tests unitaires front-end

### 3.1 AuthService (7 tests)

| # | Cas de test | Entrée | Sortie attendue | Priorité |
|---|------------|--------|-----------------|----------|
| 45 | Créer le service | injection | Service instancié | Simple |
| 46 | Sauvegarder un token | `saveToken("jwt123")` | Token présent dans localStorage | Simple |
| 47 | Récupérer le token | Après `saveToken()` | Le token sauvegardé | Simple |
| 48 | Supprimer le token | Après `removeToken()` | `getToken()` retourne `null` | Simple |
| 49 | Vérifier isLoggedIn (connecté) | Token présent | `true` | Simple |
| 50 | Vérifier isLoggedIn (déconnecté) | localStorage vide | `false` | Simple |
| 51 | Logout | Appel `logout()` | Token supprimé + navigation vers `/login` | Simple |

### 3.2 StudentService (6 tests)

| # | Cas de test | Entrée | Sortie attendue | Priorité |
|---|------------|--------|-----------------|----------|
| 52 | Créer le service | injection | Service instancié | Simple |
| 53 | findAll | Appel `findAll()` | GET /api/students appelé | Simple |
| 54 | findById | Appel `findById(1)` | GET /api/students/1 appelé | Simple |
| 55 | create | Appel `create(studentRequest)` | POST /api/students appelé avec le body | Simple |
| 56 | update | Appel `update(1, studentRequest)` | PUT /api/students/1 appelé avec le body | Simple |
| 57 | delete | Appel `delete(1)` | DELETE /api/students/1 appelé | Simple |

### 3.3 UserService (3 tests)

| # | Cas de test | Entrée | Sortie attendue | Priorité |
|---|------------|--------|-----------------|----------|
| 58 | Créer le service | injection | Service instancié | Simple |
| 59 | login | Appel `login(request)` | POST /api/login appelé | Simple |
| 60 | register | Appel `register(user)` | POST /api/register appelé | Simple |

### 3.4 AuthGuard (2 tests)

| # | Cas de test | Entrée | Sortie attendue | Priorité |
|---|------------|--------|-----------------|----------|
| 61 | Utilisateur connecté | `isLoggedIn()` retourne `true` | Guard retourne `true` | Simple |
| 62 | Utilisateur non connecté | `isLoggedIn()` retourne `false` | Redirection vers `/login` | Simple |

### 3.5 AuthInterceptor (2 tests)

| # | Cas de test | Entrée | Sortie attendue | Priorité |
|---|------------|--------|-----------------|----------|
| 63 | Token présent | `getToken()` retourne un token | Header `Authorization: Bearer` ajouté | Simple |
| 64 | Pas de token | `getToken()` retourne `null` | Pas de header Authorization | Simple |

### 3.6 AppComponent (3 tests)

| # | Cas de test | Entrée | Sortie attendue | Priorité |
|---|------------|--------|-----------------|----------|
| 65 | Créer le composant | Rendu | Composant instancié | Simple |
| 66 | isLoggedIn délègue à AuthService | `authService.isLoggedIn()` retourne `true` | `true` | Simple |
| 67 | logout appelle AuthService | Appel `logout()` | `authService.logout()` appelé | Simple |

### 3.7 LoginComponent (7 tests)

| # | Cas de test | Entrée | Sortie attendue | Priorité |
|---|------------|--------|-----------------|----------|
| 68 | Créer le composant | Rendu | Composant instancié | Simple |
| 69 | Affichage du formulaire | Rendu | Champs login + password visibles | Simple |
| 70 | Soumission formulaire invalide | Submit sans remplir | `userService.login()` non appelé | Simple |
| 71 | Soumission valide | login + password remplis | Token sauvegardé + navigation `/` | Moyen |
| 72 | Erreur serveur avec message | Réponse erreur avec message | Message d'erreur affiché | Moyen |
| 73 | Erreur serveur sans message | Réponse erreur sans body | Message d'erreur par défaut | Moyen |
| 74 | Reset du formulaire | Appel `onReset()` | Formulaire vidé, erreurs effacées | Simple |

### 3.8 RegisterComponent (5 tests)

| # | Cas de test | Entrée | Sortie attendue | Priorité |
|---|------------|--------|-----------------|----------|
| 75 | Créer le composant | Rendu | Composant instancié | Simple |
| 76 | Soumission formulaire invalide | Submit sans remplir | `userService.register()` non appelé | Simple |
| 77 | Soumission valide | Formulaire complet | Navigation vers `/login` | Moyen |
| 78 | Erreur serveur avec message | Réponse erreur | Message d'erreur affiché | Moyen |
| 79 | Erreur serveur sans message | Réponse erreur sans body | Message d'erreur par défaut | Moyen |

### 3.9 StudentListComponent (5 tests)

| # | Cas de test | Entrée | Sortie attendue | Priorité |
|---|------------|--------|-----------------|----------|
| 80 | Créer le composant | Rendu | Composant instancié | Simple |
| 81 | Chargement des étudiants au init | Données mockées | Table remplie, loading = false | Simple |
| 82 | Bouton ajouter visible | Rendu | Lien vers `/students/create` présent | Simple |
| 83 | Erreur de chargement | Service retourne erreur | `errorMessage` affiché | Moyen |
| 84 | Loading terminé après chargement | Après subscribe | `loading = false`, `errorMessage = ''` | Simple |

### 3.10 StudentCreateComponent (4 tests)

| # | Cas de test | Entrée | Sortie attendue | Priorité |
|---|------------|--------|-----------------|----------|
| 85 | Créer le composant | Rendu | Composant instancié | Simple |
| 86 | Soumission valide | StudentRequest | `studentService.create()` appelé + navigation | Moyen |
| 87 | Erreur avec message | Réponse erreur | Message d'erreur affiché | Moyen |
| 88 | Erreur sans message | Réponse erreur sans body | Message d'erreur par défaut | Moyen |

### 3.11 StudentEditComponent (7 tests)

| # | Cas de test | Entrée | Sortie attendue | Priorité |
|---|------------|--------|-----------------|----------|
| 89 | Créer et charger l'étudiant | id = 1 | Student chargé | Simple |
| 90 | Id invalide | id = "abc" | Message d'erreur "invalide" | Simple |
| 91 | Étudiant non trouvé avec message | findById retourne erreur | Message serveur affiché | Moyen |
| 92 | Étudiant non trouvé sans message | findById retourne erreur sans body | Message par défaut | Moyen |
| 93 | Modification valide | StudentRequest | `studentService.update()` appelé + navigation | Moyen |
| 94 | Erreur modification | update retourne erreur | Message d'erreur affiché | Moyen |
| 95 | Annulation | Appel `onCancel()` | Navigation vers `/students` | Simple |

### 3.12 StudentFormComponent (5 tests)

| # | Cas de test | Entrée | Sortie attendue | Priorité |
|---|------------|--------|-----------------|----------|
| 96 | Créer le composant | Rendu | Composant instancié | Simple |
| 97 | Mode création (pas d'input student) | Pas de `@Input()` | `isEditMode = false` | Simple |
| 98 | Soumission invalide | Submit sans remplir | `formSubmit` non émis | Simple |
| 99 | Soumission valide | Formulaire rempli | `formSubmit` émis avec StudentRequest | Moyen |
| 100 | Annulation | Appel `onCancel()` | `formCancel` émis | Simple |

### 3.13 ConfirmDialogComponent (2 tests)

| # | Cas de test | Entrée | Sortie attendue | Priorité |
|---|------------|--------|-----------------|----------|
| 101 | Annuler | Clic Annuler | Dialog fermé avec `false` | Simple |
| 102 | Confirmer | Clic Confirmer | Dialog fermé avec `true` | Simple |

## 4. Tests bout en bout (E2E — Cypress)

### 4.1 Authentification (8 tests)

| # | Cas de test | Scénario | Résultat attendu | Priorité |
|---|------------|----------|-----------------|----------|
| 103 | Inscription valide | Remplir register → Submit | Redirection vers /login | Simple |
| 104 | Inscription doublon | Register le même login 2 fois | Message d'erreur affiché | Simple |
| 105 | Inscription formulaire vide | Cliquer Register sans remplir | Erreurs de validation | Simple |
| 106 | Connexion valide | Remplir login → Submit | Redirection /students + navbar | Simple |
| 107 | Connexion mauvais mot de passe | Login avec mauvais password | Message d'erreur affiché | Simple |
| 108 | Connexion formulaire vide | Cliquer Login sans remplir | Erreurs de validation | Simple |
| 109 | Reset du formulaire login | Remplir → Cliquer Reset | Champs vidés | Simple |
| 110 | Déconnexion | Login → Clic Déconnexion | Redirection vers /login | Simple |

### 4.2 Gestion des étudiants (12 tests)

| # | Cas de test | Scénario | Résultat attendu | Priorité |
|---|------------|----------|-----------------|----------|
| 111 | Accès protégé sans auth | Accéder à /students directement | Redirection vers /login | Simple |
| 112 | Ajouter un étudiant | Login → Formulaire create → Submit | Étudiant dans la liste | Moyen |
| 113 | Erreur email existant (create) | Ajouter avec email déjà pris | Message d'erreur affiché | Moyen |
| 114 | Modifier un étudiant | Clic Modifier → Changer → Submit | Données mises à jour | Moyen |
| 115 | Annuler modification | Clic Modifier → Annuler | Retour à la liste | Simple |
| 116 | Erreur id inexistant (edit) | Accéder à /students/99999/edit | Message d'erreur affiché | Moyen |
| 117 | Erreur id invalide (edit) | Accéder à /students/abc/edit | Message d'erreur affiché | Moyen |
| 118 | Erreur modification (intercept) | PUT intercepté avec 400 | Message d'erreur affiché | Complexe |
| 119 | Annuler suppression | Clic Supprimer → Annuler | Étudiant toujours présent | Moyen |
| 120 | Supprimer un étudiant | Clic Supprimer → Confirmer | Étudiant disparu | Moyen |
| 121 | Erreur chargement liste (intercept) | GET intercepté avec 500 | Message d'erreur affiché | Complexe |
| 122 | Liste vide | Après suppression de tous | Message "Aucun étudiant" | Simple |

## Résumé

| Section | Nb tests | Couverture |
|---------|----------|-----------|
| Tests unitaires back-end | 28 | 99.9% (JaCoCo) |
| Tests d'intégration back-end | 16 | inclus dans les 99.9% |
| Tests unitaires front-end | 58 | 86.2% branches (Jest) |
| Tests E2E front-end | 20 | 84.1% branches (Cypress) |
| **Total** | **122** | **> 80% partout** |
