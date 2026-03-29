declare namespace Cypress {
  interface Chainable {
    register(firstName: string, lastName: string, login: string, password: string): Chainable<void>;
    login(login: string, password: string): Chainable<void>;
  }
}

Cypress.Commands.add('register', (firstName: string, lastName: string, login: string, password: string) => {
  cy.request('POST', '/api/register', { firstName, lastName, login, password });
});

Cypress.Commands.add('login', (login: string, password: string) => {
  cy.request('POST', '/api/login', { login, password }).then((response) => {
    window.localStorage.setItem('jwt_token', response.body);
  });
});
