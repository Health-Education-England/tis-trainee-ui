/// <reference types="cypress" />
describe("Profile", () => {
  before(() => {
    cy.wait(30000);
    cy.visit("./profile");
    cy.signIn();
  });

  it("should click expand to show all personal information then toggle close", () => {
    cy.contains("Personal details").should("exist").click();
    cy.contains("Gender").should("exist");
    cy.contains("Registration details").should("exist");
    cy.contains("Personal details").click();
    cy.contains("Gender").should("not.be.visible");
    cy.contains("Registration details").should("not.be.visible");
  });

  it("should click expand to show placement information then toggle close", () => {
    cy.contains("Placements").should("exist").click();
    cy.contains("Site").should("exist");
    cy.contains("Specialty").should("exist");
    cy.contains("Placements").click();
    cy.contains("Grade").should("exist");
    cy.contains("Placement Type").should("exist");
    cy.contains("Site").should("not.be.visible");
    cy.contains("Specialty").should("not.be.visible");
  });

  it("should click expand to show placement information then toggle close", () => {
    cy.contains("Programmes").should("exist").click();
    cy.get(".nhsuk-details__text").should("exist");
  });
});
