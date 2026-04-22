/// <reference types="cypress" />
/// <reference path="../../support/index.d.ts" />

describe("Profile", () => {
  const newGmc = "9876543";
  const newGmc1 = "1234567";
  const newEmail = "bob@bob.com";
  beforeEach(() => {
    cy.signInToTss(30000, "/profile");
  });

  it("should render and populate profile section", () => {
    cy.get('[data-cy="homeLink"]').should("exist");
    cy.get('[data-cy="homeWelcomeHeaderText"]').should("not.exist");
    cy.get(".nhsuk-fieldset__heading")
      .should("exist")
      .should("contain.text", "Profile");
    cy.get("[data-cy=fullNameValue]").should("exist");
  });

  // See Profile.cy.tsx for more detailed GMC and email modal tests

  it("should update GMC", () => {
    cy.get("[data-cy=updateGmcBtn]").should("exist").click();
    cy.get("#gmcNumber").should("exist").clear().type(newGmc1);
    cy.get("#confirmGmcNumber").should("exist").clear().type(newGmc1);
    cy.get("[data-cy=gmc-edit-btn]").click();

    cy.get('[data-cy="General Medical Council (GMC)-value"]')
      .scrollIntoView()
      .should("exist")
      .should("contain.text", newGmc1);
  });

  it("should make successful email update request", () => {
    cy.get("[data-cy=updateEmailBtn]").should("exist").click();
    cy.get("#email").should("exist").clear().type(newEmail);
    cy.get("#confirmEmail").should("exist").clear().type(newEmail);
    cy.get("[data-cy=email-edit-btn]").click();
    cy.get('[data-cy="toastText"]').should(
      "include.text",
      "Your email update request has been sent. You will receive an email to your new address once the update has been applied"
    );
  });

  it("should cancel and not update GMC", () => {
    cy.get("[data-cy=updateGmcBtn]").should("exist").click();
    cy.get("#gmcNumber").should("exist").clear().type(newGmc);
    cy.get("[data-cy=modal-cancel-btn]:visible").click();
    cy.get('[data-cy="General Medical Council (GMC)-value"]')
      .scrollIntoView()
      .should("not.have.text", newGmc);
  });

  it("should handle update GMC number failure", () => {
    cy.intercept("PUT", "**/basic-details/gmc-number", { statusCode: 400 }).as(
      "putUpdateGmcFailure"
    );
    cy.get("[data-cy=updateGmcBtn]").should("exist").click();
    cy.get("#gmcNumber").clear().type(newGmc);
    cy.get("#confirmGmcNumber").clear().type(newGmc);
    cy.get("[data-cy=gmc-edit-btn]").click();
    cy.get('[data-cy="toastText"]').should(
      "include.text",
      "GMC number could not be updated"
    );

    cy.get('[data-cy="General Medical Council (GMC)-value"]')
      .should("exist")
      .should("not.have.text", newGmc);
  });

  it("should show loading icon when GMC update delays", () => {
    cy.intercept("PUT", "**/basic-details/gmc-number", req => {
      req.on("response", res => {
        res.setThrottle(0.4);
      });
    }).as("slowPut");

    cy.get("[data-cy=updateGmcBtn]").should("exist").click();
    cy.get("#gmcNumber").should("exist").clear().type(newGmc);
    cy.get("#confirmGmcNumber").clear().type(newGmc);
    cy.get("[data-cy=gmc-edit-btn]").click();
    cy.get("[data-cy=loading]").should("exist");

    cy.get('[data-cy="General Medical Council (GMC)"]', { timeout: 10000 })
      .should("exist")
      .should("contain.text", newGmc);
    cy.get("[data-cy=loading]").should("not.exist");
  });
});

export {};
