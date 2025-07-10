/// <reference types="cypress" />
/// <reference path="../../support/index.d.ts" />

const getPasswordStrengthItem = (index: number) =>
  cy.get(`#amplify-id-\\:rg\\: > :nth-child(${index})`);

const fillSignUpForm = ({
  username,
  familyName,
  email,
  password
}: {
  username: string;
  familyName: string;
  email: string;
  password: string;
}) => {
  cy.get("#amplify-id-\\:r0\\:-tab-signUp").click();
  cy.get("#amplify-id-\\:r8\\:").type(username);
  cy.get("#amplify-id-\\:rb\\:").type(familyName);
  cy.get("#amplify-id-\\:re\\:").type(email);
  cy.get("#amplify-id-\\:rh\\:").type(password).blur();
};

const assertFooterLinks = (elNo: number, elNo2: number, elHref: string) => {
  cy.get("a")
    .eq(elNo)
    .contains("FAQ")
    .should("have.attr", "href")
    .and("include", `https://tis-support.hee.nhs.uk/trainees/${elHref}`);
  cy.get("a")
    .eq(elNo2)
    .contains("email")
    .should("have.attr", "href")
    .and("include", "mailto:england.tis.support@nhs.net");
};

describe("Authenticator sign in", () => {
  before(() => {
    cy.visit("/");
  });

  it("Sign in should show logo and heading, password toggle visibility, and support links", () => {
    cy.get("[data-cy=authLogo]").should("exist");
    cy.get("[data-cy=authTitle]").should("contain.text", "TIS Self-Service");

    // password show toggle
    cy.get("button.amplify-field__show-password").first().as("toggleBtn");
    cy.get('input[name="password"]').as("passwordInput");
    cy.get("@toggleBtn").click();
    cy.get("@passwordInput").should("have.attr", "type", "text");
    cy.get("@toggleBtn").click();
    cy.get("@passwordInput").should("have.attr", "type", "password");

    // footer links
    assertFooterLinks(0, 1, "when-i-log-in");
  });
});

describe("Authenticator sign up", () => {
  before(() => {
    cy.visit("/");
  });

  it("Sign up should show the password strength & matching errors, checkboxes, and footer links", () => {
    // password strength
    fillSignUpForm({
      username: "bob",
      familyName: "seagull",
      email: "bob@bob.seagull",
      password: "N"
    });

    [
      "Password must have at least 8 characters",
      "Password must have lower case letters",
      "Password must have numbers",
      "Password must have special characters"
    ].forEach((text, idx) => {
      getPasswordStrengthItem(idx + 1).should("contain.text", text);
    });

    // password matching
    cy.get("#amplify-id-\\:rh\\:").clear().type("Neverguess123!");
    cy.get("#amplify-id-\\:rk\\:").type("Different123!").blur();
    cy.get("#amplify-id-\\:rj\\: > .amplify-text").should(
      "contain.text",
      "Your passwords must match"
    );
    cy.get("#amplify-id-\\:rk\\:").clear().type("Neverguess123!").blur();
    cy.get("#amplify-id-\\:rj\\: > .amplify-text").should("not.exist");

    // checkboxes
    cy.get('div[data-cy="checkboxPrivacy"]').click();
    cy.get(".amplify-button--primary").should("have.attr", "disabled");
    cy.get('[data-cy="checkboxPilot"]').click();
    cy.get(".amplify-input").first().focus().blur();
    cy.get(".amplify-button--primary").should("be.enabled");

    // footer links
    assertFooterLinks(1, 2, "when-i-sign-up");
  });
});

export {};
