describe('Authentification', () => {
  const user = {
    firstName: 'Test',
    lastName: 'Cypress',
    login: `cypress_${Date.now()}`,
    password: 'password123'
  };

  describe('Inscription', () => {
    it('devrait inscrire un nouvel utilisateur', () => {
      cy.visit('/register');
      cy.get('input[formControlName="firstName"]').type(user.firstName);
      cy.get('input[formControlName="lastName"]').type(user.lastName);
      cy.get('input[formControlName="login"]').type(user.login);
      cy.get('input[formControlName="password"]').type(user.password);
      cy.get('button').contains('Register').click();

      cy.url().should('include', '/login');
    });

    it('devrait afficher une erreur si le login existe déjà', () => {
      cy.visit('/register');
      cy.get('input[formControlName="firstName"]').type(user.firstName);
      cy.get('input[formControlName="lastName"]').type(user.lastName);
      cy.get('input[formControlName="login"]').type(user.login);
      cy.get('input[formControlName="password"]').type(user.password);
      cy.get('button').contains('Register').click();

      cy.get('.alert-danger').should('be.visible');
    });

    it('devrait afficher les erreurs de validation sur formulaire vide', () => {
      cy.visit('/register');
      cy.get('button').contains('Register').click();

      cy.get('.invalid-feedback').should('have.length.at.least', 1);
    });
  });

  describe('Connexion', () => {
    it('devrait connecter un utilisateur valide', () => {
      cy.visit('/login');
      cy.get('input[formControlName="login"]').type(user.login);
      cy.get('input[formControlName="password"]').type(user.password);
      cy.get('button').contains('Login').click();

      cy.url().should('include', '/students');
      cy.get('nav').should('be.visible');
      cy.get('nav').should('contain', 'Gestion');
    });

    it('devrait afficher une erreur avec un mauvais mot de passe', () => {
      cy.visit('/login');
      cy.get('input[formControlName="login"]').type(user.login);
      cy.get('input[formControlName="password"]').type('mauvaismdp');
      cy.get('button').contains('Login').click();

      cy.get('.alert-danger').should('be.visible');
    });

    it('devrait afficher les erreurs de validation sur formulaire vide', () => {
      cy.visit('/login');
      cy.get('button').contains('Login').click();

      cy.get('.invalid-feedback').should('have.length.at.least', 1);
    });

    it('devrait réinitialiser le formulaire avec le bouton Reset', () => {
      cy.visit('/login');
      cy.get('input[formControlName="login"]').type('test');
      cy.get('input[formControlName="password"]').type('test');
      cy.get('button').contains('Reset').click();

      cy.get('input[formControlName="login"]').should('have.value', '');
    });
  });

  describe('Déconnexion', () => {
    it('devrait déconnecter et rediriger vers /login', () => {
      cy.visit('/login');
      cy.get('input[formControlName="login"]').type(user.login);
      cy.get('input[formControlName="password"]').type(user.password);
      cy.get('button').contains('Login').click();
      cy.url().should('include', '/students');

      cy.get('button').contains('Déconnexion').click();
      cy.url().should('include', '/login');
    });
  });
});
