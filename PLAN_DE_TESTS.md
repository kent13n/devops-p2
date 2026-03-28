# Plan de tests — EtuBibliothèque

## 1. Tests unitaires back-end

### 1.1 UserService

| # | Cas de test | Entrée | Sortie attendue | Priorité |
|---|------------|--------|-----------------|----------|
| 1 | Enregistrer un utilisateur `null` | `null` | `IllegalArgumentException` | Simple |
| 2 | Enregistrer un utilisateur valide | User(firstName, lastName, login, password) | User sauvegardé avec mot de passe hashé | Simple |
| 3 | Enregistrer un login déjà existant | User avec login existant en BDD | `IllegalArgumentException` | Simple |
| 4 | Login avec identifiants valides | login + password corrects | Token JWT (String non vide) | Simple |
| 5 | Login avec mauvais mot de passe | login existant + mauvais password | `IllegalArgumentException` | Simple |
| 6 | Login avec login inexistant | login inconnu + password | `IllegalArgumentException` | Simple |

### 1.2 StudentService

| # | Cas de test | Entrée | Sortie attendue | Priorité |
|---|------------|--------|-----------------|----------|
| 7 | Créer un étudiant valide | Student(firstName, lastName, email) | Student sauvegardé avec id généré | Simple |
| 8 | Créer un étudiant avec email existant | Student avec email déjà en BDD | `IllegalArgumentException` | Simple |
| 9 | Récupérer tous les étudiants | aucune | Liste de Student | Simple |
| 10 | Récupérer un étudiant par id existant | id existant | Student correspondant | Simple |
| 11 | Récupérer un étudiant par id inexistant | id inexistant | `ResourceNotFoundException` | Simple |
| 12 | Modifier un étudiant existant | id + nouvelles données | Student mis à jour | Moyen |
| 13 | Modifier avec un email déjà pris | id + email d'un autre étudiant | `IllegalArgumentException` | Moyen |
| 14 | Supprimer un étudiant existant | id existant | Suppression effectuée (void) | Simple |
| 15 | Supprimer un étudiant inexistant | id inexistant | `ResourceNotFoundException` | Simple |

### 1.3 JwtService

| # | Cas de test | Entrée | Sortie attendue | Priorité |
|---|------------|--------|-----------------|----------|
| 16 | Générer un token | UserDetails(username) | Token JWT valide (String non vide) | Simple |
| 17 | Extraire le username d'un token | Token valide | Username correct | Simple |
| 18 | Valider un token valide | Token + UserDetails correspondant | `true` | Simple |
| 19 | Valider un token expiré | Token expiré + UserDetails | `false` | Moyen |
| 20 | Valider un token avec mauvais user | Token + UserDetails différent | `false` | Moyen |

## 2. Tests d'intégration back-end (API)

### 2.1 UserController

| # | Cas de test | Requête | Sortie attendue | Priorité |
|---|------------|---------|-----------------|----------|
| 21 | Register sans données | POST /api/register body: `{}` | 400 Bad Request | Simple |
| 22 | Register valide | POST /api/register body: RegisterDTO complet | 201 Created | Simple |
| 23 | Register login existant | POST /api/register avec login déjà pris | 400 Bad Request | Simple |
| 24 | Login valide | POST /api/login body: login + password corrects | 200 OK + token JWT | Simple |
| 25 | Login mauvais identifiants | POST /api/login body: login + mauvais password | 400 Bad Request | Simple |
| 26 | Login sans données | POST /api/login body: `{}` | 400 Bad Request | Simple |

### 2.2 StudentController

| # | Cas de test | Requête | Sortie attendue | Priorité |
|---|------------|---------|-----------------|----------|
| 27 | Créer un étudiant (authentifié) | POST /api/students + Bearer token | 201 Created + StudentResponseDTO | Simple |
| 28 | Créer sans token | POST /api/students sans header Authorization | 401 Unauthorized | Simple |
| 29 | Créer avec données invalides | POST /api/students body: `{}` + token | 400 Bad Request | Simple |
| 30 | Créer avec email existant | POST /api/students email déjà pris + token | 400 Bad Request | Moyen |
| 31 | Lister les étudiants (authentifié) | GET /api/students + token | 200 OK + liste JSON | Simple |
| 32 | Lister sans token | GET /api/students sans Authorization | 401 Unauthorized | Simple |
| 33 | Récupérer un étudiant par id | GET /api/students/1 + token | 200 OK + StudentResponseDTO | Simple |
| 34 | Récupérer un id inexistant | GET /api/students/999 + token | 404 Not Found | Moyen |
| 35 | Modifier un étudiant | PUT /api/students/1 + body + token | 200 OK + StudentResponseDTO modifié | Moyen |
| 36 | Modifier un id inexistant | PUT /api/students/999 + body + token | 404 Not Found | Moyen |
| 37 | Supprimer un étudiant | DELETE /api/students/1 + token | 204 No Content | Simple |
| 38 | Supprimer un id inexistant | DELETE /api/students/999 + token | 404 Not Found | Moyen |

## 3. Tests unitaires front-end

### 3.1 AuthService

| # | Cas de test | Entrée | Sortie attendue | Priorité |
|---|------------|--------|-----------------|----------|
| 39 | Sauvegarder un token | `saveToken("jwt123")` | Token présent dans localStorage | Simple |
| 40 | Récupérer le token | Après `saveToken()` | Le token sauvegardé | Simple |
| 41 | Supprimer le token | Après `removeToken()` | `getToken()` retourne `null` | Simple |
| 42 | Vérifier isLoggedIn (connecté) | Token présent dans localStorage | `true` | Simple |
| 43 | Vérifier isLoggedIn (déconnecté) | localStorage vide | `false` | Simple |
| 44 | Logout | Appel `logout()` | Token supprimé + navigation vers `/login` | Simple |

### 3.2 StudentService

| # | Cas de test | Entrée | Sortie attendue | Priorité |
|---|------------|--------|-----------------|----------|
| 45 | findAll | Appel `findAll()` | GET /api/students appelé | Simple |
| 46 | findById | Appel `findById(1)` | GET /api/students/1 appelé | Simple |
| 47 | create | Appel `create(studentRequest)` | POST /api/students appelé avec le body | Simple |
| 48 | update | Appel `update(1, studentRequest)` | PUT /api/students/1 appelé avec le body | Simple |
| 49 | delete | Appel `delete(1)` | DELETE /api/students/1 appelé | Simple |

### 3.3 Composants (LoginComponent, RegisterComponent, StudentListComponent)

| # | Cas de test | Entrée | Sortie attendue | Priorité |
|---|------------|--------|-----------------|----------|
| 50 | Login : affichage du formulaire | Rendu du composant | Champs login + password visibles | Simple |
| 51 | Login : soumission formulaire vide | Clic sur Login sans remplir | Messages de validation affichés | Simple |
| 52 | Login : soumission valide | login + password remplis, submit | `userService.login()` appelé | Moyen |
| 53 | Login : erreur serveur | Réponse erreur du service | Message d'erreur affiché | Moyen |
| 54 | Register : soumission valide | Formulaire rempli, submit | `userService.register()` appelé + navigation /login | Moyen |
| 55 | Register : erreur doublon | Réponse erreur du service | Message d'erreur affiché | Moyen |
| 56 | Liste étudiants : affichage table | Données mockées | Table avec les étudiants affichés | Moyen |
| 57 | Liste étudiants : bouton ajouter | Clic sur "Ajouter" | Navigation vers /students/create | Simple |
| 58 | Liste étudiants : suppression | Clic Supprimer + confirmer | `studentService.delete()` appelé | Complexe |

## 4. Tests bout en bout (E2E)

| # | Cas de test | Scénario | Résultat attendu | Priorité |
|---|------------|----------|-----------------|----------|
| 59 | Parcours inscription → connexion | Register → Login → redirection /students | Navbar visible, liste étudiants affichée | Complexe |
| 60 | CRUD complet étudiant | Login → Ajouter → Vérifier dans liste → Modifier → Vérifier → Supprimer | Chaque opération se reflète dans la liste | Complexe |
| 61 | Accès protégé sans auth | Accéder à /students sans être connecté | Redirection vers /login | Moyen |
| 62 | Déconnexion | Login → Clic Déconnexion | Redirection /login, /students inaccessible | Moyen |
