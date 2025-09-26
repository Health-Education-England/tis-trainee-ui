/// <reference types="cypress" />
/// <reference path="../../support/index.d.ts" />

const homeArr = [
  { name: "Profile", header: "Profile" },
  { name: "Placements", header: "Placements" },
  { name: "Form R (Part A)", header: "Form R (Part A)" },
  { name: "Form R (Part B)", header: "Form R (Part B)" },
  { name: "MFA", header: "MFA (Multi-Factor Authentication) set-up" },
  { name: "Action Summary", header: "Action Summary" }
];

describe("Home", () => {
  beforeEach(() => {
    cy.signInToTss(30000, "/home");
  });

  it("should find profile button and click in to the profile section", () => {
    cy.get('[data-cy="surveyAlert"] > :nth-child(1)').should("exist");
    cy.get('[data-cy="surveyAlert"] > :nth-child(3) > a').should(
      "have.attr",
      "href",
      "https://forms.office.com/pages/responsepage.aspx?id=slTDN7CF9UeyIge0jXdO44uWlnrGjTNIhMe4L0OxPpdURjBMUjU2R09MRDBRNkkwWTNPMkJaQ1ZBWC4u&route=shorturl"
    );
    cy.get('[data-cy="homeLink"]').should("not.exist");
    cy.get('[data-cy="homeWelcomeHeaderText"]')
      .should("exist")
      .should("contain.html", "Welcome to<br>TIS Self-Service");
    cy.get('[data-cy="tssUpdatesContainer"]').should("exist");
    cy.get('[data-cy="tssOverview"]').should("exist");

    homeArr.forEach(section => {
      cy.get(`[data-cy="${section.name}"]`)
        .last()
        .should("contain.text", `${section.name}`)
        .click();
      cy.get(".nhsuk-fieldset__heading")
        .should("exist")
        .should("contain.text", `${section.header}`);
      cy.get("nav.nhsuk-width-container > a").click();
    });

    cy.visit("/home/nonsense", { failOnStatusCode: false });
    cy.get('[data-cy="pageNotFoundText"]')
      .should("exist")
      .should("contain.text", "Sorry, page not found");
  });
});

export {};
