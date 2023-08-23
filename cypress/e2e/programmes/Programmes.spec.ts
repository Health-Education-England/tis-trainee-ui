/// <reference types="cypress" />
/// <reference path="../../support/index.d.ts" />

describe("Programmes", () => {
  beforeEach(() => {
    cy.signInToTss(30000, "/programmes");
  });

  it("should display and populate programme section", () => {
    cy.get('[data-cy="homeLink"]').should("exist");
    cy.get('[data-cy="homeWelcomeHeaderText"]').should("not.exist");
    cy.get(".nhsuk-fieldset__heading").should("contain.text", "Programmes");
  });
});

export {};
