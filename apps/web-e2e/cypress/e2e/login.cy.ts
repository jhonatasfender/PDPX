describe("Login", () => {
  it("deve logar com credenciais válidas", () => {
    const email = Cypress.env("E2E_EMAIL") || "user@example.com";
    const password = Cypress.env("E2E_PASSWORD") || "password123";

    cy.interceptLogin();
    cy.loginViaUi({ email, password });
    cy.wait("@authLogin").its("response.statusCode").should("be.within", 200, 299);

    cy.url().should("match", /\/$/);
  });

  it("deve exibir erro com credenciais inválidas", () => {
    cy.visit("/login");
    cy.get('[data-cy="login-email"]').type("invalid@example.com");
    cy.get('[data-cy="login-password"]').type("wrongpass");
    cy.get('[data-cy="login-submit"]').click();

    cy.contains(/erro|inválid/i).should("exist");
  });
});
