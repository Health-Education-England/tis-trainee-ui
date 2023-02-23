/// <reference types="cypress" />
/// <reference path="../../support/index.d.ts" />

describe("Home", () => {
  beforeEach(() => {
    cy.wait(30000);
    cy.visit("/home", { failOnStatusCode: false });
    cy.signIn();
  });

  it("should find profile button and click in to the profile section", () => {
    cy.get('.nhsuk-u-margin-bottom-4')
    .should(
      "contain.text",
      "Welcome to TIS Self-Service"
    )

    cy.get('[data-cy="homeLink"]')
    .should("not.exist");

    // ----------------------- Profile card shoud display and navigate ----------------------- 

    cy.get("[data-cy=Profile]")
    .last()
    .should(
      "contain.text",
      "Profile"
    )
    .click();
    cy.get('.nhsuk-fieldset__heading')
    .should("exist")
    .should(
      "contain.text",
      "Profile"
    );
    cy.get('nav.nhsuk-width-container > a')
    .click();
    cy.get('.nhsuk-u-margin-bottom-4')
    .should("exist");

    // ----------------------- Placements card shoud display and navigate ----------------------- 

    cy.get("[data-cy=Placements]")
    .last()
    .should(
      "contain.text",
      "Placements"
    )
    .click();
    cy.get('.nhsuk-fieldset__heading')
    .should("exist")
    .should(
      "contain.text",
      "Placements"
    );
    cy.get('nav.nhsuk-width-container > a')
    .click();
    cy.get('.nhsuk-u-margin-bottom-4')
    .should("exist");

    // ----------------------- Programmes card shoud display and navigate ----------------------- 

    cy.get("[data-cy=Programmes]")
    .last()
    .should(
      "contain.text",
      "Programmes"
    )
    .click();
    cy.get('.nhsuk-fieldset__heading')
    .should("exist")
    .should(
      "contain.text",
      "Programmes"
    );
    cy.get('nav.nhsuk-width-container > a')
    .click();
    cy.get('.nhsuk-u-margin-bottom-4')
    .should("exist");

    // ----------------------- Form R (Part A) card shoud display and navigate ----------------------- 

    cy.get("[data-cy=Form R (Part A)]")
    .last()
    .should(
      "contain.text",
      "Profile"
    )
    .click();
    cy.get('.nhsuk-fieldset__heading')
    .should("exist")
    .should(
      "contain.text",
      "Form R (Part A)"
    );
    cy.get('nav.nhsuk-width-container > a')
    .click();
    cy.get('.nhsuk-u-margin-bottom-4')
    .should("exist");

    // ----------------------- Form R (Part B) card shoud display and navigate ----------------------- 

    cy.get("[data-cy=Form R (Part B)]")
    .last()
    .should(
      "contain.text",
      "Form R (Part B)"
    )
    .click();
    cy.get('.nhsuk-fieldset__heading')
    .should("exist")
    .should(
      "contain.text",
      "Form R (Part B)"
    );
    cy.get('nav.nhsuk-width-container > a')
    .click();
    cy.get('.nhsuk-u-margin-bottom-4')
    .should("exist");

    // ----------------------- MFA card shoud display and navigate ----------------------- 

    cy.get("[data-cy=MFA]")
    .last()
    .should(
      "contain.text",
      "MFA"
    )
    .click();
    cy.get('.nhsuk-fieldset__heading')
    .should("exist")
    .should(
      "contain.text",
      "MFA (Multi-Factor Authentication) set-up"
    );
    cy.get('nav.nhsuk-width-container > a')
    .click();
    cy.get('.nhsuk-u-margin-bottom-4')
    .should("exist");

    // ----------------------- Support card shoud display and navigate ----------------------- 

    cy.get("[data-cy=Support]")
    .last()
    .should(
      "contain.text",
      "Support"
    )
    .click();
    cy.get('.nhsuk-fieldset__heading')
    .should("exist")
    .should(
      "contain.text",
      "Support"
    );
    cy.get('nav.nhsuk-width-container > a')
    .click();
    cy.get('.nhsuk-u-margin-bottom-4')
    .should("exist");
  });
});

export {};
