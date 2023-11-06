describe("Support", () => {
  before(() => {
    cy.signInToTss(30000, undefined, "iphone-6");
  });

  it("should contact support", () => {
    cy.get('[data-cy="menuToggleBtn"]').should("exist").click();
    cy.get('[data-cy="Support"]').first().should("exist").click(); // Note: the first is chosen becuase card also has the same data-cy (oops)
  });
});

export {};
