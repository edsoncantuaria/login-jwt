describe("Validação de Erros no Registro", () => {
  beforeEach(() => {
    cy.visit("http://localhost:5173/register");
    cy.get("#theme-toggle-button").click();
  });

  it("Erro: nome vazio", () => {
    cy.register(" ", "teste@email.com", "Teste@123", "Teste@123");
    cy.get("#error-message").should("contain.text", "Nome é muito curto");
  });

  it("Erro: nome muito curto", () => {
    cy.register("Ed", "teste@email.com", "Teste@123", "Teste@123");
    cy.get("#error-message").should("contain.text", "Nome é muito curto");
  });

  it("Erro: usuário já cadastrado no sistema", () => {
    cy.register("Edson123", "teste@email.com", "Teste@123", "Teste@123");
    cy.get('[data-testid="register-error-message"]').should(
      "contain.text",
      "Usuário já existe com esse email cadastrado."
    );
  });

  it("Erro: email inválido", () => {
    cy.register("Edson", "teste@1", "Teste@123", "Teste@123");
    cy.get("#error-message").should("contain.text", "Email inválido");
  });

  it("Erro: senha fraca", () => {
    cy.register("Edson", "teste@email.com", "123456", "123456");
    cy.get("#error-message").should(
      "contain.text",
      "Senha deve conter letra maiúscula, minúscula, número e caractere especial"
    );
  });

  it("Erro: senha e confirmação diferentes", () => {
    cy.register("Edson", "teste@email.com", "Teste@123", "Diferente123");
    cy.get("#error-message").should("contain.text", "As senhas não coincidem");
  });
});
