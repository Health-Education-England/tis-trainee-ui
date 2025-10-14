import { mount } from "cypress/react";
import { Router } from "react-router-dom";
import history from "../../../components/navigation/history";
import { Authenticator } from "@aws-amplify/ui-react";
import { EmailsBtn } from "../../../components/notifications/EmailsBtn";

const comp = () => (
  <Authenticator.Provider>
    <Router history={history}>
      <EmailsBtn />
    </Router>
  </Authenticator.Provider>
);

describe("Email Icon and Badge display", () => {
  beforeEach(() => {
    cy.viewport(1024, 768);
    mount(comp());
  });

  it("should contain email Icon", () => {
    cy.get('[data-cy="emailBtn"]').should("be.visible");
  });
});

describe("Email notification display in mobile view", () => {
  beforeEach(() => {
    cy.viewport(900, 768);
    mount(comp());
  });

  it("should contain email notification Icon", () => {
    mount(comp());
    cy.get('[data-cy="emailBtn"]').should("be.visible");
  });
});
