/// <reference types="cypress" />
/// <reference path="../../support/index.d.ts" />

describe("Programmes", () => {
  beforeEach(() => {
    cy.wait(30000);
    cy.visit("/programmes", { failOnStatusCode: false });
    cy.signIn();
  });

  it("should display and populate programme section", () => {
    cy.get('[data-cy="homeLink"]').should("exist");
    cy.get('.nhsuk-fieldset__heading')
    .should(
      "contain.text",
      "Programmes"
    );
    cy.get('[data-cy="programmeName0Val"]')
    .should(
      "contain.text",
      "Cardiology"
    );
    cy.get('[data-cy="programmeNumber1Val"]')
    .should(
      "contain.text",
      "EOE8945"
    );
    cy.get('[data-cy="startDate2Val"]')
    .should(
      "contain.text",
      "01/01/2020"
    );
    cy.get('[data-cy="endDate3Val"]')
    .should(
      "contain.text",
      "01/01/2028"
    );
    cy.get('[data-cy="managingDeanery4Val"]')
    .should(
      "contain.text",
      "East of England"
    );
    cy.get('[data-cy="GP Returner"]')
    .should(
      "contain.text",
      "GP Returner"
    );
    cy.get('[data-cy="curricula5Val"]')
    .should(
      "contain.text",
      "01/01/2019"
    );
  });  
});

export {};
