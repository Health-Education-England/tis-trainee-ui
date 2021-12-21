/// <reference types="cypress" />
/// <reference path="../../support/index.d.ts" />

describe("Desktop/ tablet header", () => {
  const mobileView = "iphone-6";
  const desktopView = "macbook-15";
  const sizes = [mobileView, desktopView];

  before(() => {
    cy.visit("./profile");
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
      cy.get(".nhsuk-button")
        .should("exist")
        .contains(/Logout/);
    });
  });

  it("should logout of the desktop", () => {
    cy.logoutDesktop();
  });

  it("should logout of mobile", () => {
    cy.wait(30000);
    cy.signBackIn();
    cy.logout();
  });
});
