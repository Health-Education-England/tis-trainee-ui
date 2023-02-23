/// <reference types="cypress" />
/// <reference path="../../support/index.d.ts" />

describe("Profile", () => {
  beforeEach(() => {
    cy.wait(30000);
    cy.visit("/profile", { failOnStatusCode: false });
    cy.signIn();
  });

  it("should render and populate profile section", () => {
    cy.get('[data-cy="homeLink"]').should("exist");
    cy.get('[data-cy="homeWelcomeHeaderText"]').should("not.exist");
    cy.get(".nhsuk-fieldset__heading")
      .should("exist")
      .should("contain.text", "Profile");
    cy.get("[data-cy=fullNameValue]").should("exist");
  });
});

export {};
