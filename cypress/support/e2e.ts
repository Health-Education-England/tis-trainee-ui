import "./commands";
import "@cypress/code-coverage/support";

before(() => {
  cy.task("generateOTP", Cypress.env("secret"), { log: false });
});
