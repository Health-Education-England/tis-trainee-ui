/// <reference types="cypress" />
/// <reference path="../../support/index.d.ts" />

// ---- check order of this test to see if already logged in -----

describe("Footer", () => {
  before(() => {
    cy.visit("./");
    cy.confirmCookie();
  });

  // when logged out...
  it("should link to privacy policy and TIS support website when logged out", () => {
    cy.get("a[data-cy='linkPrivacyPolicy']").should("exist").click();
    cy.get("div.title").contains("Privacy Policy");
    cy.get(".modalHeader").find("button").click();
    cy.get("a[data-cy='linkSupport']")
      .should("exist")
      .should("have.attr", "href", "https://tis-support.hee.nhs.uk");
  });

  // when logged in...
  it("should link to privacy policy and Support page when logged in", () => {
    cy.signIn();
    cy.get("a[data-cy='linkSupport']")
      .should("exist")
      .should("have.attr", "href", "/support");
    cy.get("a[data-cy='linkPrivacyPolicy']").should("exist").click();
    cy.get("div.title").contains("Privacy Policy");
    cy.get(".modalHeader").find("button").click();
    cy.logoutDesktop();
  });
});
