/// <reference types="cypress" />
/// <reference path="../../support/index.d.ts" />

import dayjs from "dayjs";

describe("Placements", () => {
  beforeEach(() => {
    cy.signInToTss(30000, "/placements");
  });

  it("should show the correct text for each placement ", () => {
    cy.get('[data-cy="homeLink"]').should("exist");
    cy.get('[data-cy="homeWelcomeHeaderText"]').should("not.exist");
    cy.get(".nhsuk-fieldset__heading")
      .should("exist")
      .should("contain.text", "Placements");
    cy.get('[data-cy="currentExpand"]').click();
    cy.get('[data-cy="notAssignedplacements"]').should("exist");
  });
});

export {};
