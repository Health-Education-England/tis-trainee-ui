/// <reference types="cypress" />
/// <reference path="../../support/index.d.ts" />

import { mount } from "cypress/react";
import { Provider } from "react-redux";
import { Router } from "react-router-dom";
import store from "../../../redux/store/store";
import MFA from "../../../components/authentication/setMfa/MFA";
import history from "../../../components/navigation/history";
import React from "react";

describe("MFA", () => {
  it("should render the default route", () => {
    mount(
      <Provider store={store}>
        <Router history={history}>
          <MFA />
        </Router>
      </Provider>
    );
    cy.get(".nhsuk-fieldset__heading")
      .should("exist")
      .should("include.text", "MFA (Multi-Factor Authentication) set-up");
  });
});
