/// <reference types="cypress" />
/// <reference path="../../../../../cypress/support/index.d.ts" />

import { mount } from "@cypress/react";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import store from "../../../../redux/store/store";
import MFA from "../MFA";

describe("MFA", () => {
  it("should render the default route", () => {
    mount(
      <Provider store={store}>
        <BrowserRouter>
          <MFA user={{ username: "jeff" }} mfa="NOMFA" />
        </BrowserRouter>
      </Provider>
    );
    cy.get(".nhsuk-fieldset__heading")
      .should("exist")
      .should("include.text", "Set up Multi-Factor Authentication (MFA)");
  });
});
