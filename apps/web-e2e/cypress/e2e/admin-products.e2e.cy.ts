describe("Teste", () => {
  it("should login", () => {
    cy.intercept("POST", /\/auth\/login$/).as("loginRequest");
    cy.intercept("GET", /\/auth\/me$/).as("meRequest");
    cy.intercept("GET", "**/admin/products*").as("adminProducts");
    cy.intercept("POST", "**/admin/products").as("createProduct");

    cy.visit("http://localhost:3000");

    cy.get('[data-cy="header-login"]').click();
    cy.get('[data-cy="login-email"]').type("jhonatas.fender@gmail.com");
    cy.get('[data-cy="login-password"]').type("senhaSegura123");
    cy.get('[data-cy="login-submit"]').click();
    cy.wait("@loginRequest").its("response.statusCode").should("eq", 200);
    cy.wait("@meRequest")
      .its("response.statusCode")
      .should("be.oneOf", [200, 304]);

    cy.get('[data-cy="user-menu-trigger"]').click();
    cy.get('[data-cy="user-menu-dropdown"]').should("be.visible");
    cy.get('[data-cy="user-menu-item-admin"]').click();

    cy.location("pathname", { timeout: 20000 }).should("include", "/admin");
    cy.get('[data-cy="admin-nav-produtos"]', { timeout: 20000 })
      .should("be.visible")
      .click();
    cy.location("pathname", { timeout: 20000 }).should(
      "include",
      "/admin/products",
    );

    cy.wait("@adminProducts")
      .logIntercept()
      .its("response.statusCode")
      .should("be.oneOf", [200, 304]);

    cy.get('[data-cy="admin-products-new"]').click();

    cy.location("pathname", { timeout: 20000 }).should(
      "include",
      "/admin/products/new",
    );
    cy.get('[data-cy="admin-product-form"]', { timeout: 20000 }).should(
      "be.visible",
    );

    cy.get('[data-cy="product-name"]', { timeout: 20000 }).typeProductName();
    cy.get('[data-cy="product-brand"]').typeBrand();
    cy.get('[data-cy="product-sku"]').typeSKU();
    cy.get('[data-cy="product-price"]').typePrice();
    cy.get('[data-cy="product-stock"]').typeStock();
    cy.get('[data-cy="product-status"]').select("true");
    cy.get('[data-cy="product-description"]').type(
      "Descrição do produto teste automática.",
    );

    cy.fillProductImages(12, "pdpx");

    cy.get('[data-cy="product-submit"]').click();

    cy.wait("@createProduct").then((interception) => {
      expect(interception.response?.statusCode).to.eq(201);
      const id = (interception.response?.body as any)?.product?.id;
      if (id) Cypress.env("createdProductId", id);
    });

    cy.wait("@adminProducts");
    cy.get('[data-cy="admin-products-loading"]', { timeout: 20000 }).should(
      "not.exist",
    );
    cy.get('[data-cy="admin-products-error"]').should("not.exist");
    cy.get('[data-cy="admin-products-table"]', { timeout: 20000 }).should(
      "be.visible",
    );
    cy.get('[data-cy="admin-products-table"]').validateProductName();
    cy.get('[data-cy="admin-products-table"]').validateBrand();
    cy.get('[data-cy="admin-products-table"]').validateSKU();
    cy.get('[data-cy="admin-products-table"]').validatePrice();
    cy.get('[data-cy="admin-products-table"]').validateStock();
    cy.get('[data-cy="admin-products-table"]').should("contain", "Ativo");

    cy.then(() => {
      const name = Cypress.env("generatedProductName");
      if (name) {
        cy.get('[data-cy="admin-products-table"]').within(() => {
          cy.contains("tr", name).within(() => {
            cy.get('[data-cy="btn-ver"] [data-cy="action-ver"]').click();
          });
        });
        cy.location("pathname", { timeout: 20000 }).should(
          "include",
          "/admin/products/",
        );
      }
    });
  });
});
