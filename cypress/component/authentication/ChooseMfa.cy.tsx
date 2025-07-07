/// <reference types="cypress" />
/// <reference path="../../support/index.d.ts" />

import { mount } from "cypress/react18";
import { Provider, useDispatch } from "react-redux";
import { Router } from "react-router-dom";
import store from "../../../redux/store/store";
import ChooseMfa from "../../../components/authentication/setMfa/ChooseMfa";
import history from "../../../components/navigation/history";
import React from "react";
import { MFAType, updatedPreferredMfa } from "../../../redux/slices/userSlice";

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
      "The most secure MFA is an Authenticator App "
    );
    cy.get('[data-cy="mfaSetup"]')
      .should("exist")
      .should("include.text", "Before you can access TIS Self-Service");
  });

  const testMfaType = (
    mfaType: MFAType,
    expectedText: string,
    dataCyTag: string
  ) => {
    const MockedChooseMfa = () => {
      const dispatch = useDispatch();
      dispatch(updatedPreferredMfa(mfaType));
      return <ChooseMfa />;
    };

    mount(
      <Provider store={store}>
        <Router history={history}>
          <MockedChooseMfa />
        </Router>
      </Provider>
    );

    cy.get(`[data-cy="${dataCyTag}"]`)
      .should("exist")
      .should("include.text", expectedText);
  };

  it("should render 'TOTP' message when Authenticator App is the preferred MFA", () => {
    testMfaType(
      "TOTP",
      "Authenticator App MFA is currently your preferred MFA method",
      "mfaAlreadyWarning"
    );
  });

  it("should render 'EMAIL' message when Email is the preferred MFA", () => {
    testMfaType(
      "EMAIL",
      "Email MFA is currently your preferred MFA method",
      "mfaAlreadyWarning"
    );
  });

  it("should render the SMS deprecation message when SMS is the preferred MFA", () => {
    testMfaType(
      "SMS",
      "We no longer support SMS as an MFA method",
      "mfaAlreadyWarning"
    );
  });
});
