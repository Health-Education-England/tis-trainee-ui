/// <reference types="cypress" />
/// <reference path="../../support/index.d.ts" />

const getPasswordStrengthItem = (text: string) =>
  cy.get('input[name="password"]').last().closest("form").contains(text);

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
  cy.contains('button[role="tab"]', "Create Account").click();
  cy.get('input[name="given_name"]').type(username);
  cy.get('input[name="family_name"]').type(familyName);
  cy.get('input[name="email"]').last().type(email);
  cy.get('input[name="password"]').last().type(password).blur();
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
    ].forEach(text => {
      getPasswordStrengthItem(text).should("be.visible");
    });

    // password matching
    cy.get('input[name="password"]').last().clear().type("Neverguess123!");
    cy.get('input[name="confirm_password"]').type("Different123!").blur();
    cy.contains(".amplify-text", "Your passwords must match").should(
      "be.visible"
    );
    cy.get('input[name="confirm_password"]')
      .clear()
      .type("Neverguess123!")
      .blur();
    cy.contains(".amplify-text", "Your passwords must match").should(
      "not.exist"
    );

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

describe("Authenticated session", () => {
  before(() => {
    cy.signInToTss(30000);
  });

  it("should store auth tokens in sessionStorage", () => {
    cy.window().then(win => {
      const sessionKeys = Object.keys(win.sessionStorage);
      const localKeys = Object.keys(win.localStorage);

      expect(
        sessionKeys.some(key =>
          key.startsWith("CognitoIdentityServiceProvider")
        )
      ).to.eq(true);
      expect(
        localKeys.some(key => key.startsWith("CognitoIdentityServiceProvider"))
      ).to.eq(false);
    });
  });
});

export {};
