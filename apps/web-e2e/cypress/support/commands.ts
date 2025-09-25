import "cypress-mailslurp";

declare global {
  namespace Cypress {
    interface Chainable {
      loginViaUi(args: { email: string; password: string }): Chainable<void>;
      interceptLogin(): Chainable<void>;
      logIntercept(): Chainable<any>;
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
      imageUrl(
        seed?: string | number,
        width?: number,
        height?: number,
      ): Chainable<string>;
      typeImageUrl(
        seed?: string | number,
        width?: number,
        height?: number,
      ): Chainable<JQuery<HTMLElement>>;
      typeSKU(): Chainable<string>;
      typePrice(value?: number | string): Chainable<string>;
      validateSKU(): Chainable<JQuery<HTMLElement>>;
      validatePrice(): Chainable<JQuery<HTMLElement>>;
      typeStock(value?: number | string): Chainable<string>;
      validateStock(): Chainable<JQuery<HTMLElement>>;
      fillProductImages(count?: number, seedPrefix?: string): Chainable<void>;
      typeProductName(value?: string): Chainable<string>;
      validateProductName(): Chainable<JQuery<HTMLElement>>;
      typeBrand(value?: string): Chainable<string>;
      validateBrand(): Chainable<JQuery<HTMLElement>>;
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

Cypress.Commands.add(
  "typeSKU",
  { prevSubject: true },
  (subject: JQuery<HTMLElement>) => {
    const generated = `SKU-${Math.random().toString(36).slice(2, 8).toUpperCase()}-${Date.now().toString(36).toUpperCase()}`;
    Cypress.env("generatedSku", generated);
    return cy
      .wrap(subject)
      .clear()
      .type(generated)
      .then(() => cy.wrap(generated, { log: false }));
  },
);

Cypress.Commands.add(
  "validateSKU",
  { prevSubject: true },
  (subject: JQuery<HTMLElement>) => {
    const sku = Cypress.env("generatedSku");
    return cy.wrap(subject).should("contain", sku);
  },
);

Cypress.Commands.add(
  "validatePrice",
  { prevSubject: true },
  (subject: JQuery<HTMLElement>) => {
    const price = Cypress.env("generatedPriceBRL");
    const normalize = (s: string) => s.replace(/[\u00A0\s]/g, "");
    return cy
      .wrap(subject)
      .invoke("text")
      .then((text) => {
        expect(normalize(text)).to.contain(normalize(price));
        return subject;
      });
  },
);

Cypress.Commands.add(
  "typeStock",
  { prevSubject: true },
  (subject: JQuery<HTMLElement>, value?: number | string) => {
    const stockNum =
      value !== undefined ? Number(value) : Math.floor(Math.random() * 50 + 1);
    const stockStr = String(stockNum);
    Cypress.env("generatedStock", stockStr);
    return cy
      .wrap(subject)
      .clear()
      .type(stockStr)
      .then(() => cy.wrap(stockStr, { log: false }));
  },
);

Cypress.Commands.add(
  "validateStock",
  { prevSubject: true },
  (subject: JQuery<HTMLElement>) => {
    const stockStr = Cypress.env("generatedStock");
    return cy.wrap(subject).should("contain", stockStr);
  },
);

Cypress.Commands.add(
  "fillProductImages",
  (count: number = 12, seedPrefix: string = "pdpx") => {
    cy.wrap(Array.from({ length: count }, (_, i) => i)).each((i) => {
      cy.get('[data-cy="product-image-add"]').click();
      cy.get(`[data-cy="product-image-${i}-url"]`).typeImageUrl(
        `${seedPrefix}${Number(i) + 1}`,
      );
      cy.get(`[data-cy="product-image-${i}-alt"]`).type(
        `Imagem ${Number(i) + 1}`,
      );
      cy.get(`[data-cy\="product-image-${i}-position\"]`).clear().type(`${i}`);
      if (Number(i) === 0) {
        cy.get(`[data-cy="product-image-${i}-primary"]`).check();
      }
    });
  },
);

Cypress.Commands.add(
  "typeProductName",
  { prevSubject: true },
  (subject: JQuery<HTMLElement>, value?: string) => {
    const generated =
      value ?? `Produto Teste ${Math.floor(Math.random() * 100000)}`;
    Cypress.env("generatedProductName", generated);
    return cy
      .wrap(subject)
      .should("be.visible")
      .clear()
      .type(generated)
      .then(() => cy.wrap(generated, { log: false }));
  },
);

Cypress.Commands.add(
  "validateProductName",
  { prevSubject: true },
  (subject: JQuery<HTMLElement>) => {
    const name = Cypress.env("generatedProductName");
    return cy.wrap(subject).should("contain", name);
  },
);

Cypress.Commands.add(
  "typeBrand",
  { prevSubject: true },
  (subject: JQuery<HTMLElement>, value?: string) => {
    const generated = value ?? `Marca ${Math.floor(Math.random() * 100000)}`;
    Cypress.env("generatedBrand", generated);
    return cy
      .wrap(subject)
      .clear()
      .type(generated)
      .then(() => cy.wrap(generated, { log: false }));
  },
);

Cypress.Commands.add(
  "validateBrand",
  { prevSubject: true },
  (subject: JQuery<HTMLElement>) => {
    const brand = Cypress.env("generatedBrand");
    return cy.wrap(subject).should("contain", brand);
  },
);

Cypress.Commands.add(
  "typePrice",
  { prevSubject: true },
  (subject: JQuery<HTMLElement>, value?: number | string) => {
    const num =
      value !== undefined ? Number(value) : Math.random() * 1000 + 100;
    const raw = num.toFixed(2);
    const formatted = new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(num);
    Cypress.env("generatedPriceRaw", raw);
    Cypress.env("generatedPriceBRL", formatted);
    return cy
      .wrap(subject)
      .clear()
      .type(raw)
      .then(() => cy.wrap(raw, { log: false }));
  },
);

Cypress.Commands.add("interceptLogin", () => {
  cy.intercept("POST", "**/auth/login").as("authLogin");
});

Cypress.Commands.add(
  "logIntercept",
  { prevSubject: true },
  (interception: any) => {
    const method = interception.request?.method;
    const url = (interception as any)?.request?.url || "";
    const status = interception.response?.statusCode;

    Cypress.log({
      name: "logIntercept",
      message: `${method} ${url} -> ${status}`,
    });

    console.debug("Intercept:", { method, url, status });

    return cy.wrap(interception, { log: false });
  },
);

Cypress.Commands.add(
  "imageUrl",
  (seed?: string | number, width: number = 800, height: number = 600) => {
    const base = seed ?? Math.random().toString(36).slice(2);
    const unique = `${base}-${Date.now()}-${Math.random()
      .toString(36)
      .slice(2, 8)}`;
    const url = `https://picsum.photos/seed/${unique}/${width}/${height}`;
    return cy.wrap(url, { log: false });
  },
);

Cypress.Commands.add(
  "typeImageUrl",
  { prevSubject: true },
  (
    subject: JQuery<HTMLElement>,
    seed?: string | number,
    width: number = 800,
    height: number = 600,
  ) => {
    const base = seed ?? Math.random().toString(36).slice(2);
    const unique = `${base}-${Date.now()}-${Math.random()
      .toString(36)
      .slice(2, 8)}`;
    const url = `https://picsum.photos/seed/${unique}/${width}/${height}`;
    return cy.wrap(subject).type(url);
  },
);

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
