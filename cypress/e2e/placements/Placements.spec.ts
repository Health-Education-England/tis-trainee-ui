/// <reference types="cypress" />
/// <reference path="../../support/index.d.ts" />

describe("Placements", () => {
  beforeEach(() => {
    cy.wait(30000);
    cy.visit("/placements", { failOnStatusCode: false });
    cy.signIn();
  });

  it("should show the correct text for each placement ", () => {
    cy.get('[data-cy="homeLink"]').should("exist");
    cy.get('[data-cy="homeWelcomeHeaderText"]').should("not.exist");
    cy.get(".nhsuk-fieldset__heading")
      .should("exist")
      .should("contain.text", "Placements");
    cy.get("[data-cy=site0Key]").should("exist");
    cy.get("[data-cy=site0Val]").should("exist");
  });
});

export {};
