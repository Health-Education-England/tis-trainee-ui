/// <reference types="cypress" />
/// <reference path="../../../../../cypress/support/index.d.ts" />

import { mount } from "@cypress/react";
import { Provider } from "react-redux";
import { Router } from "react-router-dom";
import store from "../../../../redux/store/store";
import ChooseMfa from "../ChooseMfa";
import history from "../../../navigation/history";

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
