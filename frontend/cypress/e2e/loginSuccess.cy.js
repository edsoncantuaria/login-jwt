describe('Login com credenciais válidas', () => {
  beforeEach(() => {
    cy.visit('http://localhost:5173/');
    cy.get('#theme-toggle-button').click();
  });

  it('Deve realizar login com sucesso e ir para dashboard', () => {
    cy.login('edsoncantuaria@outlook.com', 'Edson@123');

    cy.url().should('include', '/dashboard');
    cy.contains('Bem-vindo').should('exist');
  });
});
