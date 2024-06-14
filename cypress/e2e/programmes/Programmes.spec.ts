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

    // check cct calc basic functionality
    cy.get('[data-cy^="cctBtn-"]').first().should("exist").click();
    cy.get('[data-cy="cct-header"]').should("exist");
    cy.get('[data-cy="cct-calc-btn"]').should("be.disabled");
    cy.clickSelect('[data-cy="ftePercents"]');
    cy.get('[data-cy="cct-pdf-btn"]').should("be.disabled");
    cy.get('[data-cy="cct-calc-btn"]').click();
    cy.get('[data-cy="cct-th-wte"]')
      .should("have.text", "New WTE")
      .next()
      .should("have.text", "New End Date");
    cy.get('[data-cy="cct-pdf-btn"]').should("not.be.disabled");
    cy.get('[data-cy="cct-close-btn"]').should("exist").click();
  });
});

export {};
