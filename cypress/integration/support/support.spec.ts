describe("Support", () => {
  before(() => {
    cy.visit("./");
    cy.confirmCookie();
  });

  it("should contact support", () => {
    cy.viewport("iphone-6");
    cy.signIn();
    cy.get("[data-cy=BtnMenu]").should("exist").click();
    cy.contains("Support").click();
    cy.logout();
  });
});
