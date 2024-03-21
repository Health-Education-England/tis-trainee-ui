/// <reference types="cypress" />
/// <reference path="../../support/index.d.ts" />

describe("Notifications", () => {
  beforeEach(() => {
    cy.signInToTss(30000, "/notifications");
  });

  it("should load the notifications page", () => {
    cy.get('[data-cy="notificationsHeading"]')
      .should("exist")
      .should("contain.text", "Notifications");
  });
});
