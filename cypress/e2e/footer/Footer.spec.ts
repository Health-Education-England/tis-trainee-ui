/// <reference types="cypress" />
/// <reference path="../../support/index.d.ts" />

describe("Footer", () => {
  before(() => {
    // Note: The 30s wait is to allow the MFA TOTP token to refresh (from a previous test)
    cy.wait(30000);
    cy.visit("/");
    cy.signIn();
  });

  it("should link to Support, About, and Privacy & Cookies pages", () => {
    cy.get("[data-cy='linkSupport']").should("exist").click();
    cy.get("[data-cy=supportHeading]").should("to.contain", "Support");
    cy.get("[data-cy='linkAbout']").should(
      "have.attr",
      "href",
      "https://tis-support.hee.nhs.uk/about-tis/"
    );
    cy.get("[data-cy=linkPrivacyPolicy]").should(
      "have.attr",
      "href",
      "https://www.hee.nhs.uk/about/privacy-notice"
    );
  });
});

export {};
