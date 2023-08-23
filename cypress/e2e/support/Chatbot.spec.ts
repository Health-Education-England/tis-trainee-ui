describe("Chatbot", () => {
  before(() => {
    // Note: The 30s wait is to allow the MFA TOTP token to refresh (from a previous test)
    cy.wait(30000);
    cy.visit("/");
    // Wait for the chatbot to fully load.
    cy.wait(5000);
  });

  it("should display expandable widget", () => {
    const iframeBody = cy
      .get("#lex-web-ui-iframe")
      .should("exist")
      .find("iframe")
      .its("0.contentDocument")
      .should("exist")
      .its("body")
      .should("not.be.undefined");

    const lexWeb = iframeBody
      .find("#lex-web")
      .should("have.attr", "ui-minimized", "true");

    iframeBody.find("button").click();

    lexWeb.should("not.have.attr", "ui-minimized");
  });
});

export {};
