/// <reference types="cypress" />
/// <reference path="../../support/index.d.ts" />

describe("Landing page", () => {
  before(() => {
    cy.visit("/");
  });

  it("should show the heading, sign in / create account CTAs and support links", () => {
    cy.get("[data-cy=landingHeading]").should(
      "contain.text",
      "TIS Self-Service"
    );
    cy.get("[data-cy=landingSignInBtn]")
      .should("contain.text", "Sign in")
      .and("have.attr", "href", "/sign-in");
    cy.get("[data-cy=landingSignUpBtn]")
      .should("contain.text", "Create an account")
      .and("have.attr", "href", "/sign-up");
    cy.get("[data-cy=landingFaqLink]")
      .should("have.attr", "href")
      .and("include", "https://tis-support.hee.nhs.uk/trainees/");
    cy.get("[data-cy=landingSupportEmailLink]")
      .should("have.attr", "href")
      .and("include", "mailto:england.tis.support@nhs.net");
  });

  it("should deep-link the create account CTA to the sign up tab", () => {
    cy.get("[data-cy=landingSignUpBtn]").click();
    cy.location("pathname").should("eq", "/sign-up");
    cy.get('input[name="given_name"]').should("be.visible");
    cy.get('input[name="family_name"]').should("be.visible");
  });
});
