describe("Support", () => {
  before(() => {
    cy.signInToTss(30000, undefined, "iphone-6");
  });

  it("should contact support", () => {
    cy.get("[data-cy=BtnMenu]").should("exist").click();
    cy.contains("Support").click();
  });
});

export {};
