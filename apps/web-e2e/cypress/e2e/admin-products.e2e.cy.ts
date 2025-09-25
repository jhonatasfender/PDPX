describe("Admin Products E2E Tests", () => {
  beforeEach(() => {
    cy.intercept("POST", /\/auth\/login$/).as("loginRequest");
    cy.intercept("GET", /\/auth\/me$/).as("meRequest");
    cy.intercept("GET", "**/admin/products*").as("adminProducts");
  });

  const loginAndNavigateToProducts = () => {
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
  };

  it("should create a new product", () => {
    cy.intercept("POST", "**/admin/products").as("createProduct");
    
    loginAndNavigateToProducts();

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
  });

  it("should edit an existing product", () => {
    cy.intercept("PUT", "**/admin/products/*").as("updateProduct");
    cy.intercept("GET", "**/admin/products/*").as("getProduct");
    
    loginAndNavigateToProducts();

    cy.get('[data-cy="admin-products-loading"]', { timeout: 20000 }).should(
      "not.exist",
    );
    cy.get('[data-cy="admin-products-error"]').should("not.exist");
    cy.get('[data-cy="admin-products-table"]', { timeout: 20000 }).should(
      "be.visible",
    );
    
    cy.get('[data-cy="admin-products-table"] tbody tr', { timeout: 10000 }).should('have.length.greaterThan', 0);
    
    cy.get('[data-cy="admin-products-table"] tbody tr').first().within(() => {
      cy.get('[data-cy="btn-editar"]').click();
    });

    cy.wait("@getProduct").its("response.statusCode").should("eq", 200);
    
    cy.location("pathname", { timeout: 20000 }).should("include", "/edit");
    cy.get('[data-cy="admin-edit-form"]', { timeout: 20000 }).should("be.visible");

    cy.get('[data-cy="product-name"]').clear().typeProductName("Produto Editado");
    cy.get('[data-cy="product-brand"]').clear().typeBrand("Marca Editada");
    cy.get('[data-cy="product-sku"]').clear().typeSKU();
    cy.get('[data-cy="product-price"]').clear().typePrice(299.99);
    cy.get('[data-cy="product-stock"]').clear().typeStock(25);
    cy.get('[data-cy="product-status"]').select("false");
    cy.get('[data-cy="product-description"]').clear().type(
      "Descrição editada do produto teste automática.",
    );

    cy.get('[data-cy="product-submit"]').click();

    cy.wait("@updateProduct").then((interception) => {
      expect(interception.response?.statusCode).to.eq(200);
    });

    cy.location("pathname", { timeout: 20000 }).should(
      "include",
      "/admin/products",
    );
    cy.location("pathname", { timeout: 20000 }).should("not.include", "/edit");

    cy.wait("@adminProducts");
    cy.get('[data-cy="admin-products-table"]', { timeout: 20000 }).should(
      "be.visible",
    );
    cy.get('[data-cy="admin-products-table"]').validateProductName();
    cy.get('[data-cy="admin-products-table"]').validateBrand();
    cy.get('[data-cy="admin-products-table"]').validatePrice();
    cy.get('[data-cy="admin-products-table"]').validateStock();
    cy.get('[data-cy="admin-products-table"]').should("contain", "Inativo");
  });

  it("should delete a product", () => {
    cy.intercept("DELETE", "**/admin/products/*").as("deleteProduct");
    
    loginAndNavigateToProducts();

    cy.get('[data-cy="admin-products-loading"]', { timeout: 20000 }).should(
      "not.exist",
    );
    cy.get('[data-cy="admin-products-error"]').should("not.exist");
    cy.get('[data-cy="admin-products-table"]', { timeout: 20000 }).should(
      "be.visible",
    );
    
    cy.get('[data-cy="admin-products-table"] tbody tr', { timeout: 10000 }).should('have.length.greaterThan', 0);
    
    cy.get('[data-cy="admin-products-table"] tbody tr').first().within(() => {
      cy.get('[data-cy="col-produto"]').invoke('text').then((productName) => {
        Cypress.env("productToDelete", productName.trim());
      });
    });

    cy.get('[data-cy="admin-products-table"] tbody tr').first().within(() => {
      cy.get('[data-cy="action-excluir"]').click();
    });

    cy.get('[data-cy="confirmation-modal"]', { timeout: 10000 }).should("be.visible");
    cy.get('[data-cy="confirmation-modal-title"]').should("contain", "Confirmar Exclusão");
    
    cy.get('[data-cy="confirmation-modal-confirm"]').click();

    cy.wait("@deleteProduct").then((interception) => {
      expect(interception.response?.statusCode).to.eq(200);
    });

    cy.wait("@adminProducts");
    cy.get('[data-cy="admin-products-table"]', { timeout: 30000 }).should(
      "be.visible",
    );
    
    cy.then(() => {
      const deletedProductName = Cypress.env("productToDelete");
      if (deletedProductName) {
        cy.get('[data-cy="admin-products-table"]', { timeout: 20000 }).should("not.contain", deletedProductName);
      }
    });
  });

  it("should toggle product status", () => {
    cy.intercept("PATCH", "**/admin/products/*/toggle-status").as("toggleStatus");
    
    loginAndNavigateToProducts();

    cy.get('[data-cy="admin-products-loading"]', { timeout: 20000 }).should(
      "not.exist",
    );
    cy.get('[data-cy="admin-products-error"]').should("not.exist");
    cy.get('[data-cy="admin-products-table"]', { timeout: 20000 }).should(
      "be.visible",
    );
    
    cy.get('[data-cy="admin-products-table"] tbody tr', { timeout: 10000 }).should('have.length.greaterThan', 0);
    
    cy.get('[data-cy="admin-products-table"] tbody tr').first().within(() => {
      cy.get('[data-cy="col-status"]').invoke('text').then((status) => {
        Cypress.env("originalStatus", status.trim());
      });
    });

    cy.get('[data-cy="admin-products-table"] tbody tr').first().within(() => {
      cy.get('[data-cy="action-toggle-status"]').click();
    });

    cy.wait("@toggleStatus").then((interception) => {
      expect(interception.response?.statusCode).to.eq(200);
    });

    cy.wait("@adminProducts");
    cy.get('[data-cy="admin-products-table"]', { timeout: 30000 }).should(
      "be.visible",
    );
    
    cy.then(() => {
      const originalStatus = Cypress.env("originalStatus");
      const expectedStatus = originalStatus === "Ativo" ? "Inativo" : "Ativo";
      
      cy.get('[data-cy="admin-products-table"] tbody tr').first().within(() => {
        cy.get('[data-cy="col-status"]', { timeout: 20000 }).should("not.contain", originalStatus);
        cy.get('[data-cy="col-status"]', { timeout: 20000 }).should("contain", expectedStatus);
      });
    });
  });
});
