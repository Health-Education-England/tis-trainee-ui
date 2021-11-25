/// <reference types="cypress" />
/// <reference path="../../support/index.d.ts" />

describe("Authenticator", () => {
  before(() => {
    cy.visit("./");
  });

  it("Header links should go to the relevant TIS Support site page when clicked", () => {
    const links: { num: number; href: string }[] = [
      { num: 1, href: "https://tis-support.hee.nhs.uk/" },
      { num: 2, href: "https://tis-support.hee.nhs.uk/about-tis/" },
      { num: 3, href: "https://www.hee.nhs.uk/about/privacy-notice" }
    ];

    links.forEach(link => {
      cy.get(`:nth-child(${link.num}) > .Auth_AuthHeaderLink__1sdj_`).should(
        "have.attr",
        "href",
        `${link.href}`
      );
    });
  });

  it("should remove the privacy & cookies error message and show the Sign up button if checkbox checked", () => {
    cy.get("[id^=radix-][id$=-1]").first().click();
    cy.get(".amplify-heading").contains("First time sign-up");
    cy.get(".amplify-field__error-message").should("exist");
    cy.get('[data-fullwidth="true"]').should("be.disabled");
    cy.get(".amplify-checkbox > .amplify-flex").click();
    cy.get(".amplify-field__error-message").should("not.exist");
    cy.get('[data-fullwidth="true"]').should("not.be.disabled");
  });

  it("should show the error and disable Sign up btn when passwords don't match", () => {
    cy.get("[id^=radix-][id$=-1]").first().click();
    cy.get("[id^=radix-][id$=-5]").first().clear().type("WaterfallRules1");
    cy.get("[id^=radix-][id$=-6]").first().clear().type("WaterfallRules");
    cy.get('[style="flex-direction: column;"] > p.amplify-text').should(
      "exist"
    );
    cy.get('[data-fullwidth="true"]').should("be.disabled");
    cy.get("[id^=radix-][id$=-6]").first().type("1");
    cy.get('[data-fullwidth="true"]').should("not.be.disabled");
  });
});
