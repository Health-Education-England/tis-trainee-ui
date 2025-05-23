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
      cy.get(".nhsuk-button")
        .should("exist")
        .contains(/Sign out/);
      if (size === mobileView) {
        cy.get(".nhsuk-header__menu-toggle").should("exist").click();
        cy.get('[data-cy="signOutBtn"]');
      } else {
        cy.get(
          '.top-nav-container > .top-nav-container > [data-cy="signOutBtn"]'
        ).click();
      }
    });
  });
});

export {};
