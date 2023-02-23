/// <reference types="cypress" />
/// <reference path="../../support/index.d.ts" />

const placementsArr = [
  { name: "site0Val", text: "Addenbrookes Hospital" },
  { name: "siteLocation1Val", text: "Acre Street Lindley Huddersfield" },
  { name: "startDate2Val", text: "01/10/2019" },
  { name: "endDate3Val", text: "01/10/2019" },
  { name: "wholeTimeEquivalent4Val", text: "0.5" },
  { name: "specialty0Val", text: "Dermatology" },
  { name: "grade0Val", text: "ST1" },
  { name: "placementType1Val", text: "OOPE" },
  { name: "employingBody0Val", text: "Leicester University" },
  { name: "trainingBody4Val", text: "Welsh Ambulance Services NHS Trust" }
];

describe("Placements", () => {
  beforeEach(() => {
    cy.wait(30000);
    cy.visit("/placements", { failOnStatusCode: false });
    cy.signIn();
  });

  it("should show the correct text for each placement ", () => {
    cy.get('[data-cy="homeLink"]').should("exist");
    cy.get(".nhsuk-fieldset__heading")
      .should("exist")
      .should("contain.text", "Placements");

    placementsArr.forEach(pl => {
      cy.get(`[data-cy="${pl.name}"]`)
        .should("exist")
        .should("contain.text", pl.text);
    });
  });
});

export {};
