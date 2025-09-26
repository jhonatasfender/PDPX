describe("Bag E2E Tests", () => {
  beforeEach(() => {
    cy.intercept("POST", /\/auth\/login$/).as("loginRequest");
    cy.intercept("GET", /\/auth\/me$/).as("meRequest");
    cy.intercept("GET", "**/bag**").as("getBag");
    cy.intercept("POST", "**/bag/items").as("addItemToBag");
    cy.intercept("PUT", "**/bag/items/quantity").as("updateItemQuantity");
    cy.intercept("DELETE", "**/bag/items").as("removeItemFromBag");
    cy.intercept("DELETE", "**/bag**").as("clearBag");
    cy.intercept("POST", "**/bag/checkout").as("checkout");
  });

  const loginAndNavigateToProducts = () => {
    cy.visit("/");

    cy.get('[data-cy="header-login"]').click();
    cy.get('[data-cy="login-email"]').type("jhonatas.fender@gmail.com");
    cy.get('[data-cy="login-password"]').type("senhaSegura123");
    cy.get('[data-cy="login-submit"]').click();
    cy.wait("@loginRequest").its("response.statusCode").should("eq", 200);
    cy.wait("@meRequest")
      .its("response.statusCode")
      .should("be.oneOf", [200, 304]);

    cy.location("pathname", { timeout: 20000 }).should("eq", "/");
    
    cy.get('main', { timeout: 20000 }).should("be.visible");
  };

  const addProductToBag = (productIndex = 0) => {
    cy.get('[data-cy="product-card"]', { timeout: 20000 })
      .should("be.visible")
      .should("have.length.greaterThan", 0);
    
    cy.get('[data-cy="product-card"]')
      .eq(productIndex)
      .within(() => {

        cy.root().trigger('mouseover');
        cy.get('[data-cy="add-to-bag-button"]').click();
      });

    cy.wait("@addItemToBag").then((interception) => {
      expect(interception.response?.statusCode).to.eq(201);
      const productId = (interception.response?.body as any)?.bagItem?.productId;
      if (productId) Cypress.env("addedProductId", productId);
    });
  };

  const navigateToBag = () => {
    cy.get('[data-cy="bag-icon"]').click();

    cy.location("pathname", { timeout: 20000 }).should("include", "/carrinho");
    cy.wait("@getBag")
  };

  it("should handle empty bag state", () => {
    loginAndNavigateToProducts();
    navigateToBag();

    cy.get('[data-cy="bag-empty-message"]', { timeout: 20000 }).should(
      "be.visible",
    );
    cy.get('[data-cy="bag-empty-message"]').should("contain", "vazio");
    
    cy.get('[data-cy="checkout-button"]').should("not.exist");
  });

  it("should add item to bag", () => {
    loginAndNavigateToProducts();

    cy.get('[data-cy="product-card"]').should("have.length.greaterThan", 0);
    
    addProductToBag();
  });

  it("should navigate to bag and view items", () => {
    loginAndNavigateToProducts();

    addProductToBag();
    navigateToBag();

    cy.get('[data-cy="bag-item"]', { timeout: 20000 }).should("be.visible");
    cy.get('[data-cy="bag-summary"]', { timeout: 20000 }).should("be.visible");
    cy.get('[data-cy="bag-total-items"]').should("be.visible");
  });

  it("should update item quantity in bag", () => {
    loginAndNavigateToProducts();

    addProductToBag();
    navigateToBag();

    cy.get('[data-cy="bag-item"]', { timeout: 20000 }).should("be.visible");

    cy.get('[data-cy="bag-item"]')
      .first()
      .within(() => {
        cy.get('[data-cy="quantity-plus"]').click();
      });

    cy.wait("@updateItemQuantity").then((interception) => {
      expect(interception.response?.statusCode).to.eq(200);
    });

    cy.get('[data-cy="bag-total-items"]').should("not.be.empty");
  });

  it("should decrease item quantity in bag", () => {
    loginAndNavigateToProducts();

    addProductToBag();
    navigateToBag();

    cy.get('[data-cy="bag-item"]', { timeout: 20000 }).should("be.visible");

    cy.get('[data-cy="bag-item"]')
      .first()
      .within(() => {
        cy.get('[data-cy="quantity-plus"]').click();
      });

    cy.wait("@updateItemQuantity");

    cy.get('[data-cy="bag-item"]')
      .first()
      .within(() => {
        cy.get('[data-cy="quantity-minus"]').click();
      });

    cy.wait("@updateItemQuantity").then((interception) => {
      expect(interception.response?.statusCode).to.eq(200);
    });

    cy.get('[data-cy="bag-total-items"]').should("not.be.empty");
  });

  it("should remove item from bag", () => {
    loginAndNavigateToProducts();

    addProductToBag();
    navigateToBag();

    cy.get('[data-cy="bag-item"]', { timeout: 20000 }).should("be.visible");

    cy.get('[data-cy="bag-item"]')
      .first()
      .within(() => {
        cy.get('[data-cy="remove-item-button"]').click();
      });

    cy.wait("@removeItemFromBag").then((interception) => {
      expect(interception.response?.statusCode).to.eq(200);
    });
  });

  it("should clear entire bag", () => {
    loginAndNavigateToProducts();

    addProductToBag();
    navigateToBag();

    cy.get('[data-cy="bag-item"]', { timeout: 20000 }).should("be.visible");

    cy.get('[data-cy="clear-bag-button"]').click();

    cy.wait("@clearBag").then((interception) => {
      expect(interception.response?.statusCode).to.eq(200);
    });

    cy.get('[data-cy="bag-empty-message"]', { timeout: 20000 }).should(
      "be.visible",
    );
    cy.get('[data-cy="bag-empty-message"]').should("contain", "vazio");
  });

  it("should finalize purchase (checkout)", () => {
    loginAndNavigateToProducts();

    addProductToBag();
    navigateToBag();

    cy.get('[data-cy="bag-item"]', { timeout: 20000 }).should("be.visible");

    cy.get('[data-cy="checkout-button"]').click();

    cy.wait("@checkout").then((interception) => {
      expect(interception.response?.statusCode).to.eq(200);
    });

    cy.get('[data-cy="bag-empty-message"]', { timeout: 20000 }).should(
      "be.visible",
    );
    cy.get('[data-cy="bag-empty-message"]').should("contain", "vazio");
  });

  it("should add multiple items to bag", () => {
    loginAndNavigateToProducts();

    // Verificar se há pelo menos 2 produtos disponíveis
    cy.get('[data-cy="product-card"]').should("have.length.greaterThan", 1);
    
    addProductToBag(0);
    addProductToBag(1);

    navigateToBag();

    cy.get('[data-cy="bag-item"]', { timeout: 20000 }).should("have.length", 2);
    cy.get('[data-cy="bag-total-items"]').should("contain", "2");
  });

  it("should show correct total price", () => {
    loginAndNavigateToProducts();

    addProductToBag();
    navigateToBag();

    cy.get('[data-cy="bag-item"]', { timeout: 20000 }).should("be.visible");

    cy.get('[data-cy="bag-item"]')
      .first()
      .within(() => {
        cy.get('[data-cy="item-total-price"]').should("be.visible");
      });

    cy.get('[data-cy="bag-summary-total"]').should("be.visible");
  });
});