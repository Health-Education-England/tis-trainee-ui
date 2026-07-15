/// <reference types="cypress" />
/// <reference path="../../support/index.d.ts" />

describe("Desktop/ tablet header", () => {
  const mobileView = "iphone-6";
  const desktopView = "macbook-15";
  const sizes = [mobileView, desktopView];

  sizes.forEach((size: any) => {
    it(`should have menu items after successfull sign-in on ${size} screen`, () => {
      cy.signInToTss(30000, "/", size);

      cy.get(".nhsuk-header__menu-toggle").then($el => {
        cy.log(`Found ${$el.length} menu toggle(s)`);
        console.log($el.get(0)?.outerHTML);
      });
      cy.get(".nhsuk-header__navigation-link").should("exist");
      // Currently, the nav menu list should always exists regardless of screen size
      cy.get(".nhsuk-header__menu-toggle").should("exist").click();
      cy.get(".nhsuk-header__menu-list").should("not.have.attr", "hidden");
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
