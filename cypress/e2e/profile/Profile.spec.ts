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
    cy.get('.nhsuk-fieldset__heading')
    .should("exist")
    .should(
      "contain.text",
      "Profile"
    );
    cy.get('[data-cy="fullNameValue"]')
    .should("exist")
    .should(
      "contain.text",
      "Mr Anthony Mara Gilliam"
    );
    cy.get('[data-cy="email@email.com"]')
    .should("exist")
    .should(
      "contain.text",
      "email@email.com"
    );
    cy.get('.nhsuk-heading-m')
    .should("exist")
    .should(
      "contain.text",
      "Registration details"
    );
    cy.get('[data-cy="General Medical Council (GMC)"] > .nhsuk-summary-list__value')
    .should("exist")
    .should(
      "contain.text",
      "11111111"
    );
  });
});

export {};
