/// <reference types="cypress" />
/// <reference path="../../support/index.d.ts" />

describe("Notifications", () => {
  beforeEach(() => {
    cy.signInToTss(30000, "/notifications");
  });

  it("should load notifications table", () => {
    cy.get('[data-cy="notificationsHeading"]')
      .should("exist")
      .should("contain.text", "In-app Notifications");    
    cy.get('[data-cy="emailBtn"]').should("exist");
    cy.get('[data-cy="inAppBtn"]').should("exist");
  });
});
