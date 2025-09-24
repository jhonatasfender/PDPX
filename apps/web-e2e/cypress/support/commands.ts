import "cypress-mailslurp";

declare global {
  namespace Cypress {
    interface Chainable {
      loginViaUi(args: { email: string; password: string }): Chainable<void>;
      interceptLogin(): Chainable<void>;
      registerViaUi(args: {
        email: string;
        password: string;
        name: string;
      }): Chainable<void>;
      interceptRegister(): Chainable<void>;
      testLoginAfterConfirmation(
        email: string,
        password: string,
      ): Chainable<void>;
      confirmEmailViaSupabaseAPI(confirmationLink: string): Chainable<void>;
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

Cypress.Commands.add(
  "registerViaUi",
  ({
    email,
    password,
    name,
  }: {
    email: string;
    password: string;
    name: string;
  }) => {
    cy.visit("/register");
    cy.get('[data-cy="register-name"]').clear().type(name);
    cy.get('[data-cy="register-email"]').clear().type(email);
    cy.get('[data-cy="register-password"]')
      .clear()
      .type(password, { log: false });
    cy.get('[data-cy="register-confirm-password"]')
      .clear()
      .type(password, { log: false });
    cy.get('[data-cy="register-submit"]').click();
  },
);

Cypress.Commands.add("interceptRegister", () => {
  cy.intercept("POST", "**/auth/register").as("authRegister");
});

Cypress.Commands.add(
  "testLoginAfterConfirmation",
  (email: string, password: string) => {
    cy.interceptLogin();
    cy.loginViaUi({ email, password });

    cy.wait("@authLogin").then((interception) => {
      const statusCode = interception.response?.statusCode;
      expect(statusCode).to.be.at.least(200).and.be.below(300);
      cy.url().should("not.include", "/login");
    });
  },
);

Cypress.Commands.add(
  "confirmEmailViaSupabaseAPI",
  (confirmationLink: string) => {
    const urlParts = new URL(confirmationLink);
    const token = urlParts.searchParams.get("token");
    const type = urlParts.searchParams.get("type") || "signup";
    const baseUrl = `${urlParts.origin}${urlParts.pathname}`;

    cy.request({
      method: "POST",
      url: baseUrl,
      body: {
        token_hash: token,
        type: type,
      },
      failOnStatusCode: false,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    }).then((response) => {
      expect(response.status).to.equal(200);
      expect(response.body).to.have.property("access_token");
      expect(response.body.user.email_confirmed_at).to.exist;
    });
  },
);

export {};
