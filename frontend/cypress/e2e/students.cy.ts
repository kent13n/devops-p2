describe('Gestion des étudiants', () => {
  const user = {
    firstName: 'Test',
    lastName: 'Student',
    login: `student_${Date.now()}`,
    password: 'password123'
  };

  const student = {
    firstName: 'Marie',
    lastName: 'Martin',
    email: `marie_${Date.now()}@mail.com`
  };

  before(() => {
    cy.register(user.firstName, user.lastName, user.login, user.password);
  });

  it('devrait rediriger vers /login si non authentifié', () => {
    cy.visit('/students');
    cy.url().should('include', '/login');
  });

  it('devrait ajouter un étudiant', () => {
    cy.login(user.login, user.password);
    cy.visit('/students/create');

    cy.get('input[formControlName="firstName"]').type(student.firstName);
    cy.get('input[formControlName="lastName"]').type(student.lastName);
    cy.get('input[formControlName="email"]').type(student.email);
    cy.get('button').contains('Ajouter').click();

    cy.url().should('include', '/students');
    cy.url().should('not.include', '/create');
    cy.contains(student.firstName).should('be.visible');
    cy.contains(student.email).should('be.visible');
  });

  it('devrait afficher une erreur si email déjà existant (create)', () => {
    cy.login(user.login, user.password);
    cy.visit('/students/create');

    cy.get('input[formControlName="firstName"]').type('Autre');
    cy.get('input[formControlName="lastName"]').type('Personne');
    cy.get('input[formControlName="email"]').type(student.email);
    cy.get('button').contains('Ajouter').click();

    cy.get('.alert-danger').should('be.visible');
  });

  it('devrait modifier un étudiant', () => {
    cy.login(user.login, user.password);
    cy.visit('/students');

    cy.get('a').contains('Modifier').first().click();
    cy.url().should('include', '/edit');

    cy.get('input[formControlName="lastName"]').clear().type('Dupont');
    cy.get('button').contains('Modifier').click();

    cy.url().should('include', '/students');
    cy.url().should('not.include', '/edit');
    cy.contains('Dupont').should('be.visible');
  });

  it('devrait annuler la modification et revenir à la liste', () => {
    cy.login(user.login, user.password);
    cy.visit('/students');

    cy.get('a').contains('Modifier').first().click();
    cy.url().should('include', '/edit');

    cy.get('button').contains('Annuler').click();
    cy.url().should('include', '/students');
    cy.url().should('not.include', '/edit');
  });

  it('devrait afficher une erreur pour un id inexistant (edit)', () => {
    cy.login(user.login, user.password);
    cy.visit('/students/99999/edit');

    cy.get('.alert-danger').should('be.visible');
  });

  it('devrait annuler la suppression via le dialog', () => {
    cy.login(user.login, user.password);
    cy.visit('/students');

    cy.contains(student.firstName).should('be.visible');
    cy.get('button').contains('Supprimer').first().click();

    // Cliquer Annuler dans le dialog
    cy.get('button').contains('Annuler').click();

    // L'étudiant est toujours là
    cy.contains(student.firstName).should('be.visible');
  });

  it('devrait supprimer un étudiant', () => {
    cy.login(user.login, user.password);
    cy.visit('/students');

    cy.contains(student.firstName).should('be.visible');
    cy.get('button').contains('Supprimer').first().click();

    cy.get('button').contains('Confirmer').click();

    cy.contains(student.email).should('not.exist');
  });

  it('devrait afficher un message si aucun étudiant', () => {
    cy.login(user.login, user.password);
    cy.visit('/students');

    cy.contains('Aucun étudiant').should('be.visible');
  });

  it('devrait afficher une erreur si le chargement de la liste échoue', () => {
    cy.login(user.login, user.password);
    cy.intercept('GET', '/api/students', { statusCode: 500, body: { message: 'Erreur serveur' } });
    cy.visit('/students');

    cy.get('.alert-danger').should('be.visible');
  });

  it('devrait afficher une erreur pour un id invalide (edit)', () => {
    cy.login(user.login, user.password);
    cy.visit('/students/abc/edit');

    cy.get('.alert-danger').should('be.visible');
  });

  it('devrait afficher une erreur si la modification échoue', () => {
    cy.login(user.login, user.password);

    // Créer un étudiant via l'API
    cy.window().then((win) => {
      const token = win.localStorage.getItem('jwt_token');
      cy.request({
        method: 'POST',
        url: '/api/students',
        body: { firstName: 'Temp', lastName: 'Test', email: `temp_${Date.now()}@mail.com` },
        headers: { Authorization: `Bearer ${token}` }
      }).then((res) => {
        const id = res.body.id;

        // Intercepter le PUT pour simuler une erreur
        cy.intercept('PUT', `/api/students/${id}`, { statusCode: 400, body: { message: 'Email déjà utilisé' } });
        cy.visit(`/students/${id}/edit`);

        cy.get('input[formControlName="lastName"]').clear().type('Nouveau');
        cy.get('button').contains('Modifier').click();

        cy.get('.alert-danger').should('be.visible');
      });
    });
  });
});
