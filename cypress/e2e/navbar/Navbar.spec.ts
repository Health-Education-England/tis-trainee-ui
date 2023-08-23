/// <reference types="cypress" />
/// <reference path="../../support/index.d.ts" />

describe("Desktop/ tablet header", () => {
  const mobileView = "iphone-6";
  const desktopView = "macbook-15";
  const sizes = [mobileView, desktopView];

  beforeEach(() => {
    // Note: The 30s wait is to allow the MFA TOTP token to refresh (from a previous test)
    cy.wait(30000);
    cy.visit("/");
    cy.signIn();
  });

  sizes.forEach((size: any) => {
    it(`should have menu items after successfull sign-in on ${size} screen`, () => {
      cy.viewport(size);
      if (size === mobileView) {
        cy.get(".nhsuk-header__menu-toggle").should("exist");

        cy.get(".nhsuk-header__menu-toggle").click();
      }
      cy.get(".nhsuk-header__navigation-link")
        .should("exist")
        .contains(/Profile/);
      cy.get(".nhsuk-header__navigation-link")
        .should("exist")
        .contains(/Part A/);
      cy.get(".nhsuk-header__navigation-link")
        .should("exist")
        .contains(/Part B/);
      cy.get(".nhsuk-header__navigation-link")
        .should("exist")
        .contains(/Support/);
      cy.get(".nhsuk-header__navigation-link").should("exist").contains(/MFA/);
      cy.get(".nhsuk-button")
        .should("exist")
        .contains(/Sign out/);
    });
  });

  it("should sign out of the desktop", () => {
    cy.logoutDesktop();
  });

  it("should sign out of mobile", () => {
    cy.logout();
  });
});

export {};
