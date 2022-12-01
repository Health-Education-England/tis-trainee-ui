/// <reference types="cypress" />
/// <reference path="../../support/index.d.ts" />

describe("Profile", () => {
  before(() => {
    cy.wait(30000);
    cy.visit("/profile", { failOnStatusCode: false });
    cy.signIn();
  });

  it("should click expand to show 'How to update my personal details' link", () => {
    cy.testDataSourceLink();
  });

  it("should toggle open and close a profile section", () => {
    const expanderPD = "[data-cy=personalDetailsExpander]";
    cy.get(expanderPD).should("exist").click();
    cy.get("[data-cy=Telephone]").should("exist");
    cy.get(expanderPD).click();
    // TODO: "not visible" assertion still fails with Cypress v8 on Chrome 104
    // cy.get("[data-cy=Male]").should("not.be.visible");
  });

  it("should show placement information", () => {
    const expanderPl = "[data-cy=placementsExpander]";
    cy.get(expanderPl).should("exist").click();
    cy.get("[data-cy=site0Key]").first().should("exist");
    cy.get("[data-cy=site0Val]").first().should("exist");
  });

  it("should click expand to show programme section", () => {
    const expanderPr = "[data-cy=programmeMembershipsExpander]";
    cy.get(expanderPr).should("exist").click();
    cy.get(".nhsuk-details__text").should("exist");
  });
});
