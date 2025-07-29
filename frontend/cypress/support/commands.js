Cypress.Commands.add('register', (name, email, password, confirmPassword) => {
  cy.get('#name').clear().type(name);
  cy.get('#email').clear().type(email);
  cy.get('#password').clear().type(password);
  cy.get('#password-confirm').clear().type(confirmPassword);
  cy.get('#register-button').click();
});

Cypress.Commands.add('login', (email, password) => {
  cy.get('#email').clear().type(email);
  cy.get('#password').clear().type(password);
  cy.get('#login-button').click();
});
