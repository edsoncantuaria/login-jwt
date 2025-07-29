beforeEach(() => {
  cy.visit("http://localhost:5173/");
  cy.get("#theme-toggle-button").click();
});

it("Login com sucesso", () => {
  cy.login("teste@email.com", "Teste@123");
});
