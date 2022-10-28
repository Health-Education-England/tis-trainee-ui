/// <reference types="cypress" />
/// <reference path="../../support/index.d.ts" />

describe("MFA set-up", () => {
  before(() => {
    cy.wait(30000);
    cy.visit("/");
    cy.signIn();
  });
  it("should render the Choose MFA page", () => {
    cy.get('[data-cy="MFA set-up"]').should("exist").click();
    cy.get("[data-cy=mfaAlreadyWarning]").should("exist");
    cy.get("[data-cy=mfaAlreadyText]")
      .should("exist")
      .should(
        "include.text",
        "You have already set up your Authenticator App for MFA "
      );
    cy.get("[data-cy=mfaSummary]").click();
    cy.get("[data-cy=mfaText] > :nth-child(3) > b").should(
      "include.text",
      "or SMS"
    );
    cy.get("[data-cy=mfaChoice1]").click();
    cy.get("[data-cy=BtnSubmitMfaChoice]").click();
    cy.get("[data-cy=backLink]")
      .should("exist")
      .should("contain.text", "Start over")
      .click();
    cy.get("[data-cy=mfaChoice0]").should("exist").click();
    cy.get("[data-cy=BtnSubmitMfaChoice]").click();
    cy.get("[data-cy=appInstalledAlready0]").should("exist").click();
    cy.get("[data-cy=threeMinWarning]").should("exist");
    cy.get("form > .nhsuk-button")
      .should(
        "contain.text",
        "Add 'NHS TIS Self-Service' to your Authenticator App"
      )
      .click();
    cy.get("[data-cy=Profile]").click();
    cy.get('[data-cy="MFA set-up"]').click();
    cy.get(".nhsuk-fieldset__heading").should("include.text", "MFA");
  });
});
