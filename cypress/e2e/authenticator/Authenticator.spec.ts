/// <reference types="cypress" />
/// <reference path="../../support/index.d.ts" />

describe("Authenticator", () => {
  beforeEach(() => {
    cy.visit("/"); //in this instance we do not want to sign-in before the tests
  });

  it("Header should show logo and heading", () => {
    cy.get("[data-cy=authLogo]").should("exist");
    cy.get("[data-cy=authTitle]").should("contain.text", "TIS Self-Service");
  });

  it("Header should have issue notice", () => {
    cy.get("[data-cy=authAlert]").should("exist");
    cy.get("[data-cy=authAlert]").should("contain.text", "We are currently having issues with Support emails.");
  });

  it("Body should have the support FAQ and mailto links", () => {
    cy.get("[data-cy=signInSupportLinks]")
      .find("a")
      .should($anchors => {
        expect($anchors).to.have.length(2);
        expect($anchors.first()).to.contain("FAQ");
        expect($anchors.first().attr("href")).to.eq(
          "https://tis-support.hee.nhs.uk/trainees/when-i-log-in/"
        );
        expect($anchors.last()).to.contain("email");
        expect($anchors.last().attr("href")).to.contain(
          "mailto:england.tis.support@nhs.net"
        );
      });
  });

  it("Footer should have the correct links and copyright text", () => {
    const links: string[] = [
      "https://tis-support.hee.nhs.uk/about-tis/",
      "https://www.hee.nhs.uk/about/privacy-notice"
    ];
    cy.get(".amplify-flex")
      .find("a")
      .should($anchors => {
        expect($anchors).to.have.length(2);
        expect($anchors.first()).to.contain("About");

        const hrefs = $anchors.map<string>((_i, a) => {
          return Cypress.$(a).attr("href");
        });
        expect(hrefs.get()).to.deep.eq(links);
      });
    cy.get("[data-cy=footerCopy]").should("contain.text", "© NHS England 2024");
  });

  it("should remove the privacy & cookies error message and show the Create an account button if checkbox checked", () => {
    cy.get(".amplify-tabs-item").last().click();
    cy.get(".amplify-heading").contains("Create an account");
    cy.get("[data-cy='checkboxPrivacy'] p.amplify-field__error-message").should(
      "exist"
    );
    cy.get("[data-cy='checkboxPilot'] p.amplify-field__error-message").should(
      "exist"
    );
    cy.get(".amplify-button--primary").should("be.disabled");
    cy.get(
      "[data-cy=checkboxPrivacy] > .amplify-field > .amplify-checkbox > .amplify-flex"
    ).click();
    cy.get("[data-cy='checkboxPrivacy'] p.amplify-field__error-message").should(
      "not.exist"
    );
    cy.get(".amplify-button").should("be.disabled");
    cy.get(
      "[data-cy=checkboxPilot] > .amplify-field > .amplify-checkbox > .amplify-flex"
    ).click();
  });

  it("should show the error and disable Sign up btn when passwords don't match", () => {
    cy.get(".amplify-tabs-item").last().click();
    cy.get('input[name="password"]').clear().type("WaterfallRules1");
    cy.get('input[name="confirm_password"]').clear().type("WaterfallRules");
    cy.get(".amplify-text--error")
      .should("exist")
      .should("contain.text", "Your passwords must match");
    cy.get('[data-fullwidth="true"]').should("be.disabled");
    cy.get('input[name="confirm_password"]').type("1");
    cy.get(
      "[data-cy=checkboxPrivacy] > .amplify-field > .amplify-checkbox > .amplify-flex"
    ).click();
    cy.get(
      "[data-cy=checkboxPilot] > .amplify-field > .amplify-checkbox > .amplify-flex"
    ).click();
    cy.get('input[name="email"]').clear().type("Waterfall@Rules.com");
    cy.get(".amplify-button--primary").should("not.be.disabled");
  });

  it("should toggle show and hide the password when clicking the 'show password' btn", () => {
    cy.get("button.amplify-field__show-password").first().click();
    cy.get('input[name="password"]').should("have.attr", "type", "text");
    cy.get("button.amplify-field__show-password").first().click();
    cy.get('input[name="password"]').should("have.attr", "type", "password");
  });
});

export {};
