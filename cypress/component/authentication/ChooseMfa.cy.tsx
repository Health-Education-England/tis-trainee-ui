/// <reference types="cypress" />
/// <reference path="../../support/index.d.ts" />

import { mount } from "cypress/react18";
import { Provider, useDispatch } from "react-redux";
import { Router } from "react-router-dom";
import store from "../../../redux/store/store";
import ChooseMfa from "../../../components/authentication/setMfa/ChooseMfa";
import history from "../../../components/navigation/history";
import React from "react";
import { updatedPreferredMfa } from "../../../redux/slices/userSlice";

describe("ChooseMfa", () => {
  it("should render the MFA options and error if no selection made", () => {
    mount(
      <Provider store={store}>
        <Router history={history}>
          <ChooseMfa />
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
    cy.get('[data-cy="mfaSetupText"]')
      .should("exist")
      .should("include.text", "Before you can access TIS Self-Service");
  });

  it("should render the 'MFA already set-up' warning msg if MFA has been set.", () => {
    const MockedChooseMfaAlreadyMfa = () => {
      const dispatch = useDispatch();
      dispatch(updatedPreferredMfa("SMS"));
      return <ChooseMfa />;
    };
    mount(
      <Provider store={store}>
        <Router history={history}>
          <MockedChooseMfaAlreadyMfa />
        </Router>
      </Provider>
    );
    cy.get('[data-cy="mfaAlreadyText"]')
      .should("exist")
      .should("include.text", "You have already set up SMS for MFA");
  });
});
