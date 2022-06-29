/// <reference types="cypress" />
/// <reference path="../../../../../cypress/support/index.d.ts" />

import { mount } from "@cypress/react";
import { Provider } from "react-redux";
import { Router } from "react-router-dom";
import store from "../../../../redux/store/store";
import MFA from "../MFA";
import history from "../../../navigation/history";

describe("MFA", () => {
  it("should render the default route", () => {
    mount(
      <Provider store={store}>
        <Router history={history}>
          <MFA user={{ username: "jeff" }} mfa="NOMFA" />
        </Router>
      </Provider>
    );
    cy.get(".nhsuk-fieldset__heading")
      .should("exist")
      .should("include.text", "Set up Multi-Factor Authentication (MFA)");
  });
});
