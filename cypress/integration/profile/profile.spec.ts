/// <reference types="cypress" />
/// <reference path="../../support/index.d.ts" />

describe("Profile", () => {
  before(() => {
    cy.wait(30000);
    cy.visit("./profile");
    cy.signIn();
  });

  it("should click expand to show 'How to update my personal details' link", () => {
    cy.testDataSourceLink();
  });

  it("should toggle open and close a profile section", () => {
    const expanderPD =
      "[data-cy=personalDetailsExpander] > .nhsuk-details__summary > .nhsuk-details__summary-text";
    cy.get(expanderPD).should("exist").click();
    cy.get("[data-cy=Telephone]").should("exist");
    cy.get(expanderPD).click();
    cy.get(
      '[data-cy="General Medical Council (GMC)"] > .nhsuk-summary-list__key'
    ).should("not.be.visible");
  });

  it("should show placement information", () => {
    const expanderPl = "[data-cy=placementsExpander]";
    cy.get(expanderPl).should("exist").click();
    cy.get("[data-cy=siteKey]").should("exist");
    cy.get("[data-cy=specialtyKey]").should("exist");
  });

  it("should click expand to show programme section", () => {
    const expanderPr = "[data-cy=programmesExpander]";
    cy.get(expanderPr).should("exist").click();
    cy.get(".nhsuk-details__text").should("exist");
  });
});
