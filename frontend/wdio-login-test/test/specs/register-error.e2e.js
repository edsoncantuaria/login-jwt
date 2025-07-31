import { register } from "../helpers/register.js";
import { expect } from "@wdio/globals";

describe("Validação de Erros no Registro", () => {
  beforeEach(async () => {
    await browser.url("http://localhost:5173/register");

    const themeBtn = await $("#theme-toggle-button");
    await themeBtn.click();
  });

  it("Erro: nome vazio", async () => {
    await register(" ", "teste@email.com", "Teste@123", "Teste@123");
    const errorMsg = await $("#error-message");
    await expect(errorMsg).toContain("Nome é muito curto");
  });

  it("Erro: nome muito curto", async () => {
    await register("Ed", "teste@email.com", "Teste@123", "Teste@123");
    const errorMsg = await $("#error-message");
    await expect(errorMsg).toContain("Nome é muito curto");
  });

  it("Erro: usuário já cadastrado", async () => {
    await register("Edson123", "teste@email.com", "Teste@123", "Teste@123");
    const errorMsg = await $('[data-testid="register-error-message"]');
    await expect(errorMsg).toContain("Usuário já existe");
  });

  it("Erro: email inválido", async () => {
    await register("Edson", "teste@1", "Teste@123", "Teste@123");
    const errorMsg = await $("#error-message");
    await expect(errorMsg).toContain("Email inválido");
  });

  it("Erro: senha fraca", async () => {
    await register("Edson", "teste@email.com", "123456", "123456");
    const errorMsg = await $("#error-message");
    await expect(errorMsg).toContain(
      "Senha deve conter letra maiúscula, minúscula, número e caractere especial"
    );
  });

  it("Erro: senhas diferentes", async () => {
    await register("Edson", "teste@email.com", "Teste@123", "Diferente123");
    const errorMsg = await $("#error-message");
    await expect(errorMsg).toContain("As senhas não coincidem");
  });
});
