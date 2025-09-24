declare global {
  namespace Cypress {
    interface Chainable {
      loginViaUi(args: { email: string; password: string }): Chainable<void>;
      interceptLogin(): Chainable<void>;
    }
  }
}

Cypress.Commands.add(
  "loginViaUi",
  ({ email, password }: { email: string; password: string }) => {
    cy.visit("/login");
    cy.get('[data-cy="login-email"]').clear().type(email);
    cy.get('[data-cy="login-password"]').clear().type(password, { log: false });
    cy.get('[data-cy="login-submit"]').click();
  },
);

Cypress.Commands.add("interceptLogin", () => {
  cy.intercept("POST", "**/auth/login").as("authLogin");
});

export {};
