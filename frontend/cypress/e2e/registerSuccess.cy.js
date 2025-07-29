describe('Fluxo completo de registro com dados válidos', () => {
  beforeEach(() => {
    cy.visit('http://localhost:5173/');
    cy.get('#register-link > span > button').click();
    cy.url().should('include', '/register');
    cy.get('#theme-toggle-button').click();
  });

  it('Deve registrar com sucesso com e-mail único e redirecionar ou exibir mensagem', () => {
    const timestamp = new Date().toLocaleTimeString('pt-BR').replace(/:/g, '');
    const email = `teste${timestamp}@gmail.com`;

    const nome = 'Edson Cantuaria';
    const senha = 'Teste@123';

    cy.register(nome, email, senha, senha);

    cy.contains('Usuário registrado com sucesso!').should('exist');
    cy.url().should('include', '/'); 
  });
});
