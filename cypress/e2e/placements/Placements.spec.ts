/// <reference types="cypress" />
/// <reference path="../../support/index.d.ts" />

describe("Placements", () => {
  beforeEach(() => {
    cy.wait(30000);
    cy.visit("/placements", { failOnStatusCode: false });
    cy.signIn();
  });

  it("should render placements section", () => {
    cy.get('[data-cy="homeLink"]').should("exist");
    cy.get('.nhsuk-fieldset__heading')
    .should("exist")
    .should(
      "contain.text",
      "Placements"
    );
    cy.get('[data-cy="site0Val"]')
    .should("exist")
    .should(
      "contain.text",
      "Addenbrookes Hospital"
    );
    cy.get('[data-cy="siteLocation1Val"]')
    .should("exist")
    .should(
      "contain.text",
      "Hills Road Cambridge Cambridgeshire"
    );
    cy.get('[data-cy="startDate2Val"]')
    .should("exist")
    .should(
      "contain.text",
      "01/01/2020"
    );
    cy.get('[data-cy="endDate3Val"]')
    .should("exist")
    .should(
      "contain.text",
      "31/12/2020"
    );
    cy.get('[data-cy="wholeTimeEquivalent4Val"]')
    .should("exist")
    .should(
      "contain.text",
      "0.25"
    );
    cy.get('[data-cy="specialty5Val"]')
    .should("exist")
    .should(
      "contain.text",
      "Dermatology"
    );
    cy.get('[data-cy="grade6Val"]')
    .should("exist")
    .should(
      "contain.text",
      "ST1"
    );
    cy.get('[data-cy="placementType7Val"]')
    .should("exist")
    .should(
      "contain.text",
      "In Post"
    );
    cy.get('[data-cy="employingBody8Val"]')
    .should("exist")
    .should(
      "contain.text",
      "Leicester University"
    );
    cy.get('[data-cy="trainingBody9Val"]')
    .should("exist")
    .should(
      "contain.text",
      "Bebbington & West Wirral PCT"
    );
  });
});

export {};
