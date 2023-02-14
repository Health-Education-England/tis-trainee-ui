/// <reference types="cypress" />
/// <reference path="../../support/index.d.ts" />

describe("Profile", () => {
  beforeEach(() => {
    cy.wait(30000);
    cy.visit("/profile", { failOnStatusCode: false });
    cy.signIn();
  });

  it("should toggle open and close profile section", () => {
    const expanderPd = "[data-cy=personalDetailsExpander]";
    cy.get(expanderPd).should("exist").click();
    cy.get("[data-cy=Telephone]").should("exist");
    cy.get(
      `${expanderPd} > .nhsuk-details__summary > .nhsuk-details__summary-text`
    ).click();
    // TODO: "not visible" assertion still fails with Cypress 12 on Chrome 104
    // cy.get("[data-cy=Male]").should("not.be.visible");
  });

  it("should click expand to show Placements and Programmes data", () => {
    // placements
    const expanderPl = "[data-cy=placementsExpander]";
    cy.get(expanderPl).should("exist").click();
    cy.get("[data-cy=site0Key]").first().should("exist");
    cy.get("[data-cy=site0Val]").first().should("exist");

    // programmes
    const expanderPr = "[data-cy=programmeMembershipsExpander]";
    cy.get(expanderPr).should("exist").click();
    cy.get(".nhsuk-details__text").should("exist");
  });
});

export {};
