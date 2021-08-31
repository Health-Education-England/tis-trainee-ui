/// <reference types="cypress" />

describe("Desktop/ tablet header", () => {
  const mobileView = "iphone-6";
  const desktopView = "macbook-15";
  const sizes = [mobileView, desktopView];

  before(() => {
    cy.visit("./profile");
    cy.confirmCookie();
  });

  // when logged out
  it("should only contain NHS header when logged out ", () => {
    cy.get('[alt="Trainee Self-Service homepage"]').should("exist");
    cy.get(".nhsuk-header__navigation-link").should("not.exist");
  });

  // when logged in
  sizes.forEach((size: any) => {
    it(`should have menu items after successfull sign-in on ${size} screen`, () => {
      cy.viewport(size);
      cy.signIn();
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
      cy.get(".nhsuk-header__navigation-link")
        .should("exist")
        .contains(/Logout/);
    });
  });

  it("should logout when click logout button ", () => {
    cy.get(".nhsuk-header__navigation-link")
      .should("exist")
      .contains(/Logout/)
      .should("exist")
      .click();
  });
});
