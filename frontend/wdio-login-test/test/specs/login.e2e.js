describe("Login Page", () => {
  it("deve realizar login com credenciais válidas", async () => {
    await browser.url("http://localhost:5173/");

    const emailInput = await $("#email");
    const passwordInput = await $("#password");
    const loginButton = await $("#login-button");

    await emailInput.setValue("edsoncantuaria@outlook.com");
    await passwordInput.setValue("Edson@123");
    await loginButton.click();

    await browser.pause(4000);

    const isDashboard = await browser.getUrl();
    expect(isDashboard).toContain("/dashboard");
  });
});
