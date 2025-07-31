export async function register(name, email, password, confirmPassword) {
  const nameInput = await $("#name");
  const emailInput = await $("#email");
  const passwordInput = await $("#password");
  const confirmPasswordInput = await $("#password-confirm");
  const submitBtn = await $("#register-button");

  await nameInput.setValue(name);
  await emailInput.setValue(email);
  await passwordInput.setValue(password);
  await confirmPasswordInput.setValue(confirmPassword);
  await submitBtn.click();
}
