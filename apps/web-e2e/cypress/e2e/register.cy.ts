describe("Registro", () => {
  let createdUserEmail: string;
  const password = "senhaSegura123";

  it("deve registrar um novo usuário e confirmar email", () => {
    cy.mailslurp()
      .then((mailslurp: any) => mailslurp.createInbox())
      .then((inbox: any) => {
        const email = inbox.emailAddress;
        const name = "Usuário Teste";

        createdUserEmail = email;

        cy.interceptRegister();
        cy.registerViaUi({ email, password, name });
        cy.wait("@authRegister")
          .its("response.statusCode")
          .should("be.within", 200, 299);

        cy.url().should("include", "/register");
        cy.contains(
          /conta criada com sucesso|confirme seu email|verifique sua caixa de entrada/i,
        ).should("exist");

        cy.mailslurp()
          .then((mailslurp: any) => mailslurp.waitForLatestEmail(inbox.id))
          .then((email: any) => {
            const emailBody = email.body || "";
            const emailSubject = email.subject || "";

            expect(emailSubject).to.include("Confirm Your Signup");
            expect(emailBody).to.include("Confirm your signup");
            expect(emailBody).to.include("Supabase");

            const urlRegex = /href="(https?:\/\/[^"]*verify[^"]*)"/i;
            const urlMatch = emailBody.match(urlRegex);

            let confirmationLink = null;
            if (urlMatch && urlMatch[1]) {
              confirmationLink = urlMatch[1];
            } else {
              const fallbackRegex = /https?:\/\/[^\s"'>]*verify[^\s"'>]*/gi;
              const urls = emailBody.match(fallbackRegex) || [];
              confirmationLink = urls[0] || null;
            }

            expect(confirmationLink).to.exist;
            expect(confirmationLink).to.include("token=");
            expect(confirmationLink).to.include("type=signup");

            cy.confirmEmailViaSupabaseAPI(confirmationLink!);
          });
      });
  });

  it("deve fazer login com usuário criado no teste anterior", () => {
    cy.interceptLogin();
    cy.loginViaUi({ email: createdUserEmail, password });
    cy.wait("@authLogin")
      .its("response.statusCode")
      .should("be.within", 200, 299);
    cy.url().should("not.include", "/login");
  });

  it("deve exibir erro com email já existente", () => {
    const email = createdUserEmail;
    const password = "senhaSegura123";
    const name = "Usuário Teste";

    cy.intercept("POST", "**/auth/register").as("authRegister");
    cy.visit("/register");
    cy.get('[data-cy="register-name"]').type(name);
    cy.get('[data-cy="register-email"]').type(email);
    cy.get('[data-cy="register-password"]').type(password);
    cy.get('[data-cy="register-confirm-password"]').type(password);
    cy.get('[data-cy="register-submit"]').click();

    cy.wait("@authRegister").its("response.statusCode").should("eq", 409);
    cy.contains(
      /usuário com email.*já existe|email já está cadastrado|usuário já existe com este email/i,
    ).should("exist");
  });

  it("deve exibir erro com senhas diferentes", () => {
    const email = "test@example.com";
    const password = "senhaSegura123";
    const confirmPassword = "senhaDiferente456";
    const name = "Usuário Teste";

    cy.visit("/register");
    cy.get('[data-cy="register-name"]').type(name);
    cy.get('[data-cy="register-email"]').type(email);
    cy.get('[data-cy="register-password"]').type(password);
    cy.get('[data-cy="register-confirm-password"]').type(confirmPassword);
    cy.get('[data-cy="register-submit"]').click();

    cy.contains(/senhas não conferem|senhas diferentes/i).should("exist");
  });

  it("deve exibir erro com dados inválidos", () => {
    cy.visit("/register");
    cy.get('[data-cy="register-name"]').type("A");
    cy.get('[data-cy="register-email"]').type("email-invalido@ff");
    cy.get('[data-cy="register-password"]').type("123");
    cy.get('[data-cy="register-confirm-password"]').type("123");
    cy.get('[data-cy="register-submit"]').click();

    cy.contains(/Nome deve ter pelo menos 2 caracteres/i).should("exist");
    cy.contains(/Informe um e-mail válido/i).should("exist");
    cy.contains(/Mínimo de 6 caracteres/i).should("exist");
  });
});
