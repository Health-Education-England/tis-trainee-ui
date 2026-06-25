/// <reference types="cypress" />
/// <reference path="../../support/index.d.ts" />

describe("Desktop/ tablet header", () => {
  const mobileView = "iphone-6";
  const desktopView = "macbook-15";
  const sizes = [mobileView, desktopView];

  beforeEach(() => {
    cy.signInToTss(30000);
  });

  sizes.forEach((size: any) => {
    it(`should have menu items after successfull sign-in on ${size} screen`, () => {
      cy.viewport(size);

      cy.get(".nhsuk-header__navigation-link")
        .should("exist")
        .contains(/Profile/);
      cy.get(".nhsuk-header__navigation-link").should("exist").contains(/A/);
      cy.get(".nhsuk-header__navigation-link").should("exist").contains(/B/);
      cy.get(".nhsuk-header__navigation-link")
        .should("exist")
        .contains(/Support/);
      cy.get(".nhsuk-header__navigation-link").should("exist").contains(/MFA/);
      cy.get('[data-cy="signOutBtn"]')
        .should("exist")
        .contains(/Sign out/);
      cy.get('[data-cy="signOutBtn"]').click();
    });
  });
});

export {};
