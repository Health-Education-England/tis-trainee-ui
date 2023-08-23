/// <reference types="cypress" />
/// <reference path="../../support/index.d.ts" />

describe("Programmes", () => {
  beforeEach(() => {
    // Note: The 30s wait is to allow the MFA TOTP token to refresh (from a previous test)
    cy.wait(30000);
    cy.visit("/programmes", { failOnStatusCode: false });
    cy.signIn();
  });

  it("should display and populate programme section", () => {
    cy.get('[data-cy="homeLink"]').should("exist");
    cy.get('[data-cy="homeWelcomeHeaderText"]').should("not.exist");
    cy.get(".nhsuk-fieldset__heading").should("contain.text", "Programmes");
  });
});

export {};
