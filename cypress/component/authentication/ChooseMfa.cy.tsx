/// <reference types="cypress" />
/// <reference path="../../support/index.d.ts" />

import { mount } from "cypress/react18";
import { Provider } from "react-redux";
import { Router } from "react-router-dom";
import store from "../../../redux/store/store";
import ChooseMfa from "../../../components/authentication/setMfa/ChooseMfa";
import history from "../../../components/navigation/history";
import React from "react";

describe("ChooseMfa", () => {
  it("should render the MFA options and error if no selection made", () => {
    mount(
      <Provider store={store}>
        <Router history={history}>
          <ChooseMfa mfa="NOMFA" />
        </Router>
      </Provider>
    );
    cy.get("[data-cy=BtnSubmitMfaChoice]").should("exist").click();
    cy.get("#mfaChoice--error-message")
      .should("exist")
      .should("include.text", "Error");
    cy.get("[data-cy=mfaChoice0]").click();
    cy.get("#mfaChoice--error-message").should("not.exist");
    cy.get("[data-cy=mfaSummary]").should("exist").click();
    cy.get("[data-cy=whyTotpText] > p").should(
      "include.text",
      "We recommend installing an Authenticator App to generate the 6-digit code as this is more secure and reliable than SMS."
    );
  });
});
