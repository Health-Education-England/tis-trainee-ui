/// <reference types="cypress" />
/// <reference path="../../support/index.d.ts" />

import dayjs from "dayjs";

describe("Programmes", () => {
  beforeEach(() => {
    cy.signInToTss(30000, "/programmes");
  });

  it("should display and populate programme section", () => {
    cy.get('[data-cy="homeLink"]').should("exist");
    cy.get('[data-cy="homeWelcomeHeaderText"]').should("not.exist");
    cy.get(".nhsuk-fieldset__heading").should("contain.text", "Programmes");
    cy.get('[data-cy="currentExpand"]').click();
    // CCT calc user journey from placements
    cy.get('[data-cy="cct-link-header"]')
      .first()
      .contains("Need a CCT calculation?");
    cy.get('[data-cy="cct-link"]').first().click();
    cy.get(".nhsuk-fieldset__heading").contains(
      "Certificate of Completion of Training (CCT)"
    );
  });
});

export {};
