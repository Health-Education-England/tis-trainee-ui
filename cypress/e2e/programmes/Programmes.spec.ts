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
    cy.get('[data-cy="cct-home-new-calc-btn"]').click();
    cy.checkAndFillNewCctCalcForm();

    // edit new wte
    // edit new wte
    cy.get('[data-cy="cct-view-new-wte-0"]').contains("90%");
    cy.get('[data-cy="cct-edit-btn"]').click();
    cy.clickSelect('[data-cy="changes[0].wte"]', "60%");
    cy.get('[data-cy="calculate-change-btn-0"]').click();
    cy.get('[data-cy="change-result-0"]').should("exist");
    cy.get('[data-cy="cct-calc-btn"]').click();
    cy.get('[data-cy="cct-view-new-wte-0"]').contains("60%");

    // name and save new calc
    cy.get('[data-cy="cct-save-btn"]').should("exist").click();
    cy.get('[data-cy="name"]').type(`😎_${dayjs().toISOString()}`, {
      parseSpecialCharSequences: false
    });
    cy.get('[data-cy="cct-modal-save-btn"]').click();
    cy.get('[data-cy="cct-home-subheader-calcs"]').contains(
      "Saved calculations"
    );
    cy.get('[data-cy*="_name"]')
      .first()
      .should("include.text", `😎_${dayjs().format("YYYY-MM-DD")}`);
    cy.get('[data-cy*="_name"]').first().click();
    cy.get('[data-cy="saved-cct-details"] > :nth-child(1)').should(
      "include.text",
      `Name: 😎_${dayjs().format("YYYY-MM-DD")}`
    );
    cy.get('[data-cy="cct-save-btn"]').should("not.exist");
    // back to cct home via nav link
    cy.get('[data-cy="CCT"]').click();
    cy.get('[data-cy="cct-home-subheader-calcs"]').should("exist");
  });
});

export {};
