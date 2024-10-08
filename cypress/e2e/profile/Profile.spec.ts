/// <reference types="cypress" />
/// <reference path="../../support/index.d.ts" />

describe("Profile", () => {
  const oldGmc = "1111111";
  const newGmc = "1234567";
  beforeEach(() => {
    cy.signInToTss(30000, "/profile");
    //set GMC to a known value
    cy.get("[data-cy=updateGmcLink]").should("exist").click();
    cy.get("#gmcNumber").should("exist").clear().type(oldGmc);
    cy.get("[data-cy=gmc-edit-btn]").click();
  });

  it("should render and populate profile section", () => {
    cy.get('[data-cy="homeLink"]').should("exist");
    cy.get('[data-cy="homeWelcomeHeaderText"]').should("not.exist");
    cy.get(".nhsuk-fieldset__heading")
      .should("exist")
      .should("contain.text", "Profile");
    cy.get("[data-cy=fullNameValue]").should("exist");
  });

  it("should update GMC", () => {
    cy.get("[data-cy=updateGmcLink]").should("exist").click();
    cy.get("#gmcNumber").should("exist").clear().type(newGmc);
    cy.get("[data-cy=gmc-edit-btn]").click();

    cy.get('[data-cy="General Medical Council (GMC)"]')
      .should("exist")
      .should("contain.text", newGmc);
  });

  it("should cancel and not update GMC", () => {
    const newGmc = "1234567";
    cy.get("[data-cy=updateGmcLink]").should("exist").click();
    cy.get("#gmcNumber").should("exist").clear().type(newGmc);
    cy.get("[data-cy=modal-cancel-btn]").click();

    cy.get('[data-cy="General Medical Council (GMC)"]')
      .should("exist")
      .should("contain.text", "1111111");
  });

  it("should handle update GMC failure", () => {
    cy.intercept("PUT", "**/basic-details/gmc-number", { statusCode: 400 }).as(
      "putUpdateGmcFailure"
    );
    const newGmc = "1234567";
    cy.get("[data-cy=updateGmcLink]").should("exist").click();
    cy.get("#gmcNumber").should("exist").clear().type(newGmc);
    cy.get("[data-cy=gmc-edit-btn]").click();

    cy.get('[data-cy="General Medical Council (GMC)"]')
      .should("exist")
      .should("contain.text", "1111111");
  });

  it("should show loading icon when GMC update delays", () => {
    cy.intercept("PUT", "**/basic-details/gmc-number", req => {
      req.on("response", res => {
        res.setThrottle(0.4);
      });
    }).as("slowPut");

    const newGmc = "1234567";
    cy.get("[data-cy=updateGmcLink]").should("exist").click();
    cy.get("#gmcNumber").should("exist").clear().type(newGmc);
    cy.get("[data-cy=gmc-edit-btn]").click();

    cy.get("[data-cy=loading]").should("exist");

    cy.get('[data-cy="General Medical Council (GMC)"]', { timeout: 10000 })
      .should("exist")
      .should("contain.text", newGmc);

    cy.get("[data-cy=loading]").should("not.exist");
  });
});

export {};
