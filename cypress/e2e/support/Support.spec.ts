describe("Support", () => {
  before(() => {
    // Note: The 30s wait is to allow the MFA TOTP token to refresh (from a previous test)
    cy.wait(30000);
    cy.visit("/");
    cy.signIn();
  });

  it("should contact support", () => {
    cy.viewport("iphone-6");
    cy.get("[data-cy=BtnMenu]").should("exist").click();
    cy.contains("Support").click();
  });
});

export {};
