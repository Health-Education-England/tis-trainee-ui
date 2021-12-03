/// <reference types="cypress" />
/// <reference path="../../support/index.d.ts" />

describe("Authenticator", () => {
  before(() => {
    cy.visit("./");
  });

  it("Header should show logo and heading", () => {
    cy.get("[data-cy=authLogo]").should("exist");
    cy.get("[data-cy=authTitle]").should(
      "contain.text",
      "Trainee Self-Service"
    );
  });

  it("Footer should have the correct links and copyright text", () => {
    const links: string[] = [
      "https://tis-support.hee.nhs.uk/",
      "https://tis-support.hee.nhs.uk/about-tis/",
      "https://www.hee.nhs.uk/about/privacy-notice"
    ];
    cy.get(".amplify-flex")
      .find("a")
      .should($anchors => {
        expect($anchors).to.have.length(3);
        expect($anchors.first()).to.contain("Support");

        const hrefs = $anchors.map<string>((_i, a) => {
          return Cypress.$(a).attr("href");
        });
        expect(hrefs.get()).to.deep.eq(links);
      });
    cy.get("[data-cy=footerCopy]").should(
      "contain.text",
      "Health Education England"
    );
  });

  it("should remove the privacy & cookies error message and show the Sign up button if checkbox checked", () => {
    cy.get(".amplify-tabs-item").last().click();
    cy.get(".amplify-heading").contains("First time sign-up");
    cy.get(".amplify-field__error-message").should("exist");
    cy.get(".amplify-button").should("be.disabled");
    cy.get(".amplify-checkbox > .amplify-flex").click();
    cy.get(".amplify-field__error-message").should("not.exist");
    cy.get(".amplify-button").should("not.be.disabled");
  });

  it("should show the error and disable Sign up btn when passwords don't match", () => {
    cy.get(".amplify-tabs-item").last().click();
    cy.get('input[name="password"]').clear().type("WaterfallRules1");
    cy.get('input[name="confirm_password"]').clear().type("WaterfallRules");
    cy.get('[style="flex-direction: column;"] > p.amplify-text').should(
      "exist"
    );
    cy.get('[data-fullwidth="true"]').should("be.disabled");
    cy.get(".amplify-passwordfield").last().type("1");
    cy.get('[data-fullwidth="true"]').should("not.be.disabled");
  });

  it("should toggle show and hide the password when clicking the 'show password' btn", () => {
    cy.get("button.amplify-field__show-password").first().click();
    cy.get('input[name="password"]').should("have.attr", "type", "text");
    cy.get("button.amplify-field__show-password").first().click();
    cy.get('input[name="password"]').should("have.attr", "type", "password");
  });
});
