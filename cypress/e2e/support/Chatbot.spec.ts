describe("Chatbot", () => {
  before(() => {
    cy.signInToTss(30000);
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
