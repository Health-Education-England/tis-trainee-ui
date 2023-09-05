/// <reference types="cypress" />
/// <reference path="../../support/index.d.ts" />

const homeArr = [
  { name: "Profile", header: "Profile" },
  { name: "Placements", header: "Placements" },
  { name: "Form R (Part A)", header: "Form R (Part A)" },
  { name: "Form R (Part B)", header: "Form R (Part B)" },
  { name: "MFA", header: "MFA (Multi-Factor Authentication) set-up" }
];

describe("Home", () => {
  beforeEach(() => {
    cy.signInToTss(30000, "/home");
  });

  it("should find profile button and click in to the profile section", () => {
    cy.get(".nhsuk-u-margin-bottom-4").should(
      "contain.text",
      "Welcome to TIS Self-Service"
    );
    cy.get('[data-cy="homeLink"]').should("not.exist");
    cy.get('[data-cy="homeWelcomeHeaderText"]')
      .should("exist")
      .should("contain.text", "Welcome to TIS Self-Service");
    cy.get('[data-cy="tssUpdatesContainer"]').should("exist");

    homeArr.forEach(section => {
      cy.get(`[data-cy="${section.name}"]`)
        .last()
        .should("contain.text", `${section.name}`)
        .click();
      cy.get(".nhsuk-fieldset__heading")
        .should("exist")
        .should("contain.text", `${section.header}`);
      cy.get("nav.nhsuk-width-container > a").click();
      cy.get(".nhsuk-u-margin-bottom-4").should("exist");
    });

    cy.visit("/home/nonsense", { failOnStatusCode: false });
    cy.get('[data-cy="pageNotFoundText"]')
      .should("exist")
      .should("contain.text", "Sorry, page not found");
  });
});

export {};
