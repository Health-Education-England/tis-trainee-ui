/// <reference types="cypress" />
/// <reference path="../../support/index.d.ts" />

describe("TSS header", () => {
  beforeEach(() => {
    cy.signInToTss(30000);
  });

  it("should show the service name, account items and core nav links on desktop", () => {
    cy.viewport("macbook-15");

    cy.get(".nhsuk-header__service-name").should(
      "contain.text",
      "TIS Self-Service"
    );
    cy.get('[data-cy="profileLink"]').should("be.visible");
    cy.get('[data-cy="signOutBtn"]')
      .should("be.visible")
      .and("contain.text", "Sign out");
    cy.get('.nhsuk-header [data-cy="Support"]').should("exist");
    cy.get('.nhsuk-header [data-cy="MFA set-up"]').should("exist");
  });

  it("should collapse overflowing nav links into the 'More' menu on mobile", () => {
    cy.viewport("iphone-6");

    // Account items still visible on mobile
    cy.get('[data-cy="profileLink"]').should("be.visible");
    cy.get('[data-cy="signOutBtn"]').should("be.visible");

    // Even the min no. of Nav links can never fit on mobile, so the header JS must
    // enable the menu, which defaults to closed
    cy.get(".nhsuk-header__menu").should("not.have.attr", "hidden");
    cy.get(".nhsuk-header__menu-list").should("have.attr", "hidden");
    cy.get(".nhsuk-header__menu-toggle").should("be.visible").click();
    cy.get(".nhsuk-header__menu-list")
      .should("be.visible")
      .find(".nhsuk-header__navigation-link")
      .should("have.length.at.least", 1);

    cy.get('.nhsuk-header [data-cy="Support"]').should("be.visible").click();
    cy.url().should("include", "/support");

    cy.get(".nhsuk-header__menu-list").should("have.attr", "hidden");
  });

  it("should sign the user out when the Sign out button is clicked", () => {
    cy.viewport("macbook-15");
    cy.get('[data-cy="signOutBtn"]').click();
    cy.get('[type="email"]').should("be.visible");
  });
});

export {};
