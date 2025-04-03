/// <reference types="cypress" />
/// <reference path="../../support/index.d.ts" />

import { mount } from "cypress/react18";
import { Provider } from "react-redux";
import { Router } from "react-router-dom";
import { useAppDispatch } from "../../../redux/hooks/hooks";
import {
  updatedSmsSection,
  updatedTempMfa
} from "../../../redux/slices/userSlice";
import store from "../../../redux/store/store";
import CreateSms from "../../../components/authentication/setMfa//sms/CreateSms";
import history from "../../../components/navigation/history";
import React from "react";

describe("CreateSms sections", () => {
  it("should not render an sms section if NOMFA", () => {
    mount(
      <Provider store={store}>
        <Router history={history}>
          <CreateSms />
        </Router>
      </Provider>
    );
    cy.get(".nhsuk-card__heading").should("not.exist");
  });
  it("should render the verify sms component when section number is 1", () => {
    const MockedVerifySmsSection = () => {
      const dispatch = useAppDispatch();
      dispatch(updatedTempMfa("SMS"));
      return <CreateSms />;
    };
    mount(
      <Provider store={store}>
        <Router history={history}>
          <MockedVerifySmsSection />
        </Router>
      </Provider>
    );
    cy.get(".nhsuk-card__heading").should(
      "include.text",
      "I want to receive codes sent by SMS to this mobile"
    );
    cy.get(".PhoneInputCountrySelect").should("exist");
    cy.get(".PhoneInputInput").type("12");
    cy.get("#confirmTOTPCode--error-message")
      .should("exist")
      .should("include.text", "Please enter a valid mobile phone number.");
  });
  it("should render the confirm sms component when section number is 2", () => {
    const MockedConfirmSmsSection = () => {
      const dispatch = useAppDispatch();
      dispatch(updatedTempMfa("SMS"));
      dispatch(updatedSmsSection(2));
      return <CreateSms />;
    };
    mount(
      <Provider store={store}>
        <Router history={history}>
          <MockedConfirmSmsSection />
        </Router>
      </Provider>
    );
    cy.get(".nhsuk-card__heading")
      .should("exist")
      .should("include.text", "Enter the 6-digit code sent to your phone");
    cy.get("[data-cy=BtnSmsCodeSub]");
    cy.get("[data-cy=smsCode]").should("exist").type("123");
    cy.get("#smsCode--error-message")
      .should("exist")
      .should("include.text", "Code must be min 6 characters in length");
    cy.get("[data-cy=smsCode]").type("4567");
    // Test max length of 6
    cy.get("[data-cy=smsCode]")
      .should("have.value", "123456")
      .should("have.attr", "maxlength", "6");
    cy.get("#smsCode--error-message").should("not.exist");
    cy.get("[data-cy=BtnSmsCodeSub]").click();
    // return to section 1 when user status not "succeeded"
    cy.get("[data-cy=BtnContinue]").click();
    cy.get("#confirmTOTPCode--error-message").should(
      "include.text",
      "Please enter a mobile phone number"
    );
    cy.get("[data-cy=BtnContinue]").should("be.disabled");
  });
});
