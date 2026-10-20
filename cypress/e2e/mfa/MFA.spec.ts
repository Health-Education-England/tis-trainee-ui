describe("MFA set-up", () => {
  before(() => {
    cy.signInToTss("/mfa");
  });
  it("should render the Choose MFA page", () => {
    cy.get(`[data-cy="mfaAlreadyWarning"]`)
      .should("exist")
      .should(
        "include.text",
        "Authenticator App MFA is currently your preferred MFA method"
      );
  });
  // see mfa Cypress Component and RTL Jest tests for more detailed coverage
});

export {};
